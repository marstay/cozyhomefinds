import collectionsData from "../../content/collections.json";
import { getProductsByIds } from "./products";
import type { Collection, Product } from "./types";

const collections = (collectionsData as Collection[]).sort(
  (a, b) => a.order - b.order,
);

export function getAllCollections(): Collection[] {
  return collections;
}

export function getFeaturedCollections(): Collection[] {
  return collections.filter((c) => c.featured);
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getCollectionProducts(
  collection: Collection,
): Product[] {
  return getProductsByIds(collection.productIds);
}

export function getCollectionProductCount(collection: Collection): number {
  return getCollectionProducts(collection).length;
}
