"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminCard,
  FormField,
  Input,
  Textarea,
  Checkbox,
  Alert,
} from "@/components/admin/AdminForm";
import { formatPrice } from "@/lib/utils";

interface SearchResult {
  asin: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  rating?: number;
  reviewCount?: number;
}

interface ImportedData {
  asin: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  rating?: number;
  reviewCount?: number;
  image: string;
  images?: string[];
  features?: string[];
}

export function AmazonImportPanel() {
  const router = useRouter();
  const [apiConfigured, setApiConfigured] = useState<boolean | null>(null);
  const [url, setUrl] = useState("");
  const [bulkUrls, setBulkUrls] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [preview, setPreview] = useState<ImportedData | null>(null);
  const [featured, setFeatured] = useState(false);
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/products/import")
      .then((r) => r.json())
      .then((d) => setApiConfigured(d.configured));
  }, []);

  async function importSingle(save = false) {
    if (!url.trim()) return;
    setLoading(true);
    setMessage(null);
    setPreview(null);

    const res = await fetch("/api/admin/products/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: url.trim(),
        save,
        featured,
        tags,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      if (save && data.product) {
        setMessage({ type: "success", text: `Imported: ${data.product.title}` });
        router.push(`/admin/products/${data.product.id}`);
      } else {
        setPreview(data.data);
        setMessage({ type: "success", text: "Product fetched! Review and save below." });
      }
    } else {
      setMessage({ type: "error", text: data.error ?? "Import failed" });
    }
    setLoading(false);
  }

  async function importBulk() {
    const urls = bulkUrls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);

    if (urls.length === 0) return;
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/admin/products/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls, save: true, featured, tags }),
    });

    const data = await res.json();

    if (res.ok) {
      const count = data.imported?.length ?? 0;
      const errCount = data.errors?.length ?? 0;
      setMessage({
        type: "success",
        text: `Imported ${count} product(s)${errCount ? ` (${errCount} skipped/failed)` : ""}`,
      });
      setBulkUrls("");
      router.refresh();
    } else {
      setMessage({ type: "error", text: data.error ?? "Bulk import failed" });
    }
    setLoading(false);
  }

  async function searchProducts() {
    if (!keyword.trim()) return;
    setSearching(true);
    setMessage(null);
    setSearchResults([]);

    const res = await fetch("/api/admin/products/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword: keyword.trim() }),
    });

    const data = await res.json();

    if (res.ok) {
      setSearchResults(data.results ?? []);
      if (data.results?.length === 0) {
        setMessage({ type: "error", text: "No products found for that search." });
      }
    } else {
      setMessage({ type: "error", text: data.error ?? "Search failed" });
    }
    setSearching(false);
  }

  async function importSearchResult(asin: string) {
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/admin/products/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asin, save: true, featured, tags }),
    });

    const data = await res.json();

    if (res.ok && data.product) {
      setMessage({ type: "success", text: `Imported: ${data.product.title}` });
      setSearchResults((prev) => prev.filter((r) => r.asin !== asin));
    } else {
      setMessage({ type: "error", text: data.error ?? "Import failed" });
    }
    setLoading(false);
  }

  if (apiConfigured === null) {
    return <p className="text-muted">Checking Amazon API...</p>;
  }

  if (!apiConfigured) {
    return (
      <AdminCard>
        <h2 className="font-display text-lg font-semibold mb-2">RapidAPI Setup Required</h2>
        <p className="text-sm text-muted mb-4">
          To import products automatically, add your RapidAPI key to{" "}
          <code className="text-xs bg-surface-muted px-1.5 py-0.5 rounded">.env.local</code>:
        </p>
        <pre className="text-xs bg-surface-muted rounded-lg p-4 overflow-x-auto">
{`RAPIDAPI_KEY=your-rapidapi-key
AMAZON_ASSOCIATE_TAG=your-tag-20`}
        </pre>
        <p className="text-xs text-muted mt-4">
          Subscribe to{" "}
          <a
            href="https://rapidapi.com/flybyapi1/api/real-time-amazon-data-the-most-complete"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Real-time Amazon Data on RapidAPI
          </a>{" "}
          and copy your API key from the RapidAPI dashboard.
        </p>
      </AdminCard>
    );
  }

  return (
    <div className="space-y-6">
      {message && <Alert type={message.type} message={message.text} />}

      <AdminCard>
        <h2 className="font-display text-lg font-semibold mb-4">Import by URL</h2>
        <div className="space-y-4">
          <FormField label="Amazon URL or ASIN" hint="Paste a product link — title, price, image, and rating are fetched automatically">
            <div className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://amazon.com/dp/B0XXXXXXXXX"
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => importSingle(false)}
                disabled={loading}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-surface-muted disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? "Fetching..." : "Preview"}
              </button>
              <button
                type="button"
                onClick={() => importSingle(true)}
                disabled={loading}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-50 whitespace-nowrap"
              >
                Import
              </button>
            </div>
          </FormField>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Tags (optional)">
              <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="living-room, textiles" />
            </FormField>
            <div className="flex items-end">
              <Checkbox label="Mark as featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            </div>
          </div>
        </div>
      </AdminCard>

      {preview && (
        <AdminCard>
          <h3 className="font-semibold mb-3">Preview</h3>
          <div className="flex gap-4">
            <div className="flex flex-wrap gap-2">
              {(preview.images?.length ? preview.images : preview.image ? [preview.image] : [])
                .slice(0, 6)
                .map((src, i) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img key={`${src}-${i}`} src={src} alt="" className="h-20 w-20 rounded-lg object-cover border border-border" />
                ))}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{preview.title}</p>
              <p className="text-sm text-muted mt-1">{formatPrice(preview.price, preview.currency)}</p>
              {preview.rating && (
                <p className="text-xs text-muted mt-1">
                  {preview.rating} stars ({preview.reviewCount?.toLocaleString()} reviews)
                </p>
              )}
              <p className="text-xs text-muted mt-2 line-clamp-3">{preview.description}</p>
              {preview.features && preview.features.length > 0 && (
                <p className="text-xs text-muted mt-2">
                  {preview.features.length} feature highlights
                </p>
              )}
              <button
                type="button"
                onClick={() => importSingle(true)}
                disabled={loading}
                className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-50"
              >
                Save to Store
              </button>
            </div>
          </div>
        </AdminCard>
      )}

      <AdminCard>
        <h2 className="font-display text-lg font-semibold mb-4">Bulk Import</h2>
        <FormField label="Multiple URLs (one per line)" hint="Import up to 10 products at a time">
          <Textarea
            rows={6}
            value={bulkUrls}
            onChange={(e) => setBulkUrls(e.target.value)}
            placeholder={"https://amazon.com/dp/B0XXXXXXXXX\nhttps://amazon.com/dp/B0YYYYYYYYY"}
          />
        </FormField>
        <button
          type="button"
          onClick={importBulk}
          disabled={loading}
          className="mt-3 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-50"
        >
          {loading ? "Importing..." : "Import All"}
        </button>
      </AdminCard>

      <AdminCard>
        <h2 className="font-display text-lg font-semibold mb-4">Search Amazon</h2>
        <div className="flex gap-2 mb-4">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="linen throw pillow covers"
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && searchProducts()}
          />
          <button
            type="button"
            onClick={searchProducts}
            disabled={searching}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-surface-muted disabled:opacity-50 whitespace-nowrap"
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {searchResults.map((result) => (
              <div
                key={result.asin}
                className="flex items-center gap-3 rounded-lg border border-border/60 p-3"
              >
                {result.image && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={result.image} alt="" className="h-12 w-12 rounded object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{result.title}</p>
                  <p className="text-xs text-muted">
                    {formatPrice(result.price, result.currency)}
                    {result.rating ? ` · ${result.rating}★` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => importSearchResult(result.asin)}
                  disabled={loading}
                  className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-dark disabled:opacity-50 flex-shrink-0"
                >
                  Import
                </button>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
