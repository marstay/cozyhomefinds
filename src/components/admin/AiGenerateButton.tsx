"use client";

import { cn } from "@/lib/utils";

interface AiGenerateButtonProps {
  onClick: () => void;
  loading?: boolean;
  label?: string;
  className?: string;
}

export function AiGenerateButton({
  onClick,
  loading,
  label = "Generate",
  className,
}: AiGenerateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/10 hover:border-accent/30 hover:text-accent disabled:opacity-50 transition-colors whitespace-nowrap",
        className,
      )}
    >
      <span>{loading ? "..." : "✨"}</span>
      {loading ? "Generating..." : label}
    </button>
  );
}

interface FormFieldWithAiProps {
  label: string;
  hint?: string;
  onGenerate: () => void;
  generating?: boolean;
  generateLabel?: string;
  children: React.ReactNode;
}

export function FormFieldWithAi({
  label,
  hint,
  onGenerate,
  generating,
  generateLabel,
  children,
}: FormFieldWithAiProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label className="block text-sm font-medium text-foreground">{label}</label>
        <AiGenerateButton
          onClick={onGenerate}
          loading={generating}
          label={generateLabel}
        />
      </div>
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}
