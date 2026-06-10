"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Collection, Product } from "@/lib/types";
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

interface CollectionFormProps {
  collection?: Collection;
}

export function CollectionForm({ collection }: CollectionFormProps) {
  const router = useRouter();
  const isNew = !collection;

  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    title: collection?.title ?? "",
    slug: collection?.slug ?? "",
    description: collection?.description ?? "",
    image: collection?.image ?? "",
    productIds: collection?.productIds ?? [] as string[],
    featured: collection?.featured ?? true,
    order: collection?.order?.toString() ?? "1",
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then(setProducts);
  }, []);

  function set(key: string, value: string | boolean | string[]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleProduct(id: string) {
    const ids = form.productIds.includes(id)
      ? form.productIds.filter((p) => p !== id)
      : [...form.productIds, id];
    set("productIds", ids);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const url = isNew
      ? "/api/admin/collections"
      : `/api/admin/collections/${collection!.id}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, order: parseInt(form.order, 10) }),
    });

    if (res.ok) {
      setMessage({ type: "success", text: isNew ? "Collection created!" : "Collection updated!" });
      if (isNew) {
        const data = await res.json();
        router.push(`/admin/collections/${data.collection.id}`);
      }
    } else {
      const err = await res.json();
      setMessage({ type: "error", text: err.error ?? "Failed to save" });
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!collection || !confirm("Delete this collection?")) return;
    setDeleting(true);
    await fetch(`/api/admin/collections/${collection.id}`, { method: "DELETE" });
    router.push("/admin/collections");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && <Alert type={message.type} message={message.text} />}

      <AdminCard>
        <h2 className="font-display text-lg font-semibold mb-4">Collection Info</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Title">
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </FormField>
          <FormField label="Slug" hint="URL path (auto-generated from title if empty)">
            <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="living-room" />
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Description">
              <Textarea rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} />
            </FormField>
          </div>
          <FormField label="Cover Image URL">
            <Input value={form.image} onChange={(e) => set("image", e.target.value)} required />
          </FormField>
          <FormField label="Display Order">
            <Input type="number" value={form.order} onChange={(e) => set("order", e.target.value)} />
          </FormField>
          <div className="md:col-span-2">
            <Checkbox label="Show on homepage" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="font-display text-lg font-semibold mb-4">
          Products in Collection ({form.productIds.length})
        </h2>
        <div className="grid gap-2 max-h-80 overflow-y-auto">
          {products.map((p) => (
            <label
              key={p.id}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-muted cursor-pointer"
            >
              <input
                type="checkbox"
                checked={form.productIds.includes(p.id)}
                onChange={() => toggleProduct(p.id)}
                className="h-4 w-4 rounded border-border text-accent"
              />
              <div className="h-8 w-8 rounded overflow-hidden bg-surface-muted flex-shrink-0 flex items-center justify-center text-[9px] text-muted">
                {(p.images?.[0] || p.image) ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={p.images?.[0] || p.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  "—"
                )}
              </div>
              <span className="text-sm truncate">{p.title}</span>
            </label>
          ))}
          {products.length === 0 && (
            <p className="text-sm text-muted">No products yet. Add products first.</p>
          )}
        </div>
      </AdminCard>

      <div className="flex items-center gap-4">
        <SaveButton saving={saving} label={isNew ? "Create Collection" : "Save Changes"} />
        {!isNew && <DeleteButton onClick={handleDelete} deleting={deleting} />}
      </div>
    </form>
  );
}
