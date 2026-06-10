const RAPIDAPI_BASE =
  process.env.RAPIDAPI_AMAZON_BASE_URL ??
  "https://real-time-amazon-data-the-most-complete.p.rapidapi.com";

const RAPIDAPI_HOST =
  process.env.RAPIDAPI_AMAZON_HOST ??
  "real-time-amazon-data-the-most-complete.p.rapidapi.com";

const RAPIDAPI_COUNTRY = process.env.RAPIDAPI_AMAZON_COUNTRY ?? "US";

export interface ImportedProductData {
  asin: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  rating?: number;
  reviewCount?: number;
  image: string;
  images: string[];
  features: string[];
}

export interface SearchResult {
  asin: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  rating?: number;
  reviewCount?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiRecord = Record<string, any>;

export function isAmazonApiConfigured(): boolean {
  return Boolean(process.env.RAPIDAPI_KEY);
}

function getApiKey(): string {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) {
    throw new Error(
      "RapidAPI key not configured. Add RAPIDAPI_KEY to .env.local",
    );
  }
  return key;
}

async function rapidFetch(
  path: string,
  params: Record<string, string>,
): Promise<ApiRecord> {
  const url = new URL(`${RAPIDAPI_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString(), {
    headers: {
      "x-rapidapi-key": getApiKey(),
      "x-rapidapi-host": RAPIDAPI_HOST,
    },
    next: { revalidate: 0 },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      `RapidAPI error ${res.status}: ${JSON.stringify(json).slice(0, 200)}`,
    );
  }

  if (json.message && !json.data) {
    throw new Error(json.message);
  }

  return json;
}

function parsePriceValue(
  price: string | number | undefined | null,
): number {
  if (price === undefined || price === null) return 0;
  if (typeof price === "number") return price;
  const cleaned = price.replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
}

function imageUrlFromObject(img: ApiRecord): string | null {
  if (!img || typeof img !== "object") return null;
  return (
    img.hi_res ??
    img.large ??
    img.image ??
    img.url ??
    img.thumb ??
    null
  );
}

function parseImages(record: ApiRecord): string[] {
  const photos: string[] = [];

  if (Array.isArray(record.images)) {
    for (const img of record.images) {
      if (typeof img === "string" && img) {
        photos.push(img);
      } else {
        const url = imageUrlFromObject(img);
        if (url) photos.push(url);
      }
    }
  }

  if (Array.isArray(record.product_photos)) {
    photos.push(...record.product_photos.filter(Boolean));
  } else if (typeof record.product_photos === "string" && record.product_photos) {
    photos.push(record.product_photos);
  }

  const primary =
    record.product_photo ??
    record.image ??
    record.product_main_image_url ??
    record.main_image ??
    record.thumb_image_url;

  if (primary && !photos.includes(primary)) {
    photos.unshift(primary);
  }

  return [...new Set(photos.filter(Boolean))];
}

function parseFeatures(record: ApiRecord): string[] {
  const features: string[] = [];

  if (Array.isArray(record.bullet_points)) {
    features.push(...record.bullet_points.map(String).filter(Boolean));
  }
  if (Array.isArray(record.about_product)) {
    features.push(...record.about_product.map(String).filter(Boolean));
  } else if (typeof record.about_product === "string" && record.about_product) {
    features.push(record.about_product);
  }
  if (Array.isArray(record.feature_bullets)) {
    features.push(...record.feature_bullets.map(String).filter(Boolean));
  }
  if (Array.isArray(record.product_features)) {
    features.push(...record.product_features.map(String).filter(Boolean));
  }

  return [...new Set(features)];
}

function parseDescription(record: ApiRecord, features: string[]): string {
  const desc =
    record.description ??
    record.product_description ??
    record.content ??
    "";

  if (desc) return String(desc).trim();

  if (features.length > 0) {
    return features.slice(0, 2).join(" ");
  }

  return "";
}

function unwrapProduct(
  response: ApiRecord,
  fallbackAsin?: string,
): ApiRecord | null {
  const data = response.data ?? response;

  if (!data || typeof data !== "object") return null;
  if (Array.isArray(data)) return data[0] ?? null;

  if (Object.keys(data).length === 0) return null;

  if (data.asin || data.title || data.product_title) {
    return data;
  }

  if (fallbackAsin) {
    return { asin: fallbackAsin, ...data };
  }

  return null;
}

export function parseProductRecord(
  record: ApiRecord,
  fallbackAsin?: string,
): ImportedProductData | null {
  const asin = record.asin ?? fallbackAsin;
  if (!asin) return null;

  const title =
    record.title ??
    record.product_title ??
    record.name ??
    "";

  const images = parseImages(record);
  const image = images[0] ?? "";
  const features = parseFeatures(record);
  const description = parseDescription(record, features);

  const price = parsePriceValue(
    record.price ??
      record.product_price ??
      record.current_price,
  );

  const currency = record.currency ?? record.price_symbol ?? "USD";

  const ratingRaw =
    record.rating ??
    record.product_star_rating ??
    record.star_rating;
  const rating = ratingRaw ? parseFloat(String(ratingRaw)) : undefined;

  const reviewCountRaw =
    record.reviews_count ??
    record.product_num_ratings ??
    record.review_count;
  const reviewCount = reviewCountRaw
    ? parseInt(String(reviewCountRaw).replace(/,/g, ""), 10)
    : undefined;

  if (!title) return null;

  return {
    asin: String(asin).toUpperCase(),
    title,
    description,
    price,
    currency: currency === "$" ? "USD" : currency,
    rating,
    reviewCount,
    image,
    images,
    features,
  };
}

export async function fetchProductByAsin(
  asin: string,
): Promise<ImportedProductData> {
  const response = await rapidFetch("/product-details", {
    asin: asin.toUpperCase(),
    country: RAPIDAPI_COUNTRY,
  });

  const record = unwrapProduct(response, asin);
  if (!record) {
    throw new Error(
      `Product not found for ASIN ${asin}. Check the ASIN is valid and available on Amazon ${RAPIDAPI_COUNTRY}.`,
    );
  }

  const parsed = parseProductRecord(record, asin);
  if (!parsed) {
    throw new Error(`Could not parse product data for ASIN ${asin}`);
  }

  if (!parsed.image) {
    throw new Error(
      `Product found but no images returned for ASIN ${asin}. Try again or add images manually.`,
    );
  }

  return parsed;
}

export async function fetchProductsByAsins(
  asins: string[],
): Promise<{ imported: ImportedProductData[]; errors: string[] }> {
  const imported: ImportedProductData[] = [];
  const errors: string[] = [];

  for (const asin of asins) {
    try {
      const product = await fetchProductByAsin(asin);
      imported.push(product);
    } catch (err) {
      errors.push(
        err instanceof Error ? err.message : `Failed to import ${asin}`,
      );
    }
  }

  return { imported, errors };
}

export async function searchAmazonProducts(
  keyword: string,
  page = 1,
): Promise<SearchResult[]> {
  const response = await rapidFetch("/search", {
    query: keyword,
    page: String(page),
    country: RAPIDAPI_COUNTRY,
  });

  const data = response.data ?? response;
  const products: ApiRecord[] = data.products ?? data.results ?? [];

  const results: SearchResult[] = [];

  for (const item of products) {
    const parsed = parseProductRecord(item);
    if (!parsed?.image) continue;

    results.push({
      asin: parsed.asin,
      title: parsed.title,
      price: parsed.price,
      currency: parsed.currency,
      image: parsed.image,
      rating: parsed.rating,
      reviewCount: parsed.reviewCount,
    });
  }

  return results;
}
