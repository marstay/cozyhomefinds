import { NextResponse } from "next/server";
import { requireAuth, jsonError } from "@/lib/admin/api";
import {
  readBlogPost,
  readBlogPosts,
  writeBlogPost,
  deleteBlogPost,
} from "@/lib/admin/storage";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { slug } = await params;
  const post = readBlogPost(slug);

  if (!post) return jsonError("Blog post not found", 404);

  return NextResponse.json(post);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { slug } = await params;
  const body = await request.json();
  const existing = readBlogPost(slug);

  if (!existing) return jsonError("Blog post not found", 404);

  const updated = {
    slug,
    title: body.title ?? existing.title,
    excerpt: body.excerpt ?? existing.excerpt,
    author: body.author ?? existing.author,
    publishedAt: body.publishedAt ?? existing.publishedAt,
    image: body.image ?? existing.image,
    tags: Array.isArray(body.tags)
      ? body.tags
      : typeof body.tags === "string"
        ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : existing.tags,
    featured:
      body.featured !== undefined ? Boolean(body.featured) : existing.featured,
    content: body.content ?? existing.content,
  };

  writeBlogPost(updated);
  return NextResponse.json({ success: true, post: updated });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { slug } = await params;

  if (!deleteBlogPost(slug)) {
    return jsonError("Blog post not found", 404);
  }

  return NextResponse.json({ success: true });
}
