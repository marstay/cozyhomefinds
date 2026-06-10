import { NextResponse } from "next/server";
import { requireAuth, jsonError } from "@/lib/admin/api";
import {
  applyFeaturedProductIds,
  readSiteConfig,
  writeSiteConfig,
} from "@/lib/admin/storage";

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  return NextResponse.json(readSiteConfig());
}

export async function PUT(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  const body = await request.json();

  if (!body.name || !body.tagline) {
    return jsonError("Name and tagline are required");
  }

  writeSiteConfig(body);

  if (Array.isArray(body.featured?.productIds)) {
    applyFeaturedProductIds(body.featured.productIds);
  }

  return NextResponse.json({ success: true });
}
