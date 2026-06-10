import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalList,
  LegalPage,
  LegalSection,
  siteLegalName,
} from "@/components/layout/LegalPage";
import { siteConfig } from "../../../../content/site.config";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: `Affiliate disclosure for ${siteConfig.name} — how we earn commissions.`,
};

export default function AffiliateDisclosurePage() {
  const name = siteLegalName();

  return (
    <LegalPage
      title="Affiliate Disclosure"
      description="Transparency about how we earn money and how it affects you."
    >
      <LegalSection title="Our Relationship with Amazon">
        <p>
          {name} is a participant in the Amazon Services LLC Associates Program,
          an affiliate advertising program designed to provide a means for sites
          to earn advertising fees by advertising and linking to Amazon.com.
        </p>
        <p>
          Our Amazon Associates tracking ID is{" "}
          <strong className="text-foreground">{siteConfig.amazon.associateTag}</strong>.
        </p>
      </LegalSection>

      <LegalSection title="What This Means for You">
        <p>
          When you click a &quot;View on Amazon&quot; or &quot;Buy on Amazon&quot;
          link on our site and make a qualifying purchase, we may earn a small
          commission. <strong className="text-foreground">This comes at no extra
          cost to you</strong> — the price you pay on Amazon is the same whether
          you use our link or go directly.
        </p>
      </LegalSection>

      <LegalSection title="FTC Disclosure">
        <p>
          In accordance with the U.S. Federal Trade Commission (FTC) guidelines,
          we disclose that we have a financial relationship with Amazon and
          other retailers mentioned on this site. Our recommendations are based
          on products we believe are useful for our readers, but we may receive
          compensation when you purchase through our links.
        </p>
      </LegalSection>

      <LegalSection title="Where You'll See Disclosures">
        <LegalList
          items={[
            "In the footer of every page on this site",
            "Near Amazon purchase buttons on product pages",
            "On this dedicated disclosure page",
            "In our About section and relevant blog posts",
          ]}
        />
      </LegalSection>

      <LegalSection title="Editorial Independence">
        <p>
          Affiliate partnerships do not influence our editorial content. We
          curate products we believe fit our aesthetic and quality standards.
          Not every product we feature earns us a commission, and we do not
          guarantee every linked product is the best option for every shopper.
        </p>
      </LegalSection>

      <LegalSection title="Prices and Availability">
        <p>
          Product prices and availability shown on our site are accurate at the
          time of listing but may change on Amazon without notice. Always check
          the current price on Amazon before purchasing.
        </p>
      </LegalSection>

      <LegalSection title="Amazon Trademarks">
        <p>
          Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its
          affiliates. {name} is not affiliated with, endorsed by, or sponsored
          by Amazon beyond participation in the Associates Program.
        </p>
      </LegalSection>

      <LegalSection title="Questions">
        <p>
          If you have questions about our affiliate relationships, please{" "}
          <Link href="/contact" className="text-accent hover:underline">
            contact us
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
