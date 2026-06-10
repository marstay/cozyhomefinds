import { NextResponse } from "next/server";
import { requireAuth, jsonError } from "@/lib/admin/api";
import { buildProductFromBody } from "@/lib/admin/product-fields";
import {
  getCollectionIdsForProduct,
  readProducts,
  removeProductReferences,
  setProductCollections,
  syncFeaturedProductIds,
  writeProducts,
} from "@/lib/admin/storage";
import { extractAsin } from "@/lib/amazon";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  const product = readProducts().find((p) => p.id === id || p.asin === id);

  if (!product) return jsonError("Product not found", 404);

  return NextResponse.json({
    ...product,
    collectionIds: getCollectionIdsForProduct(product.id),
  });
}

export async function PUT(request: Request, { params }: RouteParams) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();
  const products = readProducts();
  const index = products.findIndex((p) => p.id === id || p.asin === id);

  if (index === -1) return jsonError("Product not found", 404);

  const asin = extractAsin(body.asin ?? id) ?? id;

  const updated = buildProductFromBody(body, asin, products[index]);

  products[index] = updated;
  writeProducts(products);

  if (Array.isArray(body.collectionIds)) {
    setProductCollections(updated.id, body.collectionIds);
  }

  syncFeaturedProductIds();

  return NextResponse.json({
    success: true,
    product: updated,
    collectionIds: Array.isArray(body.collectionIds)
      ? body.collectionIds
      : getCollectionIdsForProduct(updated.id),
  });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  const products = readProducts();
  const filtered = products.filter((p) => p.id !== id && p.asin !== id);

  if (filtered.length === products.length) {
    return jsonError("Product not found", 404);
  }

  const deleted = products.find((p) => p.id === id || p.asin === id);
  writeProducts(filtered);

  if (deleted) {
    removeProductReferences(deleted.id);
    if (deleted.asin !== deleted.id) {
      removeProductReferences(deleted.asin);
    }
  }

  syncFeaturedProductIds();

  return NextResponse.json({ success: true });
}
