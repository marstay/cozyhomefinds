import { NextResponse } from "next/server";
import { requireAuth, jsonError } from "@/lib/admin/api";
import { buildProductFromBody } from "@/lib/admin/product-fields";
import {
  readProducts,
  setProductCollections,
  syncFeaturedProductIds,
  writeProducts,
} from "@/lib/admin/storage";
import { extractAsin } from "@/lib/amazon";

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  return NextResponse.json(readProducts());
}

export async function POST(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  const body = await request.json();
  const asin = extractAsin(body.asin ?? body.amazonUrl ?? "");

  if (!asin) return jsonError("Valid ASIN or Amazon URL is required");
  if (!body.title) return jsonError("Title is required");
  const hasImage =
    body.image ||
    (typeof body.images === "string" && body.images.trim()) ||
    (Array.isArray(body.images) && body.images.length > 0);
  if (!hasImage) return jsonError("At least one image URL is required");
  if (body.price === undefined) return jsonError("Price is required");

  const products = readProducts();

  if (products.some((p) => p.asin === asin)) {
    return jsonError(`Product with ASIN ${asin} already exists`);
  }

  const product = buildProductFromBody(body, asin);

  products.push(product);
  writeProducts(products);

  if (Array.isArray(body.collectionIds)) {
    setProductCollections(product.id, body.collectionIds);
  }

  syncFeaturedProductIds();

  return NextResponse.json({ success: true, product }, { status: 201 });
}
