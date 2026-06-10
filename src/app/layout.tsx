import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { siteConfig } from "../../content/site.config";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url,
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  verification: {
    google: "wbY9HnUxnE-fP_eEX89v0IIZSkk3-JT9XVkggPYIZLg",
  },
  other: {
    "p:domain_verify": "13bfa7feefc8552fab8b1ae3b222227f",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
