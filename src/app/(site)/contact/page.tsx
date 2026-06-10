import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/layout/Section";
import { siteConfig } from "../../../../content/site.config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name}.`,
};

export default function ContactPage() {
  return (
    <Section className="pt-12">
      <SectionHeader
        title="Contact Us"
        subtitle="Questions, product suggestions, or privacy requests — we'd love to hear from you."
      />
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="rounded-2xl border border-border/60 bg-surface-elevated p-6 md:p-8 space-y-6">
          {siteConfig.contact.email && (
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-2">
                Email
              </h2>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-accent hover:underline"
              >
                {siteConfig.contact.email}
              </a>
            </div>
          )}

          {siteConfig.social.pinterest && (
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-2">
                Pinterest
              </h2>
              <a
                href={siteConfig.social.pinterest}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                @cozyhomefindsfy on Pinterest
              </a>
              <p className="mt-2 text-sm text-muted">
                Follow us for daily decor inspiration and message us there with
                product ideas.
              </p>
            </div>
          )}

          <div>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">
              Privacy requests
            </h2>
            <p className="text-muted leading-relaxed">
              To unsubscribe from our newsletter or request deletion of your
              email address, contact us using the methods above. Please include
              the email address you used to subscribe. See our{" "}
              <Link href="/privacy" className="text-accent hover:underline">
                Privacy Policy
              </Link>{" "}
              for details.
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-muted">
          We typically respond within a few business days.
        </p>
      </div>
    </Section>
  );
}
