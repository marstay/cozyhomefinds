#!/usr/bin/env node
/**
 * Import a product from Amazon into content/products.json
 *
 * Usage:
 *   node scripts/import-product.mjs <amazon-url-or-asin>
 *   node scripts/import-product.mjs <amazon-url-or-asin> --collection living-room --featured
 *
 * With RAPIDAPI_KEY in .env.local, product details are fetched automatically.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PRODUCTS_PATH = path.join(ROOT, "content", "products.json");
const COLLECTIONS_PATH = path.join(ROOT, "content", "collections.json");

const RAPIDAPI_BASE =
  process.env.RAPIDAPI_AMAZON_BASE_URL ??
  "https://real-time-amazon-data-the-most-complete.p.rapidapi.com";
const RAPIDAPI_HOST =
  process.env.RAPIDAPI_AMAZON_HOST ??
  "real-time-amazon-data-the-most-complete.p.rapidapi.com";
const RAPIDAPI_COUNTRY = process.env.RAPIDAPI_AMAZON_COUNTRY ?? "US";

function loadEnv() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
}

function extractAsin(input) {
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/i,
    /\/gp\/product\/([A-Z0-9]{10})/i,
    /[?&]asin=([A-Z0-9]{10})/i,
    /^([A-Z0-9]{10})$/i,
  ];
  for (const pattern of patterns) {
    const match = input.trim().match(pattern);
    if (match) return match[1].toUpperCase();
  }
  return null;
}

function parseArgs(argv) {
  const args = { positional: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    } else {
      args.positional.push(argv[i]);
    }
  }
  return args;
}

function parsePrice(price) {
  if (typeof price === "number") return price;
  if (!price) return 0;
  return parseFloat(String(price).replace(/[^0-9.]/g, "")) || 0;
}

function parseImages(record) {
  const photos = [];

  if (Array.isArray(record.images)) {
    for (const img of record.images) {
      if (typeof img === "string" && img) photos.push(img);
      else if (img && typeof img === "object") {
        const url = img.hi_res || img.large || img.image || img.thumb;
        if (url) photos.push(url);
      }
    }
  }

  if (Array.isArray(record.product_photos)) {
    photos.push(...record.product_photos.filter(Boolean));
  } else if (record.product_photos) {
    photos.push(record.product_photos);
  }

  const primary = record.image ?? record.product_photo ?? record.product_main_image_url;
  if (primary && !photos.includes(primary)) photos.unshift(primary);

  return [...new Set(photos.filter(Boolean))];
}

function parseFeatures(record) {
  const features = [];
  if (Array.isArray(record.bullet_points)) features.push(...record.bullet_points);
  if (Array.isArray(record.about_product)) features.push(...record.about_product);
  else if (typeof record.about_product === "string") features.push(record.about_product);
  if (Array.isArray(record.feature_bullets)) features.push(...record.feature_bullets);
  return [...new Set(features.map(String).filter(Boolean))];
}

function parseProduct(record, fallbackAsin) {
  const asin = record.asin ?? fallbackAsin;
  const title = record.title ?? record.product_title ?? "";
  const images = parseImages(record);
  const image = images[0] ?? "";
  const features = parseFeatures(record);
  const price = parsePrice(record.price ?? record.product_price);
  const rating = record.rating ?? record.product_star_rating;
  const reviewCount = record.reviews_count ?? record.product_num_ratings;

  const description =
    record.description ??
    record.product_description ??
    features.slice(0, 2).join(" ");

  return { asin, title, image, images, features, price, rating, reviewCount, description };
}

async function autoImport(asin) {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) return null;

  const url = new URL(`${RAPIDAPI_BASE}/product-details`);
  url.searchParams.set("asin", asin);
  url.searchParams.set("country", RAPIDAPI_COUNTRY);

  const res = await fetch(url, {
    headers: {
      "x-rapidapi-key": key,
      "x-rapidapi-host": RAPIDAPI_HOST,
    },
  });

  if (!res.ok) return null;

  const json = await res.json();
  if (json.message && (!json.data || Object.keys(json.data).length === 0)) {
    return null;
  }
  const product = json.data ?? json;
  if (!product || Object.keys(product).length === 0) return null;
  return parseProduct(Array.isArray(product) ? product[0] : product, asin);
}

async function main() {
  loadEnv();
  const args = parseArgs(process.argv.slice(2));

  if (args.positional.length === 0 || args.help) {
    console.log(`
Import a product from Amazon into content/products.json

Usage:
  node scripts/import-product.mjs <amazon-url-or-asin> [options]

With RAPIDAPI_KEY in .env.local, details are fetched automatically.

Optional:
  --title "Product Name"
  --price 29.99
  --image "https://..."
  --description "..."
  --rating 4.5
  --reviews 1234
  --tags "living-room,textiles"
  --featured true
  --badge "Editor's Pick"
  --collection living-room
`);
    process.exit(args.help ? 0 : 1);
  }

  const asin = extractAsin(args.positional[0]);
  if (!asin) {
    console.error("Error: Could not extract ASIN from input.");
    process.exit(1);
  }

  let auto = null;
  try {
    console.log(`Fetching product data for ${asin} via RapidAPI...`);
    auto = await autoImport(asin);
  } catch (err) {
    console.warn("Auto-import failed:", err.message);
  }

  const title = args.title ?? auto?.title;
  const price = args.price ?? auto?.price;
  const image = args.image ?? auto?.image;

  if (!title || price === undefined || !image) {
    console.error(
      "Error: Could not fetch product data. Add RAPIDAPI_KEY to .env.local or provide --title, --price, and --image manually.",
    );
    process.exit(1);
  }

  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf-8"));

  if (products.some((p) => p.asin === asin)) {
    console.error(`Error: Product with ASIN ${asin} already exists.`);
    process.exit(1);
  }

  const product = {
    id: asin,
    asin,
    title,
    description: args.description ?? auto?.description ?? "",
    price: parseFloat(price),
    currency: "USD",
    rating: args.rating ? parseFloat(args.rating) : auto?.rating ? parseFloat(auto.rating) : undefined,
    reviewCount: args.reviews ? parseInt(args.reviews, 10) : auto?.reviewCount ? parseInt(auto.reviewCount, 10) : undefined,
    image,
    ...(auto?.images?.length ? { images: auto.images } : {}),
    ...(auto?.features?.length ? { features: auto.features } : {}),
    tags: args.tags ? args.tags.split(",").map((t) => t.trim()) : [],
    featured: args.featured === "true" || args.featured === true,
    ...(args.badge ? { badge: args.badge } : {}),
  };

  products.push(product);
  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2) + "\n");
  console.log(`✓ Added product: ${product.title} (${asin})`);

  if (args.collection) {
    const collections = JSON.parse(
      fs.readFileSync(COLLECTIONS_PATH, "utf-8"),
    );
    const collection = collections.find((c) => c.slug === args.collection);
    if (!collection) {
      console.warn(`Warning: Collection "${args.collection}" not found.`);
    } else if (!collection.productIds.includes(asin)) {
      collection.productIds.push(asin);
      fs.writeFileSync(
        COLLECTIONS_PATH,
        JSON.stringify(collections, null, 2) + "\n",
      );
      console.log(`✓ Added to collection: ${collection.title}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
