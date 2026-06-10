import { NextResponse } from "next/server";
import { requireAuth, jsonError } from "@/lib/admin/api";
import { extractAsin } from "@/lib/amazon";
import {
  isAmazonApiConfigured,
  fetchProductByAsin,
  fetchProductsByAsins,
} from "@/lib/amazon-api";
import { saveImportedProduct } from "@/lib/amazon-import";

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  return NextResponse.json({
    configured: isAmazonApiConfigured(),
    message: isAmazonApiConfigured()
      ? "RapidAPI Amazon Data API is configured and ready"
      : "Add RAPIDAPI_KEY to .env.local",
  });
}

export async function POST(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  if (!isAmazonApiConfigured()) {
    return jsonError(
      "RapidAPI not configured. Add RAPIDAPI_KEY to .env.local — see README for setup.",
      503,
    );
  }

  const body = await request.json();
  const { url, asin, urls, save, featured, tags, badge, collection } = body;

  try {
    if (urls && Array.isArray(urls)) {
      const asins = urls
        .map((u: string) => extractAsin(u))
        .filter((a): a is string => a !== null);

      if (asins.length === 0) {
        return jsonError("No valid ASINs found in the provided URLs");
      }

      const { imported, errors } = await fetchProductsByAsins(asins);

      if (save) {
        const saved = [];
        const saveErrors: string[] = [];

        for (const item of imported) {
          try {
            const product = saveImportedProduct(item, {
              featured: Boolean(featured),
              tags: typeof tags === "string"
                ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
                : tags,
              badge,
              collection,
            });
            saved.push(product);
          } catch (err) {
            saveErrors.push(
              err instanceof Error ? err.message : `Failed to save ${item.asin}`,
            );
          }
        }

        return NextResponse.json({
          success: true,
          imported: saved,
          errors: [...errors, ...saveErrors],
        });
      }

      return NextResponse.json({ success: true, imported, errors });
    }

    const targetAsin = extractAsin(asin ?? url ?? "");
    if (!targetAsin) {
      return jsonError("Valid Amazon URL or ASIN is required");
    }

    const data = await fetchProductByAsin(targetAsin);

    if (save) {
      const product = saveImportedProduct(data, {
        featured: Boolean(featured),
        tags: typeof tags === "string"
          ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
          : tags,
        badge,
        collection,
      });
      return NextResponse.json({ success: true, product, data });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : "Import failed",
      500,
    );
  }
}
