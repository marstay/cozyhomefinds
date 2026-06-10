import { NextResponse } from "next/server";
import { requireAuth, jsonError } from "@/lib/admin/api";
import {
  readBlogPosts,
  writeBlogPost,
  slugify,
} from "@/lib/admin/storage";

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  return NextResponse.json(readBlogPosts());
}

export async function POST(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  const body = await request.json();

  if (!body.title) return jsonError("Title is required");
  if (!body.content) return jsonError("Content is required");

  const slug = body.slug ? slugify(body.slug) : slugify(body.title);
  const existing = readBlogPosts();

  if (existing.some((p) => p.slug === slug)) {
    return jsonError(`Blog post with slug "${slug}" already exists`);
  }

  const post = {
    slug,
    title: body.title,
    excerpt: body.excerpt ?? "",
    author: body.author ?? "Cozy Home Finds",
    publishedAt: body.publishedAt ?? new Date().toISOString().split("T")[0],
    image: body.image ?? "",
    tags: Array.isArray(body.tags)
      ? body.tags
      : typeof body.tags === "string"
        ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [],
    featured: Boolean(body.featured),
    content: body.content,
  };

  writeBlogPost(post);
  return NextResponse.json({ success: true, post }, { status: 201 });
}
