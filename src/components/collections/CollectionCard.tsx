import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/lib/types";

interface CollectionCardProps {
  collection: Collection;
  productCount: number;
}

export function CollectionCard({ collection, productCount }: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group relative overflow-hidden rounded-2xl aspect-[4/3] block"
    >
      <Image
        src={collection.image}
        alt={collection.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-display text-2xl font-semibold text-white mb-1">
          {collection.title}
        </h3>
        <p className="text-white/80 text-sm line-clamp-2 mb-2">
          {collection.description}
        </p>
        <span className="text-white/70 text-xs font-medium">
          {productCount} products →
        </span>
      </div>
    </Link>
  );
}
