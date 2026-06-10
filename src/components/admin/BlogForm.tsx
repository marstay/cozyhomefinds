"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@/lib/types";
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
import { BlogEditor } from "@/components/admin/BlogEditor";

interface BlogFormProps {
  post?: BlogPost;
}

export function BlogForm({ post }: BlogFormProps) {
  const router = useRouter();
  const isNew = !post;

  const [form, setForm] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    author: post?.author ?? "Cozy Home Finds",
    publishedAt: post?.publishedAt ?? new Date().toISOString().split("T")[0],
    image: post?.image ?? "",
    tags: post?.tags?.join(", ") ?? "",
    featured: post?.featured ?? false,
    content: post?.content ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function set(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function aiContext() {
    return {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      tags: form.tags,
    };
  }

  async function generateField(field: GenerateField, targetKey: string) {
    if (!form.title.trim()) {
      setMessage({ type: "error", text: "Add a post title before generating with AI." });
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
      setMessage({ type: "error", text: "Add a post title before generating with AI." });
      return;
    }

    setGenerating("all");
    setMessage(null);

    const res = await fetch("/api/admin/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: ["blog-excerpt", "blog-content", "blog-tags"],
        context: aiContext(),
      }),
    });

    const data = await res.json();

    if (res.ok && data.results) {
      const r = data.results;
      setForm((prev) => ({
        ...prev,
        excerpt: r["blog-excerpt"] ?? prev.excerpt,
        content: r["blog-content"] ?? prev.content,
        tags: r["blog-tags"] ?? prev.tags,
      }));
      setMessage({ type: "success", text: "Excerpt, content, and tags generated!" });
    } else {
      setMessage({
        type: "error",
        text: data.error ?? "AI generation failed",
      });
    }
    setGenerating(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const url = isNew ? "/api/admin/blog" : `/api/admin/blog/${post!.slug}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setMessage({ type: "success", text: isNew ? "Post created!" : "Post updated!" });
      if (isNew) {
        const data = await res.json();
        router.push(`/admin/blog/${data.post.slug}`);
      }
    } else {
      const err = await res.json();
      setMessage({ type: "error", text: err.error ?? "Failed to save" });
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!post || !confirm("Delete this blog post?")) return;
    setDeleting(true);
    await fetch(`/api/admin/blog/${post.slug}`, { method: "DELETE" });
    router.push("/admin/blog");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AiSetupBanner />
      {message && <Alert type={message.type} message={message.text} />}

      <AdminCard>
        <h2 className="font-display text-lg font-semibold mb-4">Post Info</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Title">
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </FormField>
          <FormField label="Slug" hint="URL path (auto-generated from title if empty)">
            <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="my-post-slug" />
          </FormField>
          <FormField label="Author">
            <Input value={form.author} onChange={(e) => set("author", e.target.value)} />
          </FormField>
          <FormField label="Published Date">
            <Input type="date" value={form.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} />
          </FormField>
          <div className="md:col-span-2">
            <FormFieldWithAi
              label="Excerpt"
              hint="Short summary for cards and SEO"
              onGenerate={() => generateField("blog-excerpt", "excerpt")}
              generating={generating === "blog-excerpt"}
            >
              <Textarea rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
            </FormFieldWithAi>
          </div>
          <div className="md:col-span-2">
            <FormField label="Cover Image URL">
              <Input value={form.image} onChange={(e) => set("image", e.target.value)} />
            </FormField>
          </div>
          <FormFieldWithAi
            label="Tags"
            hint="Comma-separated"
            onGenerate={() => generateField("blog-tags", "tags")}
            generating={generating === "blog-tags"}
          >
            <Input value={form.tags} onChange={(e) => set("tags", e.target.value)} />
          </FormFieldWithAi>
          <div className="flex items-end">
            <Checkbox label="Featured on homepage" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="font-display text-lg font-semibold">Content</h2>
          <AiGenerateButton
            onClick={generateAllContent}
            loading={generating === "all"}
            label="Generate All"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label className="block text-sm font-medium text-foreground">Content</label>
            <AiGenerateButton
              onClick={() => generateField("blog-content", "content")}
              loading={generating === "blog-content"}
              label="Generate"
            />
          </div>
          <BlogEditor
            value={form.content}
            onChange={(content) => set("content", content)}
          />
          <p className="text-xs text-muted">
            Use the toolbar for headings, links, and lists — or switch to Preview to see how it will look.
          </p>
        </div>
      </AdminCard>

      <div className="flex items-center gap-4">
        <SaveButton saving={saving} label={isNew ? "Publish Post" : "Save Changes"} />
        {!isNew && <DeleteButton onClick={handleDelete} deleting={deleting} />}
      </div>
    </form>
  );
}
