import { NextResponse } from "next/server";
import { requireAuth, jsonError } from "@/lib/admin/api";
import {
  isAmazonApiConfigured,
  searchAmazonProducts,
} from "@/lib/amazon-api";

export async function POST(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  if (!isAmazonApiConfigured()) {
    return jsonError(
      "RapidAPI not configured. Add RAPIDAPI_KEY to .env.local.",
      503,
    );
  }

  const { keyword, page } = await request.json();

  if (!keyword || typeof keyword !== "string") {
    return jsonError("Search keyword is required");
  }

  try {
    const results = await searchAmazonProducts(keyword.trim(), page ?? 1);
    return NextResponse.json({ success: true, results });
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : "Search failed",
      500,
    );
  }
}
