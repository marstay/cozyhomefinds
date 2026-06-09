/**
 * Central site configuration — edit this file to customize your store.
 * No code changes needed for most updates.
 */
export const siteConfig = {
  name: "Cozy Home Finds",
  tagline: "Curated home decor that makes every room feel like home",
  description:
    "Discover hand-picked home decor, cozy textiles, and stylish accents from Amazon. Curated collections for living rooms, bedrooms, kitchens, and more.",
  url: "https://cozyhomefinds.com",

  // Amazon Associates — set your tag in .env.local as AMAZON_ASSOCIATE_TAG
  amazon: {
    associateTag: process.env.AMAZON_ASSOCIATE_TAG ?? "cozyhomefinds-20",
    marketplace: "www.amazon.com",
  },

  navigation: [
    { label: "Home", href: "/" },
    { label: "Collections", href: "/collections" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
  ],

  social: {
    pinterest: "https://pinterest.com/cozyhomefinds",
    instagram: "https://instagram.com/cozyhomefinds",
  },

  footer: {
    disclaimer:
      "As an Amazon Associate, we earn from qualifying purchases. Prices and availability are accurate as of the date/time indicated and are subject to change.",
    copyright: `© ${new Date().getFullYear()} Cozy Home Finds. All rights reserved.`,
  },

  hero: {
    eyebrow: "Curated Home Decor",
    title: "Make every corner of your home feel cozy",
    subtitle:
      "Hand-picked decor, textiles, and accents — organized into collections so you can find the perfect piece faster.",
    ctaPrimary: { label: "Shop Collections", href: "/collections" },
    ctaSecondary: { label: "Read the Blog", href: "/blog" },
  },

  featured: {
    title: "Featured Finds",
    subtitle: "Our current favorites — updated weekly",
    productIds: [
      "B0C8XYZ001",
      "B0C8XYZ002",
      "B0C8XYZ003",
      "B0C8XYZ004",
      "B0C8XYZ005",
      "B0C8XYZ006",
      "B0C8XYZ007",
      "B0C8XYZ008",
    ],
  },

  newsletter: {
    enabled: true,
    title: "Get cozy inspiration in your inbox",
    subtitle: "New collections, seasonal picks, and decor tips — no spam.",
    placeholder: "Your email address",
    buttonLabel: "Subscribe",
  },
} as const;

export type SiteConfig = typeof siteConfig;
