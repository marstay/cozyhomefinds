"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { getProductThumbnail } from "@/lib/products";
import { PageHeader, AdminCard } from "@/components/admin/AdminForm";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  function load() {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then(setProducts);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
    setDeleting(null);
  }

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage your Amazon affiliate products."
        action={
          <div className="flex gap-2">
            <Link
              href="/admin/products/import"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-surface-muted transition-colors"
            >
              Import from Amazon
            </Link>
            <Link
              href="/admin/products/new"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
            >
              + Add Product
            </Link>
          </div>
        }
      />

      <AdminCard className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-muted text-left">
              <th className="px-4 py-3 font-medium text-muted">Product</th>
              <th className="px-4 py-3 font-medium text-muted">ASIN</th>
              <th className="px-4 py-3 font-medium text-muted">Price</th>
              <th className="px-4 py-3 font-medium text-muted">Featured</th>
              <th className="px-4 py-3 font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const thumbnail = getProductThumbnail(p);
              return (
              <tr key={p.id} className="border-b border-border/60 hover:bg-surface-muted/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-surface-muted flex-shrink-0 flex items-center justify-center text-[10px] text-muted">
                      {thumbnail ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={thumbnail} alt="" className="h-full w-full object-cover" />
                      ) : (
                        "N/A"
                      )}
                    </div>
                    <span className="font-medium truncate max-w-[200px]">{p.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted font-mono text-xs">{p.asin}</td>
                <td className="px-4 py-3">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">
                  {p.featured ? (
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">Yes</span>
                  ) : (
                    <span className="text-muted text-xs">No</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-accent hover:underline text-xs"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                      className="text-red-500 hover:underline text-xs disabled:opacity-50"
                    >
                      {deleting === p.id ? "..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-8 text-center text-muted">No products yet. Add your first one!</p>
        )}
      </AdminCard>
    </>
  );
}
