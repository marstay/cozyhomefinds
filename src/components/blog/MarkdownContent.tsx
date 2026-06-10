import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div
      className={[
        "blog-prose prose prose-stone max-w-none",
        "prose-headings:font-display prose-headings:font-semibold prose-headings:text-foreground",
        "prose-p:text-muted prose-p:leading-relaxed",
        "prose-li:text-muted prose-strong:text-foreground",
        "prose-a:text-accent prose-a:font-medium prose-a:no-underline hover:prose-a:underline",
        "prose-hr:border-border/60",
        "prose-blockquote:border-accent/40 prose-blockquote:text-muted prose-blockquote:not-italic",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            if (href?.startsWith("/")) {
              return (
                <Link href={href} className="text-accent font-medium hover:underline">
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent font-medium hover:underline"
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt }) =>
            src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={alt ?? ""}
                className="my-6 rounded-2xl border border-border/60"
              />
            ) : null,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
