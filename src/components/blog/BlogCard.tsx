import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured }: BlogCardProps) {
  return (
    <article
      className={
        featured
          ? "group grid gap-6 md:grid-cols-2 items-center"
          : "group flex flex-col overflow-hidden rounded-2xl bg-surface-elevated border border-border/60 transition-all hover:shadow-md"
      }
    >
      <Link
        href={`/blog/${post.slug}`}
        className={
          featured
            ? "relative aspect-[16/10] overflow-hidden rounded-2xl block"
            : "relative aspect-[16/10] overflow-hidden block"
        }
      >
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={featured ? "50vw" : "33vw"}
        />
      </Link>

      <div className={featured ? "" : "p-5 flex flex-col gap-2"}>
        <div className="flex flex-wrap gap-2 mb-2">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-muted capitalize"
            >
              {tag.replace(/-/g, " ")}
            </span>
          ))}
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3
            className={
              featured
                ? "font-display text-2xl md:text-3xl font-semibold text-foreground group-hover:text-accent transition-colors mb-3"
                : "font-display text-lg font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2"
            }
          >
            {post.title}
          </h3>
        </Link>

        <p className="text-muted text-sm line-clamp-2 mb-3">{post.excerpt}</p>

        <div className="flex items-center justify-between text-xs text-muted">
          <span>{post.author}</span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </div>
      </div>
    </article>
  );
}
