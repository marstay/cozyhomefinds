"use client";

import { useEffect, useState } from "react";
import {
  PageHeader,
  AdminCard,
  FormField,
  Input,
  Textarea,
  Checkbox,
  SaveButton,
  Alert,
} from "@/components/admin/AdminForm";

interface SiteData {
  name: string;
  tagline: string;
  description: string;
  url: string;
  amazon: { associateTag: string; marketplace: string };
  navigation: { label: string; href: string }[];
  social: { pinterest: string; instagram: string };
  contact: { email: string };
  footer: { disclaimer: string; copyright: string };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
  };
  featured: { title: string; subtitle: string; productIds: string[] };
  newsletter: {
    enabled: boolean;
    title: string;
    subtitle: string;
    placeholder: string;
    buttonLabel: string;
  };
}

interface NewsletterSubscriber {
  email: string;
  subscribedAt: string;
}

export default function AdminSitePage() {
  const [data, setData] = useState<SiteData | null>(null);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/site")
      .then((r) => r.json())
      .then(setData);
    fetch("/api/admin/newsletter")
      .then((r) => r.json())
      .then((d) => setSubscribers(d.subscribers ?? []));
  }, []);

  function update(path: string, value: unknown) {
    if (!data) return;
    const keys = path.split(".");
    const updated = structuredClone(data);
    let obj: Record<string, unknown> = updated as unknown as Record<string, unknown>;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]] as Record<string, unknown>;
    }
    obj[keys[keys.length - 1]] = value;
    setData(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    setMessage(null);

    const res = await fetch("/api/admin/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setMessage({ type: "success", text: "Site settings saved successfully." });
    } else {
      const err = await res.json();
      setMessage({ type: "error", text: err.error ?? "Failed to save" });
    }
    setSaving(false);
  }

  if (!data) {
    return <p className="text-muted">Loading...</p>;
  }

  return (
    <>
      <PageHeader
        title="Site Settings"
        description="Configure your store name, hero section, featured products, and more."
      />

      {message && <div className="mb-6"><Alert type={message.type} message={message.text} /></div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <AdminCard>
          <h2 className="font-display text-lg font-semibold mb-4">General</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Site Name">
              <Input value={data.name} onChange={(e) => update("name", e.target.value)} />
            </FormField>
            <FormField label="Site URL">
              <Input value={data.url} onChange={(e) => update("url", e.target.value)} />
            </FormField>
            <FormField label="Tagline" hint="Short subtitle shown in footer">
              <Input value={data.tagline} onChange={(e) => update("tagline", e.target.value)} />
            </FormField>
            <FormField label="Amazon Associate Tag">
              <Input
                value={data.amazon.associateTag}
                onChange={(e) => update("amazon.associateTag", e.target.value)}
              />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Description">
                <Textarea
                  rows={3}
                  value={data.description}
                  onChange={(e) => update("description", e.target.value)}
                />
              </FormField>
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-display text-lg font-semibold mb-4">Hero Section</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Eyebrow">
              <Input value={data.hero.eyebrow} onChange={(e) => update("hero.eyebrow", e.target.value)} />
            </FormField>
            <FormField label="Title">
              <Input value={data.hero.title} onChange={(e) => update("hero.title", e.target.value)} />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Subtitle">
                <Textarea rows={2} value={data.hero.subtitle} onChange={(e) => update("hero.subtitle", e.target.value)} />
              </FormField>
            </div>
            <FormField label="Primary CTA Label">
              <Input value={data.hero.ctaPrimary.label} onChange={(e) => update("hero.ctaPrimary.label", e.target.value)} />
            </FormField>
            <FormField label="Primary CTA Link">
              <Input value={data.hero.ctaPrimary.href} onChange={(e) => update("hero.ctaPrimary.href", e.target.value)} />
            </FormField>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-display text-lg font-semibold mb-4">Featured Products</h2>
          <div className="grid gap-4">
            <FormField label="Section Title">
              <Input value={data.featured.title} onChange={(e) => update("featured.title", e.target.value)} />
            </FormField>
            <FormField label="Section Subtitle">
              <Input value={data.featured.subtitle} onChange={(e) => update("featured.subtitle", e.target.value)} />
            </FormField>
            <FormField label="Featured Product IDs" hint="Comma-separated ASINs for homepage order. Or check 'Mark as featured' on each product — both stay in sync when you save.">
              <Textarea
                rows={3}
                value={data.featured.productIds.join(", ")}
                onChange={(e) =>
                  update(
                    "featured.productIds",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  )
                }
              />
            </FormField>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-display text-lg font-semibold mb-4">Social & Footer</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Pinterest URL">
              <Input value={data.social.pinterest} onChange={(e) => update("social.pinterest", e.target.value)} />
            </FormField>
            <FormField label="Contact Email" hint="Shown on the Contact page">
              <Input
                type="email"
                value={data.contact?.email ?? ""}
                onChange={(e) => update("contact.email", e.target.value)}
              />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Affiliate Disclaimer">
                <Textarea rows={2} value={data.footer.disclaimer} onChange={(e) => update("footer.disclaimer", e.target.value)} />
              </FormField>
            </div>
            <div className="md:col-span-2">
              <FormField label="Copyright">
                <Input value={data.footer.copyright} onChange={(e) => update("footer.copyright", e.target.value)} />
              </FormField>
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-display text-lg font-semibold mb-4">Newsletter</h2>
          <div className="grid gap-4">
            <Checkbox
              label="Enable newsletter section on homepage"
              checked={data.newsletter.enabled}
              onChange={(e) => update("newsletter.enabled", e.target.checked)}
            />
            <FormField label="Title">
              <Input value={data.newsletter.title} onChange={(e) => update("newsletter.title", e.target.value)} />
            </FormField>
            <FormField label="Subtitle">
              <Input value={data.newsletter.subtitle} onChange={(e) => update("newsletter.subtitle", e.target.value)} />
            </FormField>
            <div className="md:col-span-2">
              <FormField
                label="Subscribers"
                hint={`${subscribers.length} email(s) saved in content/newsletter-subscribers.json`}
              >
                {subscribers.length > 0 ? (
                  <div className="max-h-48 overflow-y-auto rounded-lg border border-border divide-y divide-border/60">
                    {subscribers.map((subscriber) => (
                      <div
                        key={subscriber.email}
                        className="flex items-center justify-between gap-4 px-3 py-2 text-sm"
                      >
                        <span>{subscriber.email}</span>
                        <span className="text-xs text-muted shrink-0">
                          {new Date(subscriber.subscribedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted">No subscribers yet.</p>
                )}
              </FormField>
            </div>
          </div>
        </AdminCard>

        <SaveButton saving={saving} />
      </form>
    </>
  );
}
