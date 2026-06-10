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
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name}. Learn how we collect and use your information.`,
};

export default function PrivacyPage() {
  const name = siteLegalName();

  return (
    <LegalPage
      title="Privacy Policy"
      description="How we handle your information when you visit our site or subscribe to our newsletter."
    >
      <LegalSection title="Overview">
        <p>
          {name} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates{" "}
          <a href={siteConfig.url} className="text-accent hover:underline">
            {siteConfig.url.replace(/^https?:\/\//, "")}
          </a>
          . This Privacy Policy explains what information we collect, how we use
          it, and your choices regarding that information.
        </p>
      </LegalSection>

      <LegalSection title="Information We Collect">
        <p>We may collect the following types of information:</p>
        <LegalList
          items={[
            "Email address when you subscribe to our newsletter",
            "Basic usage data such as pages visited, browser type, and device information (through standard server logs or analytics if enabled)",
            "Information you voluntarily send us when you contact us",
          ]}
        />
        <p>
          We do not knowingly collect personal information from children under 13.
        </p>
      </LegalSection>

      <LegalSection title="How We Use Your Information">
        <LegalList
          items={[
            "Send newsletter updates, decor inspiration, and product recommendations (if you subscribed)",
            "Respond to your questions or requests",
            "Improve our website content and user experience",
            "Comply with legal obligations",
          ]}
        />
        <p>We do not sell your personal information to third parties.</p>
      </LegalSection>

      <LegalSection title="Newsletter">
        <p>
          If you subscribe to our newsletter, we store your email address to send
          you updates. You can unsubscribe at any time by contacting us through
          our{" "}
          <Link href="/contact" className="text-accent hover:underline">
            contact page
          </Link>
          . We will remove your email from our list promptly upon request.
        </p>
      </LegalSection>

      <LegalSection title="Third-Party Services">
        <p>
          Our site contains links to Amazon and other third-party websites. When
          you click those links, you leave our site and are subject to the
          privacy policies of those services. We are not responsible for the
          practices of third-party sites.
        </p>
        <p>
          Amazon processes purchases on its own platform. Please review{" "}
          <a
            href="https://www.amazon.com/gp/help/customer/display.html?nodeId=468496"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Amazon&apos;s Privacy Notice
          </a>{" "}
          for details on how they handle your data.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          We may use essential cookies required for site functionality (such as
          admin access). We do not currently use advertising or tracking cookies
          on the public site. If this changes, we will update this policy.
        </p>
      </LegalSection>

      <LegalSection title="Data Retention">
        <p>
          We retain newsletter email addresses until you unsubscribe or request
          deletion. Server logs are retained only as long as necessary for
          security and troubleshooting.
        </p>
      </LegalSection>

      <LegalSection title="Your Rights">
        <p>
          Depending on where you live, you may have the right to access, correct,
          or delete your personal data. To make a request, please{" "}
          <Link href="/contact" className="text-accent hover:underline">
            contact us
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with an updated &quot;Last updated&quot; date.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
