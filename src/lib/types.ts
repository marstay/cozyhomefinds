export interface Product {
  id: string;
  asin: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  rating?: number;
  reviewCount?: number;
  image: string;
  images?: string[];
  features?: string[];
  tags: string[];
  featured: boolean;
  badge?: string;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  productIds: string[];
  featured: boolean;
  order: number;
}

export interface BlogPost {
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
