import { NextResponse } from "next/server";
import {
  createSession,
  isAuthConfigured,
  verifyPassword,
} from "@/lib/admin/auth";

export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      { error: "Admin password not configured. Set ADMIN_PASSWORD in .env.local" },
      { status: 500 },
    );
  }

  const { password } = await request.json();

  if (!password || !verifyPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  await createSession();
  return NextResponse.json({ success: true });
}
