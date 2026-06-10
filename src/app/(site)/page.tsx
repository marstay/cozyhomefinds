import Link from "next/link";
import { Hero } from "@/components/layout/Hero";
import { Newsletter } from "@/components/layout/Newsletter";
import { Section, SectionHeader } from "@/components/layout/Section";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { ProductCard } from "@/components/products/ProductCard";
import { BlogCard } from "@/components/blog/BlogCard";
import {
  getCollectionProductCount,
  getFeaturedCollections,
} from "@/lib/collections";
import { getFeaturedProducts } from "@/lib/products";
import { getFeaturedPosts } from "@/lib/blog";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const collections = getFeaturedCollections();
  const products = getFeaturedProducts();
  const posts = getFeaturedPosts().slice(0, 2);

  return (
    <>
      <Hero />

      <Section>
        <SectionHeader
          title="Shop by Room"
          subtitle="Curated collections organized by space — find what you need faster"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              productCount={getCollectionProductCount(collection)}
            />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button href="/collections" variant="outline">
            View All Collections
          </Button>
        </div>
      </Section>

      <Section className="bg-surface-muted">
        <SectionHeader
          title="Featured Finds"
          subtitle="Our current favorites — hand-picked for quality and style"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Section>

      {posts.length > 0 && (
        <Section>
          <SectionHeader
            title="From the Blog"
            subtitle="Decor tips, room guides, and inspiration"
          />
          <div className="grid gap-8 sm:grid-cols-2">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/blog"
              className="text-sm font-medium text-accent hover:underline"
            >
              Read all articles →
            </Link>
          </div>
        </Section>
      )}

      <Newsletter />
    </>
  );
}
