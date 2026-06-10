"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { BlogPost } from "@/lib/types";
import { PageHeader } from "@/components/admin/AdminForm";
import { BlogForm } from "@/components/admin/BlogForm";

export default function EditBlogPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetch(`/api/admin/blog/${slug}`)
      .then((r) => r.json())
      .then(setPost);
  }, [slug]);

  if (!post) return <p className="text-muted">Loading...</p>;

  return (
    <>
      <PageHeader title="Edit Blog Post" description={post.title} />
      <BlogForm post={post} />
    </>
  );
}
