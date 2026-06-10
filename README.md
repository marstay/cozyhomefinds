# Cozy Home Finds

A modern, maintainable Amazon affiliate store for curated home decor. Built with Next.js, file-based content, and zero database required.

## Features

- **Collections** — Organize products by room (living room, bedroom, kitchen, etc.)
- **Featured products** — Configurable homepage showcase
- **Blog** — Markdown-based articles for SEO and inspiration
- **Amazon affiliate links** — Auto-generated with your Associate tag
- **Admin dashboard** — Manage everything from `/admin` (products, collections, blog, site settings)
- **Product import script** — Add Amazon products from the command line or admin UI
- **Modern design** — Warm, editorial aesthetic inspired by top affiliate sites

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

## Admin Dashboard

Set `ADMIN_PASSWORD` in `.env.local`, then visit `/admin` to manage your entire store through the UI:

| Section | What you can do |
|---------|----------------|
| **Dashboard** | Overview stats and quick actions |
| **Site Settings** | Name, hero, featured products, social links, newsletter |
| **Products** | Add, edit, delete Amazon products; AI-generate descriptions |
| **Collections** | Create collections and assign products |
| **Blog** | Write and publish Markdown articles; AI-generate content |

Default local password (change this!): `cozyadmin123`

## Configuration

### Site settings

Edit via the admin dashboard at `/admin/site`, or edit `content/site.json` directly:

- Site name, tagline, and description
- Navigation links
- Hero section copy
- Featured product IDs
- Social links
- Newsletter settings

### Amazon Associate tag

Set your tracking ID in `.env.local`:

```
AMAZON_ASSOCIATE_TAG=your-tag-20
```

All "View on Amazon" and "Buy on Amazon" links automatically include this tag.

### Automatic product import (RapidAPI)

To import products automatically (title, price, image, rating fetched from Amazon), subscribe to [Real-time Amazon Data on RapidAPI](https://rapidapi.com/flybyapi1/api/real-time-amazon-data-the-most-complete) and add your key to `.env.local`:

```
RAPIDAPI_KEY=your-rapidapi-key
```

**In the admin dashboard:**
- Go to **Import** (`/admin/products/import`)
- Paste an Amazon URL and click **Import**
- Or search by keyword and import results
- Or bulk-import multiple URLs at once

**From the command line:**

```bash
# Auto-fetches details when API credentials are configured
npm run import-product -- "https://amazon.com/dp/B0XXXXXXXXX" --collection living-room
```

### AI content generation (OpenAI)

Generate product descriptions, feature bullets, tags, badges, and blog posts from the admin UI using GPT-4o mini. Add your OpenAI API key to `.env.local`:

```
OPENAI_API_KEY=your-openai-api-key
# Optional: OPENAI_MODEL=gpt-4o-mini
```

**In the admin dashboard:**
- **Products** — Click ✨ **Generate** next to any field, or **Generate All** for description, features, tags, and badge
- **Blog** — Generate excerpt, Markdown content, and tags from the post title

Works best after importing a product (so the AI has title and Amazon details as context).

## Managing Content

### Products (`content/products.json`)

Each product entry:

```json
{
  "id": "B0XXXXXXXXX",
  "asin": "B0XXXXXXXXX",
  "title": "Product Name",
  "description": "Short description",
  "price": 29.99,
  "currency": "USD",
  "rating": 4.5,
  "reviewCount": 1200,
  "image": "https://m.media-amazon.com/images/...",
  "tags": ["living-room", "textiles"],
  "featured": true,
  "badge": "Editor's Pick"
}
```

### Import a product from Amazon

**Automatic (recommended):** Add `RAPIDAPI_KEY` to `.env.local`, then:

```bash
npm run import-product -- "https://amazon.com/dp/B0XXXXXXXXX" --collection living-room --featured
```

**Manual fallback** (without API credentials):

```bash
npm run import-product -- "https://amazon.com/dp/B0XXXXXXXXX" \
  --title "Linen Throw Pillow Covers" \
  --price 24.99 \
  --image "https://m.media-amazon.com/images/I/..."
```

### Collections (`content/collections.json`)

```json
{
  "id": "living-room",
  "slug": "living-room",
  "title": "Living Room",
  "description": "Sofas, throws, lamps, and accents.",
  "image": "https://images.unsplash.com/...",
  "productIds": ["B0XXXXXXXXX", "B0YYYYYYYYY"],
  "featured": true,
  "order": 1
}
```

### Featured products (homepage)

Edit `featured.productIds` in `content/site.config.ts`:

```ts
featured: {
  title: "Featured Finds",
  subtitle: "Our current favorites",
  productIds: ["B0XXXXXXXXX", "B0YYYYYYYYY"],
},
```

### Blog posts (`content/blog/*.md`)

Create a new markdown file with frontmatter:

```markdown
---
title: "Your Post Title"
slug: your-post-slug
excerpt: "A short summary for cards and SEO."
author: "Cozy Home Finds"
publishedAt: "2026-06-09"
image: "https://images.unsplash.com/..."
tags: ["living-room", "tips"]
featured: true
---

Your article content here...
```

## Project Structure

```
content/
  site.config.ts      # Site-wide configuration
  products.json       # All products
  collections.json    # Room/style collections
  blog/               # Markdown blog posts

src/
  app/                # Next.js pages
  components/         # UI components
  lib/                # Data access & utilities

scripts/
  import-product.mjs  # CLI product importer
```

## Deploy

Works on [Vercel](https://vercel.com), Netlify, or any Node.js host:

```bash
npm run build
npm start
```

Set `AMAZON_ASSOCIATE_TAG` and `NEXT_PUBLIC_SITE_URL` in your hosting environment variables.

## Amazon Compliance

- All affiliate links include `rel="sponsored"` and open in a new tab
- Footer includes the required Amazon Associates disclaimer
- Prices shown are static — add a note that prices may vary on Amazon
