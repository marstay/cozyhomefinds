import type { Product } from "./types";
import type { ImportedProductData } from "./amazon-api";
import { readProducts, writeProducts, readCollections, writeCollections } from "./admin/storage";

export function importedToProduct(
  data: ImportedProductData,
  options?: { featured?: boolean; tags?: string[]; badge?: string },
): Product {
  return {
    id: data.asin,
    asin: data.asin,
    title: data.title,
    description: data.description,
    price: data.price,
    currency: data.currency,
    rating: data.rating,
    reviewCount: data.reviewCount,
    image: data.image,
    images: data.images.length > 0 ? data.images : undefined,
    features: data.features.length > 0 ? data.features : undefined,
    tags: options?.tags ?? [],
    featured: options?.featured ?? false,
    badge: options?.badge,
  };
}

export function saveImportedProduct(
  data: ImportedProductData,
  options?: {
    featured?: boolean;
    tags?: string[];
    badge?: string;
    collection?: string;
  },
): Product {
  const products = readProducts();

  if (products.some((p) => p.asin === data.asin)) {
    throw new Error(`Product with ASIN ${data.asin} already exists`);
  }

  const product = importedToProduct(data, options);
  products.push(product);
  writeProducts(products);

  if (options?.collection) {
    const collections = readCollections();
    const collection = collections.find((c) => c.slug === options.collection);
    if (collection && !collection.productIds.includes(data.asin)) {
      collection.productIds.push(data.asin);
      writeCollections(collections);
    }
  }

  return product;
}
