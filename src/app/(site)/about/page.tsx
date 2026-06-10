import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/layout/Section";
import { siteConfig } from "../../../../content/site.config";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${siteConfig.name} and our approach to curated home decor.`,
};

export default function AboutPage() {
  return (
    <Section className="pt-12">
      <SectionHeader title={`About ${siteConfig.name}`} />
      <div className="mx-auto max-w-2xl space-y-6 text-muted leading-relaxed">
        <p>
          {siteConfig.name} is a curated Amazon affiliate store dedicated to
          home decor that makes every room feel warm, intentional, and lived-in.
        </p>
        <p>
          We hand-pick products across categories — textiles, lighting, wall art,
          storage, and more — and organize them into room-based collections so
          you can find what you need without endless scrolling.
        </p>
        <p>
          Every product link on this site is an Amazon affiliate link. When you
          purchase through our links, we earn a small commission at no extra
          cost to you. This helps us keep curating and sharing decor inspiration.
          Read our full{" "}
          <Link href="/affiliate-disclosure" className="text-accent hover:underline">
            Affiliate Disclosure
          </Link>
          .
        </p>
        <p>
          Have a product suggestion or question?{" "}
          <Link href="/contact" className="text-accent hover:underline">
            Contact us
          </Link>{" "}
          or find us on{" "}
          <a
            href={siteConfig.social.pinterest}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Pinterest
          </a>
          .
        </p>
      </div>
    </Section>
  );
}
