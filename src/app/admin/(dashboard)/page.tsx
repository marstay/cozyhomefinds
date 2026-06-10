import Link from "next/link";
import { PageHeader, AdminCard } from "@/components/admin/AdminForm";
import { readProducts, readCollections, readBlogPosts } from "@/lib/admin/storage";
import { getProductThumbnail } from "@/lib/products";

export default function AdminDashboardPage() {
  const products = readProducts();
  const collections = readCollections();
  const posts = readBlogPosts();

  const stats = [
    { label: "Products", count: products.length, href: "/admin/products", color: "bg-accent/10 text-accent" },
    { label: "Collections", count: collections.length, href: "/admin/collections", color: "bg-blue-50 text-blue-600" },
    { label: "Blog Posts", count: posts.length, href: "/admin/blog", color: "bg-green-50 text-green-600" },
    { label: "Featured", count: products.filter((p) => p.featured).length, href: "/admin/site", color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Manage your Cozy Home Finds store from one place."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <AdminCard className="hover:shadow-md transition-shadow cursor-pointer">
              <p className="text-sm text-muted">{stat.label}</p>
              <p className={`mt-2 text-3xl font-semibold ${stat.color.split(" ")[1]}`}>
                {stat.count}
              </p>
            </AdminCard>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AdminCard>
          <h2 className="font-display text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "Import from Amazon", href: "/admin/products/import" },
              { label: "Add a product", href: "/admin/products/new" },
              { label: "Create a collection", href: "/admin/collections/new" },
              { label: "Write a blog post", href: "/admin/blog/new" },
              { label: "Edit site settings", href: "/admin/site" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-surface-muted transition-colors"
              >
                {action.label}
                <span className="text-muted">→</span>
              </Link>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-display text-lg font-semibold mb-4">Recent Products</h2>
          <div className="space-y-3">
            {products.slice(-5).reverse().map((p) => {
              const thumbnail = getProductThumbnail(p);
              return (
              <Link
                key={p.id}
                href={`/admin/products/${p.id}`}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-muted transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-surface-muted overflow-hidden flex-shrink-0 flex items-center justify-center text-[10px] text-muted">
                  {thumbnail ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={thumbnail} alt="" className="h-full w-full object-cover" />
                  ) : (
                    "N/A"
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{p.title}</p>
                  <p className="text-xs text-muted">${p.price}</p>
                </div>
              </Link>
            );
            })}
          </div>
        </AdminCard>
      </div>
    </>
  );
}
