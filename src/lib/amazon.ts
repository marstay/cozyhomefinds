import { siteConfig } from "../../content/site.config";

export function buildAmazonAffiliateUrl(asin: string): string {
  const { marketplace, associateTag } = siteConfig.amazon;
  const params = new URLSearchParams({
    tag: associateTag,
    linkCode: "ogi",
    language: "en_US",
  });
  return `https://${marketplace}/dp/${asin}?${params.toString()}`;
}

export function extractAsin(input: string): string | null {
  const trimmed = input.trim();

  const patterns = [
    /\/dp\/([A-Z0-9]{10})/i,
    /\/gp\/product\/([A-Z0-9]{10})/i,
    /[?&]asin=([A-Z0-9]{10})/i,
    /^([A-Z0-9]{10})$/i,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1].toUpperCase();
  }

  return null;
}
