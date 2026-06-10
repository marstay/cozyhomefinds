import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/admin/api";
import { readNewsletterSubscribers } from "@/lib/admin/storage";

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  const subscribers = readNewsletterSubscribers();

  return NextResponse.json({
    count: subscribers.length,
    subscribers,
  });
}
