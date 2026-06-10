import productsData from "../../content/products.json";
import { siteConfig } from "../../content/site.config";
import type { Product } from "./types";

const products = productsData as Product[];

export function getProductImages(product: Product): string[] {
  const gallery = product.images?.filter(Boolean) ?? [];
  if (gallery.length > 0) return gallery;
  return product.image ? [product.image] : [];
}

export function getProductThumbnail(product: Product): string | null {
  const images = getProductImages(product);
  return images[0] ?? null;
}

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id || p.asin === id);
}

export function getFeaturedProducts(): Product[] {
  const order = siteConfig.featured.productIds;
  const featured = products.filter((p) => p.featured);

  return featured.sort((a, b) => {
    const aIndex = order.indexOf(a.id);
    const bIndex = order.indexOf(b.id);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

export function getProductsByIds(ids: string[]): Product[] {
  return ids
    .map((id) => getProductById(id))
    .filter((p): p is Product => p !== undefined);
}

export function getProductsByTag(tag: string): Product[] {
  return products.filter((p) => p.tags.includes(tag));
}
