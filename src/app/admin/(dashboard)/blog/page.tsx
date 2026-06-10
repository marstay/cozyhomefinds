"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { PageHeader, AdminCard } from "@/components/admin/AdminForm";
import { formatDate } from "@/lib/utils";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  function load() {
    fetch("/api/admin/blog").then((r) => r.json()).then(setPosts);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(slug: string) {
    if (!confirm("Delete this blog post?")) return;
    setDeleting(slug);
    await fetch(`/api/admin/blog/${slug}`, { method: "DELETE" });
    load();
    setDeleting(null);
  }

  return (
    <>
      <PageHeader
        title="Blog"
        description="Write and manage decor tips and inspiration articles."
        action={
          <Link
            href="/admin/blog/new"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
          >
            + New Post
          </Link>
        }
      />

      <div className="space-y-4">
        {posts.map((post) => (
          <AdminCard key={post.slug} className="flex items-center gap-4 p-4">
            <div className="h-16 w-24 rounded-lg overflow-hidden bg-surface-muted flex-shrink-0">
              {post.image && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={post.image} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold truncate">{post.title}</h3>
                {post.featured && (
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent flex-shrink-0">Featured</span>
                )}
              </div>
              <p className="text-sm text-muted line-clamp-1 mt-0.5">{post.excerpt}</p>
              <p className="text-xs text-muted mt-1">{formatDate(post.publishedAt)}</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link href={`/admin/blog/${post.slug}`} className="text-sm text-accent hover:underline">
                Edit
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(post.slug)}
                disabled={deleting === post.slug}
                className="text-sm text-red-500 hover:underline disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </AdminCard>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-center text-muted py-12">No blog posts yet.</p>
      )}
    </>
  );
}
