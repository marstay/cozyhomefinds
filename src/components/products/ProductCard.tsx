import Image from "next/image";
import Link from "next/link";
import { buildAmazonAffiliateUrl } from "@/lib/amazon";
import { getProductThumbnail } from "@/lib/products";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { StarRating } from "@/components/ui/StarRating";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const affiliateUrl = buildAmazonAffiliateUrl(product.asin);
  const thumbnail = getProductThumbnail(product);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-surface-elevated border border-border/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-surface-muted">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">
            No image
          </div>
        )}
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
            {product.badge}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-display text-base font-medium leading-snug text-foreground line-clamp-2 group-hover:text-accent transition-colors">
            {product.title}
          </h3>
        </Link>

        {product.rating && (
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        )}

        <p className="text-lg font-semibold text-foreground">
          {formatPrice(product.price, product.currency)}
        </p>

        <a
          href={affiliateUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-auto flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
        >
          View on Amazon
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </article>
  );
}
