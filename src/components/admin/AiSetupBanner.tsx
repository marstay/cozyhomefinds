"use client";

import { useEffect, useState } from "react";
import { AdminCard } from "@/components/admin/AdminForm";

export function AiSetupBanner() {
  const [configured, setConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/ai/generate")
      .then((r) => r.json())
      .then((d) => setConfigured(d.configured));
  }, []);

  if (configured !== false) return null;

  return (
    <AdminCard className="border-accent/20 bg-accent/5">
      <h2 className="font-display text-sm font-semibold mb-1">AI Generation Setup</h2>
      <p className="text-sm text-muted mb-3">
        Add your OpenAI API key to{" "}
        <code className="text-xs bg-surface-muted px-1.5 py-0.5 rounded">.env.local</code>{" "}
        to enable ✨ Generate buttons:
      </p>
      <pre className="text-xs bg-surface-muted rounded-lg p-3 overflow-x-auto">
        {`OPENAI_API_KEY=your-openai-api-key
# Optional: OPENAI_MODEL=gpt-4o-mini`}
      </pre>
    </AdminCard>
  );
}
