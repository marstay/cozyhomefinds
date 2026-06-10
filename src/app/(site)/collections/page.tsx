import type { Metadata } from "next";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { Section, SectionHeader } from "@/components/layout/Section";
import {
  getAllCollections,
  getCollectionProductCount,
} from "@/lib/collections";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse curated home decor collections by room and style.",
};

export default function CollectionsPage() {
  const collections = getAllCollections();

  return (
    <Section className="pt-12">
      <SectionHeader
        title="All Collections"
        subtitle="Every piece organized by room and style — so you can shop with intention"
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            productCount={getCollectionProductCount(collection)}
          />
        ))}
      </div>
    </Section>
  );
}
