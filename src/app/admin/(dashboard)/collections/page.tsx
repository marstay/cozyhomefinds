"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Collection } from "@/lib/types";
import { PageHeader, AdminCard } from "@/components/admin/AdminForm";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  function load() {
    fetch("/api/admin/collections").then((r) => r.json()).then(setCollections);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this collection?")) return;
    setDeleting(id);
    await fetch(`/api/admin/collections/${id}`, { method: "DELETE" });
    load();
    setDeleting(null);
  }

  return (
    <>
      <PageHeader
        title="Collections"
        description="Organize products into room and style collections."
        action={
          <Link
            href="/admin/collections/new"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
          >
            + Add Collection
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {collections.map((c) => (
          <AdminCard key={c.id} className="p-0 overflow-hidden">
            <div className="relative h-32">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.image} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display font-semibold">{c.title}</h3>
                  <p className="text-xs text-muted mt-0.5">{c.productIds.length} products</p>
                </div>
                {c.featured && (
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">Featured</span>
                )}
              </div>
              <p className="text-sm text-muted mt-2 line-clamp-2">{c.description}</p>
              <div className="mt-3 flex gap-3">
                <Link href={`/admin/collections/${c.id}`} className="text-sm text-accent hover:underline">
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  disabled={deleting === c.id}
                  className="text-sm text-red-500 hover:underline disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      {collections.length === 0 && (
        <p className="text-center text-muted py-12">No collections yet.</p>
      )}
    </>
  );
}
