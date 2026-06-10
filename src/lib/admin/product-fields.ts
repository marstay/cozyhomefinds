import type { Product } from "@/lib/types";

function parseStringList(
  value: string | string[] | undefined,
): string[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) {
    const list = value.map(String).filter(Boolean);
    return list.length > 0 ? list : undefined;
  }
  const list = value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length > 0 ? list : undefined;
}

export function buildProductFromBody(
  body: Record<string, unknown>,
  asin: string,
  existing?: Product,
): Product {
  const images = parseStringList(body.images as string | string[] | undefined);
  const features = parseStringList(body.features as string | string[] | undefined);
  const image =
    (body.image as string) ||
    images?.[0] ||
    existing?.image ||
    existing?.images?.[0] ||
    "";

  return {
    id: asin,
    asin,
    title: (body.title as string) ?? existing?.title ?? "",
    description: (body.description as string) ?? existing?.description ?? "",
    price:
      body.price !== undefined
        ? parseFloat(String(body.price))
        : (existing?.price ?? 0),
    currency: (body.currency as string) ?? existing?.currency ?? "USD",
    rating:
      body.rating !== undefined
        ? parseFloat(String(body.rating))
        : existing?.rating,
    reviewCount:
      body.reviewCount !== undefined
        ? parseInt(String(body.reviewCount), 10)
        : existing?.reviewCount,
    image,
    images,
    features,
    tags: Array.isArray(body.tags)
      ? (body.tags as string[])
      : typeof body.tags === "string"
        ? body.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : (existing?.tags ?? []),
    featured:
      body.featured !== undefined
        ? Boolean(body.featured)
        : (existing?.featured ?? false),
    badge:
      body.badge !== undefined
        ? (body.badge as string) || undefined
        : existing?.badge,
  };
}
