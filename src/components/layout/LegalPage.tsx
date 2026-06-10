import Link from "next/link";
import { Section, SectionHeader } from "@/components/layout/Section";
import { siteConfig } from "../../../content/site.config";

interface LegalPageProps {
  title: string;
  description?: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export function LegalPage({
  title,
  description,
  lastUpdated = "June 9, 2026",
  children,
}: LegalPageProps) {
  return (
    <Section className="pt-12">
      <SectionHeader title={title} subtitle={description} />
      <div className="mx-auto max-w-2xl">
        <p className="mb-8 text-center text-sm text-muted">
          Last updated: {lastUpdated}
        </p>
        <div className="space-y-8 text-muted leading-relaxed">{children}</div>
        <p className="mt-12 border-t border-border/60 pt-8 text-center text-sm text-muted">
          Questions?{" "}
          <Link href="/contact" className="text-accent hover:underline">
            Contact us
          </Link>
          .
        </p>
      </div>
    </Section>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-foreground mb-3">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function siteLegalName() {
  return siteConfig.name;
}
