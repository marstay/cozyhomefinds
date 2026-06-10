import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Collection, Product } from "@/lib/types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const PRODUCTS_PATH = path.join(CONTENT_DIR, "products.json");
const COLLECTIONS_PATH = path.join(CONTENT_DIR, "collections.json");
const SITE_PATH = path.join(CONTENT_DIR, "site.json");
const BLOG_DIR = path.join(CONTENT_DIR, "blog");
const NEWSLETTER_PATH = path.join(CONTENT_DIR, "newsletter-subscribers.json");

function writeJson(filePath: string, data: unknown): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

export function readProducts(): Product[] {
  return JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf-8")) as Product[];
}

export function writeProducts(products: Product[]): void {
  writeJson(PRODUCTS_PATH, products);
}

export function readCollections(): Collection[] {
  return JSON.parse(
    fs.readFileSync(COLLECTIONS_PATH, "utf-8"),
  ) as Collection[];
}

export function writeCollections(collections: Collection[]): void {
  writeJson(COLLECTIONS_PATH, collections);
}

export function readSiteConfig() {
  return JSON.parse(fs.readFileSync(SITE_PATH, "utf-8"));
}

export function writeSiteConfig(config: unknown): void {
  writeJson(SITE_PATH, config);
}

/** Keep site.json featured.productIds in sync with product.featured flags. */
export function syncFeaturedProductIds(): void {
  const products = readProducts();
  const site = readSiteConfig() as {
    featured?: { productIds?: string[] };
    [key: string]: unknown;
  };

  const featuredIds = products.filter((p) => p.featured).map((p) => p.id);
  const currentOrder = site.featured?.productIds ?? [];

  const ordered = [
    ...currentOrder.filter((id) => featuredIds.includes(id)),
    ...featuredIds.filter((id) => !currentOrder.includes(id)),
  ];

  if (!site.featured) site.featured = { productIds: [] };
  site.featured.productIds = ordered;
  writeSiteConfig(site);
}

/** Apply homepage featured list from site settings to product.featured flags. */
export function applyFeaturedProductIds(productIds: string[]): void {
  const selected = new Set(productIds);
  const products = readProducts().map((product) => ({
    ...product,
    featured: selected.has(product.id) || selected.has(product.asin),
  }));
  writeProducts(products);
}

export function getCollectionIdsForProduct(productId: string): string[] {
  return readCollections()
    .filter((collection) => collection.productIds.includes(productId))
    .map((collection) => collection.id);
}

/** Add or remove a product from the selected collections. */
export function setProductCollections(
  productId: string,
  collectionIds: string[],
): void {
  const selected = new Set(collectionIds);
  const collections = readCollections().map((collection) => {
    const hasProduct = collection.productIds.includes(productId);
    const shouldHave = selected.has(collection.id);

    if (shouldHave && !hasProduct) {
      return {
        ...collection,
        productIds: [...collection.productIds, productId],
      };
    }

    if (!shouldHave && hasProduct) {
      return {
        ...collection,
        productIds: collection.productIds.filter((id) => id !== productId),
      };
    }

    return collection;
  });

  writeCollections(collections);
}

/** Remove a product ID from all collections and the homepage featured list. */
export function removeProductReferences(productId: string): void {
  const collections = readCollections().map((collection) => ({
    ...collection,
    productIds: collection.productIds.filter(
      (id) => id !== productId,
    ),
  }));
  writeCollections(collections);

  const site = readSiteConfig() as {
    featured?: { productIds?: string[] };
    [key: string]: unknown;
  };

  if (site.featured?.productIds) {
    site.featured.productIds = site.featured.productIds.filter(
      (id) => id !== productId,
    );
    writeSiteConfig(site);
  }
}

export interface BlogPostFile {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  image: string;
  tags: string[];
  featured: boolean;
  content: string;
}

export function readBlogPosts(): BlogPostFile[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: data.slug as string,
        title: data.title as string,
        excerpt: data.excerpt as string,
        author: data.author as string,
        publishedAt: data.publishedAt as string,
        image: data.image as string,
        tags: (data.tags as string[]) ?? [],
        featured: (data.featured as boolean) ?? false,
        content,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime(),
    );
}

export function readBlogPost(slug: string): BlogPostFile | undefined {
  return readBlogPosts().find((p) => p.slug === slug);
}

export function writeBlogPost(post: BlogPostFile): void {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }

  const frontmatter = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    author: post.author,
    publishedAt: post.publishedAt,
    image: post.image,
    tags: post.tags,
    featured: post.featured,
  };

  const fileContent = matter.stringify(post.content.trim(), frontmatter);
  fs.writeFileSync(
    path.join(BLOG_DIR, `${post.slug}.md`),
    fileContent,
    "utf-8",
  );
}

export function deleteBlogPost(slug: string): boolean {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export interface NewsletterSubscriber {
  email: string;
  subscribedAt: string;
}

export function readNewsletterSubscribers(): NewsletterSubscriber[] {
  if (!fs.existsSync(NEWSLETTER_PATH)) return [];
  return JSON.parse(
    fs.readFileSync(NEWSLETTER_PATH, "utf-8"),
  ) as NewsletterSubscriber[];
}

export function addNewsletterSubscriber(email: string): {
  added: boolean;
  subscriber: NewsletterSubscriber;
} {
  const normalized = email.trim().toLowerCase();
  const subscribers = readNewsletterSubscribers();
  const existing = subscribers.find((s) => s.email === normalized);

  if (existing) {
    return { added: false, subscriber: existing };
  }

  const subscriber: NewsletterSubscriber = {
    email: normalized,
    subscribedAt: new Date().toISOString(),
  };

  subscribers.unshift(subscriber);
  writeJson(NEWSLETTER_PATH, subscribers);

  return { added: true, subscriber };
}
