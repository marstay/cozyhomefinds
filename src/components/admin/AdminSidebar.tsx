"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/ui/Logo";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "◈" },
  { label: "Site Settings", href: "/admin/site", icon: "⚙" },
  { label: "Products", href: "/admin/products", icon: "▣" },
  { label: "Import", href: "/admin/products/import", icon: "↓" },
  { label: "Collections", href: "/admin/collections", icon: "▤" },
  { label: "Blog", href: "/admin/blog", icon: "✎" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-64 flex-col border-r border-border bg-surface-elevated">
      <div className="border-b border-border px-6 py-5">
        <Link href="/admin" className="flex items-center gap-2">
          <LogoMark shape="rounded" />
          <div>
            <p className="font-display text-sm font-semibold">Admin</p>
            <p className="text-xs text-muted">Cozy Home Finds</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : item.href === "/admin/products"
                ? pathname.startsWith("/admin/products") &&
                  !pathname.startsWith("/admin/products/import")
                : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:bg-surface-muted hover:text-foreground",
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-border p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-muted hover:text-foreground transition-colors"
        >
          ↗ View Site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted hover:bg-surface-muted hover:text-foreground transition-colors"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
