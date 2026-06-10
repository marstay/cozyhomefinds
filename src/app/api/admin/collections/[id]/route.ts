import { NextResponse } from "next/server";
import { requireAuth, jsonError } from "@/lib/admin/api";
import { readCollections, writeCollections } from "@/lib/admin/storage";
import type { Collection } from "@/lib/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  const collection = readCollections().find(
    (c) => c.id === id || c.slug === id,
  );

  if (!collection) return jsonError("Collection not found", 404);

  return NextResponse.json(collection);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();
  const collections = readCollections();
  const index = collections.findIndex((c) => c.id === id || c.slug === id);

  if (index === -1) return jsonError("Collection not found", 404);

  const updated: Collection = {
    ...collections[index],
    title: body.title ?? collections[index].title,
    description: body.description ?? collections[index].description,
    image: body.image ?? collections[index].image,
    productIds: body.productIds ?? collections[index].productIds,
    featured:
      body.featured !== undefined
        ? Boolean(body.featured)
        : collections[index].featured,
    order: body.order ?? collections[index].order,
  };

  collections[index] = updated;
  writeCollections(collections);

  return NextResponse.json({ success: true, collection: updated });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  const collections = readCollections();
  const filtered = collections.filter((c) => c.id !== id && c.slug !== id);

  if (filtered.length === collections.length) {
    return jsonError("Collection not found", 404);
  }

  writeCollections(filtered);
  return NextResponse.json({ success: true });
}
