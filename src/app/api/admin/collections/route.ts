import { NextResponse } from "next/server";
import { requireAuth, jsonError } from "@/lib/admin/api";
import {
  readCollections,
  writeCollections,
  slugify,
} from "@/lib/admin/storage";
import type { Collection } from "@/lib/types";

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  return NextResponse.json(readCollections());
}

export async function POST(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  const body = await request.json();

  if (!body.title) return jsonError("Title is required");
  if (!body.image) return jsonError("Image URL is required");

  const collections = readCollections();
  const slug = body.slug ? slugify(body.slug) : slugify(body.title);

  if (collections.some((c) => c.slug === slug)) {
    return jsonError(`Collection with slug "${slug}" already exists`);
  }

  const collection: Collection = {
    id: slug,
    slug,
    title: body.title,
    description: body.description ?? "",
    image: body.image,
    productIds: body.productIds ?? [],
    featured: Boolean(body.featured),
    order: body.order ?? collections.length + 1,
  };

  collections.push(collection);
  writeCollections(collections);

  return NextResponse.json({ success: true, collection }, { status: 201 });
}
