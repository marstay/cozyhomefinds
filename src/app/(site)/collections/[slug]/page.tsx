import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import { Section } from "@/components/layout/Section";
import {
  getAllCollections,
  getCollectionBySlug,
  getCollectionProducts,
} from "@/lib/collections";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCollections().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return { title: "Collection Not Found" };

  return {
    title: collection.title,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = getCollectionProducts(collection);

  return (
    <>
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src={collection.image}
          alt={collection.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
            <h1 className="font-display text-4xl font-semibold text-white md:text-5xl">
              {collection.title}
            </h1>
            <p className="mt-2 max-w-xl text-white/85 text-lg">
              {collection.description}
            </p>
          </div>
        </div>
      </div>

      <Section>
        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted py-12">
            Products coming soon for this collection.
          </p>
        )}
      </Section>
    </>
  );
}
