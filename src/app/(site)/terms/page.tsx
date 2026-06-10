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
  title: "Terms of Use",
  description: `Terms and conditions for using ${siteConfig.name}.`,
};

export default function TermsPage() {
  const name = siteLegalName();

  return (
    <LegalPage
      title="Terms of Use"
      description="Please read these terms before using our website."
    >
      <LegalSection title="Agreement">
        <p>
          By accessing or using {name} at{" "}
          <a href={siteConfig.url} className="text-accent hover:underline">
            {siteConfig.url.replace(/^https?:\/\//, "")}
          </a>
          , you agree to these Terms of Use. If you do not agree, please do not
          use the site.
        </p>
      </LegalSection>

      <LegalSection title="About This Site">
        <p>
          {name} is a curated content and product recommendation website. We
          provide home decor inspiration, blog articles, and links to products
          sold on Amazon and other retailers. We are not the seller of products
          featured on this site.
        </p>
      </LegalSection>

      <LegalSection title="Affiliate Links">
        <p>
          Many links on this site are affiliate links. We may earn a commission
          when you make a qualifying purchase through those links, at no extra
          cost to you. Please read our{" "}
          <Link href="/affiliate-disclosure" className="text-accent hover:underline">
            Affiliate Disclosure
          </Link>{" "}
          for more information.
        </p>
      </LegalSection>

      <LegalSection title="Product Information">
        <p>
          We strive to keep product information accurate, but prices,
          availability, descriptions, and images are provided by Amazon and third
          parties and may change without notice. Always verify details on the
          retailer&apos;s website before purchasing.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual Property">
        <p>
          All original content on this site — including text, layout, and
          branding — is owned by {name} unless otherwise stated. You may not
          copy, reproduce, or redistribute our content without written
          permission.
        </p>
        <p>
          Product images and descriptions belong to their respective owners
          (including Amazon and product manufacturers).
        </p>
      </LegalSection>

      <LegalSection title="User Conduct">
        <p>You agree not to:</p>
        <LegalList
          items={[
            "Use the site for any unlawful purpose",
            "Attempt to gain unauthorized access to our systems",
            "Scrape or harvest data from the site without permission",
            "Interfere with the proper functioning of the website",
          ]}
        />
      </LegalSection>

      <LegalSection title="Disclaimer of Warranties">
        <p>
          This site is provided &quot;as is&quot; without warranties of any
          kind. We do not guarantee that the site will be error-free,
          uninterrupted, or that product recommendations will meet your specific
          needs.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of Liability">
        <p>
          To the fullest extent permitted by law, {name} shall not be liable for
          any indirect, incidental, or consequential damages arising from your
          use of this site or purchases made through affiliate links.
        </p>
      </LegalSection>

      <LegalSection title="External Links">
        <p>
          Our site contains links to third-party websites. We are not
          responsible for the content, policies, or practices of those sites.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update these Terms of Use at any time. Continued use of the
          site after changes are posted constitutes acceptance of the updated
          terms.
        </p>
      </LegalSection>

      <LegalSection title="Governing Law">
        <p>
          These terms are governed by the laws of the United States. Any disputes
          shall be resolved in accordance with applicable local laws.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
