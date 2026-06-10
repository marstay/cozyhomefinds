"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface NewsletterFormProps {
  placeholder: string;
  buttonLabel: string;
}

export function NewsletterForm({ placeholder, buttonLabel }: NewsletterFormProps) {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage({ type: "success", text: data.message });
      setEmail("");
    } else {
      setMessage({
        type: "error",
        text: data.error ?? "Something went wrong. Please try again.",
      });
    }

    setLoading(false);
  }

  if (!mounted) {
    return (
      <div className="mx-auto max-w-lg text-left" aria-hidden="true">
        <div className="mb-2 block h-5 w-28 rounded bg-white/20" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <div className="min-h-[50px] min-w-0 flex-1 rounded-xl bg-white/90" />
          <div className="min-h-[50px] rounded-xl bg-foreground/90 px-6 sm:w-36" />
        </div>
      </div>
    );
  }

  return (
    <form className="mx-auto max-w-lg text-left" onSubmit={handleSubmit}>
      <label htmlFor="newsletter-email" className="mb-2 block text-sm font-medium text-white">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-xl border-2 border-white/30 bg-white px-4 py-3.5 text-sm text-foreground shadow-md placeholder:text-muted focus:border-white focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-60"
          required
          disabled={loading}
          suppressHydrationWarning
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-foreground px-6 py-3.5 text-sm font-semibold text-background shadow-md hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-60"
        >
          {loading ? "Subscribing..." : buttonLabel}
        </button>
      </div>
      {message && (
        <p
          className={`mt-4 rounded-xl px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-white/15 text-white"
              : "bg-red-900/30 text-white"
          }`}
          role="status"
        >
          {message.text}
        </p>
      )}
      <p className="mt-3 text-xs text-white/70">
        By subscribing, you agree to our{" "}
        <Link href="/privacy" className="underline hover:text-white">
          Privacy Policy
        </Link>
        . Unsubscribe anytime via our{" "}
        <Link href="/contact" className="underline hover:text-white">
          contact page
        </Link>
        .
      </p>
    </form>
  );
}
