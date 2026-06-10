import Image from "next/image";
import { siteConfig } from "../../../content/site.config";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const { hero } = siteConfig;

  return (
    <section className="relative overflow-hidden bg-surface-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 py-16 md:grid-cols-2 md:py-24 lg:gap-16">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
              {hero.eyebrow}
            </span>
            <h1 className="font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>
            <p className="text-lg text-muted leading-relaxed max-w-lg">
              {hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href={hero.ctaPrimary.href}>{hero.ctaPrimary.label}</Button>
              <Button href={hero.ctaSecondary.href} variant="outline">
                {hero.ctaSecondary.label}
              </Button>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop"
              alt="Cozy living room with warm decor"
              fill
              className="object-cover"
              priority
              sizes="50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
