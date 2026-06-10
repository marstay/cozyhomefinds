import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildAmazonAffiliateUrl } from "@/lib/amazon";
import { getAllProducts, getProductById, getProductImages } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/layout/Section";
import { ProductGallery } from "@/components/products/ProductGallery";
import { siteConfig } from "../../../../../content/site.config";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAllProducts().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Product Not Found" };

  const images = getProductImages(product);

  return {
    title: product.title,
    description: product.description,
    openGraph: { images: images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const affiliateUrl = buildAmazonAffiliateUrl(product.asin);
  const images = getProductImages(product);

  return (
    <Section className="pt-12">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={images} title={product.title} />

        <div className="flex flex-col gap-6">
          {product.badge && (
            <span className="inline-flex w-fit rounded-full bg-accent/10 px-4 py-1 text-xs font-semibold text-accent">
              {product.badge}
            </span>
          )}

          <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
            {product.title}
          </h1>

          {product.rating && (
            <StarRating
              rating={product.rating}
              reviewCount={product.reviewCount}
            />
          )}

          <p className="text-3xl font-semibold text-foreground">
            {formatPrice(product.price, product.currency)}
          </p>

          {product.description && (
            <p className="text-muted leading-relaxed">{product.description}</p>
          )}

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-muted capitalize"
                >
                  {tag.replace(/-/g, " ")}
                </span>
              ))}
            </div>
          )}

          <Button href={affiliateUrl} external className="w-full sm:w-auto text-base px-8 py-4">
            Buy on Amazon
          </Button>

          <p className="text-xs text-muted leading-relaxed border-t border-border/60 pt-4">
            {siteConfig.footer.disclaimer}
          </p>
        </div>
      </div>

      {product.features && product.features.length > 0 && (
        <div className="mt-16 max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
            Product Highlights
          </h2>
          <ul className="space-y-3">
            {product.features.map((feature, index) => (
              <li
                key={index}
                className="flex gap-3 text-muted leading-relaxed"
              >
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}
