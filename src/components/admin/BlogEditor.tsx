"use client";

import { useRef, useState } from "react";
import { MarkdownContent } from "@/components/blog/MarkdownContent";
import { cn } from "@/lib/utils";

type EditorMode = "write" | "preview" | "split";

interface BlogEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const toolbarItems = [
  { label: "H2", prefix: "## ", suffix: "\n", placeholder: "Section heading" },
  { label: "H3", prefix: "### ", suffix: "\n", placeholder: "Subheading" },
  { label: "Bold", prefix: "**", suffix: "**", placeholder: "bold text" },
  { label: "Italic", prefix: "*", suffix: "*", placeholder: "italic text" },
  { label: "Link", prefix: "[", suffix: "](https://)", placeholder: "link text" },
  { label: "List", prefix: "- ", suffix: "\n", placeholder: "list item" },
  { label: "Quote", prefix: "> ", suffix: "\n", placeholder: "quote" },
  { label: "Divider", prefix: "\n---\n", suffix: "", placeholder: "" },
] as const;

export function BlogEditor({ value, onChange }: BlogEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<EditorMode>("split");

  function insertMarkdown(prefix: string, suffix: string, placeholder: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end) || placeholder;
    const next =
      value.slice(0, start) + prefix + selected + suffix + value.slice(end);

    onChange(next);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorStart = start + prefix.length;
      const cursorEnd = cursorStart + selected.length;
      textarea.setSelectionRange(cursorStart, cursorEnd);
    });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-elevated">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface-muted px-3 py-2">
        <div className="flex flex-wrap gap-1">
          {toolbarItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => insertMarkdown(item.prefix, item.suffix, item.placeholder)}
              className="rounded-md px-2.5 py-1 text-xs font-medium text-muted hover:bg-background hover:text-foreground transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex rounded-lg border border-border bg-background p-0.5">
          {(["write", "split", "preview"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setMode(tab)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors",
                mode === tab
                  ? "bg-accent text-white"
                  : "text-muted hover:text-foreground",
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "grid min-h-[28rem]",
          mode === "split" ? "lg:grid-cols-2" : "grid-cols-1",
        )}
      >
        {(mode === "write" || mode === "split") && (
          <div className={cn(mode === "split" && "border-b lg:border-b-0 lg:border-r border-border")}>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={24}
              required
              placeholder="Write your post in Markdown..."
              className="h-full min-h-[28rem] w-full resize-y bg-transparent px-4 py-4 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted focus:outline-none"
            />
          </div>
        )}

        {(mode === "preview" || mode === "split") && (
          <div className="min-h-[28rem] overflow-y-auto bg-background px-6 py-5">
            {value.trim() ? (
              <MarkdownContent content={value} />
            ) : (
              <p className="text-sm text-muted">Preview will appear here as you write.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
