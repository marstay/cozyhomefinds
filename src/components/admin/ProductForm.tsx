"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Collection, Product } from "@/lib/types";
import type { GenerateField } from "@/lib/ai/generate";
import {
  AdminCard,
  FormField,
  Input,
  Textarea,
  Checkbox,
  SaveButton,
  DeleteButton,
  Alert,
} from "@/components/admin/AdminForm";
import { AiGenerateButton, FormFieldWithAi } from "@/components/admin/AiGenerateButton";
import { AiSetupBanner } from "@/components/admin/AiSetupBanner";

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isNew = !product;

  const [form, setForm] = useState({
    asin: product?.asin ?? "",
    amazonUrl: "",
    title: product?.title ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    image: product?.image ?? "",
    images: product?.images?.join("\n") ?? "",
    features: product?.features?.join("\n") ?? "",
    rating: product?.rating?.toString() ?? "",
    reviewCount: product?.reviewCount?.toString() ?? "",
    tags: product?.tags?.join(", ") ?? "",
    featured: product?.featured ?? false,
    badge: product?.badge ?? "",
  });

  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionIds, setCollectionIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/collections")
      .then((r) => r.json())
      .then((data: Collection[]) => {
        setCollections(data);
        if (product) {
          setCollectionIds(
            data
              .filter((c) => c.productIds.includes(product.id))
              .map((c) => c.id),
          );
        }
      });
  }, [product?.id]);

  function set(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleCollection(id: string) {
    setCollectionIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }

  function aiContext() {
    return {
      title: form.title,
      asin: form.asin,
      price: form.price,
      description: form.description,
      features: form.features,
      tags: form.tags,
    };
  }

  async function generateField(field: GenerateField, targetKey: string) {
    if (!form.title.trim()) {
      setMessage({ type: "error", text: "Add a product title before generating with AI." });
      return;
    }

    setGenerating(field);
    setMessage(null);

    const res = await fetch("/api/admin/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, context: aiContext() }),
    });

    const data = await res.json();

    if (res.ok && data.content) {
      set(targetKey, data.content);
      setMessage({ type: "success", text: "Content generated!" });
    } else {
      setMessage({
        type: "error",
        text: data.error ?? "AI generation failed. Add OPENAI_API_KEY to .env.local",
      });
    }
    setGenerating(null);
  }

  async function generateAllContent() {
    if (!form.title.trim()) {
      setMessage({ type: "error", text: "Add a product title before generating with AI." });
      return;
    }

    setGenerating("all");
    setMessage(null);

    const res = await fetch("/api/admin/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: [
          "product-description",
          "product-features",
          "product-tags",
          "product-badge",
        ],
        context: aiContext(),
      }),
    });

    const data = await res.json();

    if (res.ok && data.results) {
      const r = data.results;
      setForm((prev) => ({
        ...prev,
        description: r["product-description"] ?? prev.description,
        features: r["product-features"] ?? prev.features,
        tags: r["product-tags"] ?? prev.tags,
        badge: r["product-badge"] ?? prev.badge,
      }));
      setMessage({ type: "success", text: "Description, features, tags, and badge generated!" });
    } else {
      setMessage({
        type: "error",
        text: data.error ?? "AI generation failed",
      });
    }
    setGenerating(null);
  }

  function applyImportedData(d: {
    asin: string;
    title: string;
    description?: string;
    price?: number;
    image?: string;
    images?: string[];
    features?: string[];
    rating?: number;
    reviewCount?: number;
  }) {
    setForm((prev) => ({
      ...prev,
      asin: d.asin,
      title: d.title,
      description: d.description ?? "",
      price: d.price?.toString() ?? "",
      image: d.image ?? d.images?.[0] ?? "",
      images: d.images?.join("\n") ?? "",
      features: d.features?.join("\n") ?? "",
      rating: d.rating?.toString() ?? "",
      reviewCount: d.reviewCount?.toString() ?? "",
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const url = isNew ? "/api/admin/products" : `/api/admin/products/${product!.id}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        asin: form.asin || form.amazonUrl,
        collectionIds,
      }),
    });

    if (res.ok) {
      setMessage({ type: "success", text: isNew ? "Product created!" : "Product updated!" });
      if (isNew) {
        const data = await res.json();
        router.push(`/admin/products/${data.product.id}`);
      }
    } else {
      const err = await res.json();
      setMessage({ type: "error", text: err.error ?? "Failed to save" });
    }
    setSaving(false);
  }

  async function handleAutoImport() {
    const input = form.amazonUrl || form.asin;
    if (!input.trim()) return;

    setImporting(true);
    setMessage(null);

    const res = await fetch("/api/admin/products/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: input.trim() }),
    });

    const data = await res.json();

    if (res.ok && data.data) {
      applyImportedData(data.data);
      setMessage({ type: "success", text: "Product details, gallery, and features imported!" });
    } else {
      setMessage({
        type: "error",
        text: data.error ?? "Auto-import failed. Add RAPIDAPI_KEY to .env.local or enter details manually.",
      });
    }
    setImporting(false);
  }

  async function handleDelete() {
    if (!product || !confirm("Delete this product permanently?")) return;
    setDeleting(true);
    await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    router.push("/admin/products");
  }

  const previewImages = form.images
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const galleryPreview = previewImages.length > 0 ? previewImages : form.image ? [form.image] : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AiSetupBanner />
      {message && <Alert type={message.type} message={message.text} />}

      <AdminCard>
        <h2 className="font-display text-lg font-semibold mb-4">Amazon Details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <FormField
              label={isNew ? "Amazon URL or ASIN" : "Re-import from Amazon"}
              hint="Paste a link and click Auto-Import to refresh gallery, description, and features"
            >
              <div className="flex gap-2">
                <Input
                  value={isNew ? (form.amazonUrl || form.asin) : (form.amazonUrl || form.asin)}
                  onChange={(e) => set("amazonUrl", e.target.value)}
                  placeholder="https://amazon.com/dp/B0XXXXXXXXX"
                  className="flex-1"
                  required={isNew}
                />
                <button
                  type="button"
                  onClick={handleAutoImport}
                  disabled={importing}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-50 whitespace-nowrap"
                >
                  {importing ? "Importing..." : "Auto-Import"}
                </button>
              </div>
            </FormField>
          </div>

          {!isNew && (
            <FormField label="ASIN">
              <Input value={form.asin} onChange={(e) => set("asin", e.target.value)} />
            </FormField>
          )}

          <FormFieldWithAi
            label="Title"
            onGenerate={() => generateField("product-title", "title")}
            generating={generating === "product-title"}
            generateLabel="Rewrite"
          >
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </FormFieldWithAi>

          <FormField label="Price (USD)">
            <Input type="number" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} required />
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Primary Image URL" hint="Used on product cards — first gallery image if empty">
              <Input value={form.image} onChange={(e) => set("image", e.target.value)} required />
            </FormField>
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="font-display text-lg font-semibold mb-4">Image Gallery</h2>
        <FormField label="Gallery Images" hint="One image URL per line — imported automatically from Amazon">
          <Textarea
            rows={6}
            value={form.images}
            onChange={(e) => set("images", e.target.value)}
            placeholder={"https://m.media-amazon.com/images/I/...\nhttps://m.media-amazon.com/images/I/..."}
          />
        </FormField>
        {galleryPreview.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {galleryPreview.slice(0, 8).map((src, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={`${src}-${i}`}
                src={src}
                alt=""
                className="h-20 w-20 rounded-lg object-cover border border-border"
              />
            ))}
            {galleryPreview.length > 8 && (
              <span className="flex h-20 w-20 items-center justify-center rounded-lg bg-surface-muted text-xs text-muted">
                +{galleryPreview.length - 8}
              </span>
            )}
          </div>
        )}
      </AdminCard>

      <AdminCard>
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="font-display text-lg font-semibold">Description & Features</h2>
          <AiGenerateButton
            onClick={generateAllContent}
            loading={generating === "all"}
            label="Generate All"
          />
        </div>
        <div className="grid gap-4">
          <FormFieldWithAi
            label="Description"
            hint="Full product description shown on the product page"
            onGenerate={() => generateField("product-description", "description")}
            generating={generating === "product-description"}
          >
            <Textarea rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </FormFieldWithAi>

          <FormFieldWithAi
            label="Feature Highlights"
            hint="One bullet point per line — shown as a list below the description"
            onGenerate={() => generateField("product-features", "features")}
            generating={generating === "product-features"}
          >
            <Textarea
              rows={6}
              value={form.features}
              onChange={(e) => set("features", e.target.value)}
              placeholder={"Soft linen-blend fabric\nMachine washable\nHidden zipper closure"}
            />
          </FormFieldWithAi>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Rating (1-5)">
              <Input type="number" step="0.1" min="1" max="5" value={form.rating} onChange={(e) => set("rating", e.target.value)} />
            </FormField>
            <FormField label="Review Count">
              <Input type="number" value={form.reviewCount} onChange={(e) => set("reviewCount", e.target.value)} />
            </FormField>

            <FormFieldWithAi
              label="Tags"
              hint="Comma-separated (e.g. living-room, textiles)"
              onGenerate={() => generateField("product-tags", "tags")}
              generating={generating === "product-tags"}
            >
              <Input value={form.tags} onChange={(e) => set("tags", e.target.value)} />
            </FormFieldWithAi>

            <FormFieldWithAi
              label="Badge"
              hint="Optional label like 'Editor's Pick'"
              onGenerate={() => generateField("product-badge", "badge")}
              generating={generating === "product-badge"}
            >
              <Input value={form.badge} onChange={(e) => set("badge", e.target.value)} />
            </FormFieldWithAi>
          </div>
          <Checkbox label="Mark as featured product" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="font-display text-lg font-semibold mb-1">Collections</h2>
        <p className="text-sm text-muted mb-4">
          Choose which room collections this product appears in.
        </p>
        <div className="grid gap-2 max-h-64 overflow-y-auto">
          {collections.map((collection) => (
            <label
              key={collection.id}
              className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-surface-muted cursor-pointer"
            >
              <input
                type="checkbox"
                checked={collectionIds.includes(collection.id)}
                onChange={() => toggleCollection(collection.id)}
                className="h-4 w-4 rounded border-border text-accent"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{collection.title}</p>
                <p className="text-xs text-muted truncate">{collection.description}</p>
              </div>
              <span className="text-xs text-muted shrink-0">
                {collection.productIds.length} items
              </span>
            </label>
          ))}
          {collections.length === 0 && (
            <p className="text-sm text-muted">
              No collections yet.{" "}
              <a href="/admin/collections/new" className="text-accent hover:underline">
                Create one
              </a>
            </p>
          )}
        </div>
      </AdminCard>

      <div className="flex items-center gap-4">
        <SaveButton saving={saving} label={isNew ? "Create Product" : "Save Changes"} />
        {!isNew && <DeleteButton onClick={handleDelete} deleting={deleting} />}
      </div>
    </form>
  );
}
