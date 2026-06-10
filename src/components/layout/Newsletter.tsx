import { siteConfig } from "../../../content/site.config";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

export function Newsletter() {
  if (!siteConfig.newsletter.enabled) return null;

  const { newsletter } = siteConfig;

  return (
    <section className="bg-accent py-16">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <h2 className="font-display text-3xl font-semibold text-white mb-3">
          {newsletter.title}
        </h2>
        <p className="text-white/80 mb-8">{newsletter.subtitle}</p>
        <NewsletterForm
          placeholder={newsletter.placeholder}
          buttonLabel={newsletter.buttonLabel}
        />
      </div>
    </section>
  );
}
