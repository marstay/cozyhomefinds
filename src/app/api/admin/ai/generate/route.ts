import { NextResponse } from "next/server";
import { requireAuth, jsonError } from "@/lib/admin/api";
import {
  generateFieldContent,
  generateProductFields,
  isAiConfigured,
  type GenerateField,
  type GenerateContext,
} from "@/lib/ai/generate";

const PRODUCT_FIELDS: GenerateField[] = [
  "product-description",
  "product-features",
  "product-tags",
  "product-badge",
  "product-title",
];

const BLOG_FIELDS: GenerateField[] = [
  "blog-excerpt",
  "blog-content",
  "blog-tags",
];

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  return NextResponse.json({
    configured: isAiConfigured(),
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    message: isAiConfigured()
      ? "OpenAI is configured and ready"
      : "Add OPENAI_API_KEY to .env.local",
  });
}

export async function POST(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  if (!isAiConfigured()) {
    return jsonError(
      "OpenAI not configured. Add OPENAI_API_KEY to .env.local",
      503,
    );
  }

  const body = await request.json();
  const { field, fields, context } = body as {
    field?: GenerateField;
    fields?: GenerateField[];
    context?: GenerateContext;
  };

  const ctx = context ?? {};

  if (!ctx.title && !ctx.excerpt && !ctx.content) {
    return jsonError("Provide at least a title in context");
  }

  try {
    if (fields && Array.isArray(fields)) {
      const valid = fields.filter((f) =>
        [...PRODUCT_FIELDS, ...BLOG_FIELDS].includes(f),
      );
      if (valid.length === 0) {
        return jsonError("No valid fields requested");
      }
      const result = await generateProductFields(valid, ctx);
      return NextResponse.json({ success: true, results: result });
    }

    if (!field) {
      return jsonError("field or fields is required");
    }

    const content = await generateFieldContent(field, ctx);
    return NextResponse.json({ success: true, field, content });
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : "Generation failed",
      500,
    );
  }
}
