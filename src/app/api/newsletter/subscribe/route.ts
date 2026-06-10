import { NextResponse } from "next/server";
import { addNewsletterSubscriber } from "@/lib/admin/storage";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  try {
    addNewsletterSubscriber(email);

    return NextResponse.json({
      success: true,
      message: "You're subscribed! Check your inbox for cozy inspiration soon.",
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
