import type { Metadata } from "next";
import { BlogCard } from "@/components/blog/BlogCard";
import { Section, SectionHeader } from "@/components/layout/Section";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Home decor tips, room guides, and cozy inspiration.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <Section className="pt-12">
      <SectionHeader
        title="The Cozy Blog"
        subtitle="Decor tips, room guides, and inspiration for every corner of your home"
      />
      {posts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted py-12">
          Blog posts coming soon.
        </p>
      )}
    </Section>
  );
}
