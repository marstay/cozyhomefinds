import Link from "next/link";
import { siteConfig } from "../../../content/site.config";
import { LogoMark } from "@/components/ui/Logo";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-surface-muted">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <LogoMark />
              <span className="font-display text-lg font-semibold">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              {siteConfig.tagline}
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Follow Us</h4>
            {siteConfig.social.pinterest ? (
              <a
                href={siteConfig.social.pinterest}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted hover:text-accent transition-colors"
              >
                Pinterest
              </a>
            ) : (
              <p className="text-sm text-muted">Follow us for daily decor inspiration.</p>
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-border/60 pt-8 space-y-3">
          <p className="text-xs text-muted leading-relaxed">
            {siteConfig.footer.disclaimer}
          </p>
          <p className="text-xs text-muted leading-relaxed">
            Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its
            affiliates.
          </p>
          <p className="text-xs text-muted">{siteConfig.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
