import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import ProductRowActions from "@/components/admin/ProductRowActions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest-plus text-amber-strong">
            Catalog Management
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-navy-950">
            Products ({products.length})
          </h1>
        </div>
        <Link
          href="/admin/produk/baharu"
          className="rounded-sm bg-navy-950 px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-widest-plus text-paper hover:bg-navy-900"
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-8 rounded-md border border-dashed border-navy-800/20 p-12 text-center">
          <p className="font-mono text-sm text-navy-900/60">
            No products yet. Click &ldquo;Add Product&rdquo; to get started.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-md border border-navy-800/10">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-navy-800/10 bg-navy-800/5 font-mono text-[11px] uppercase tracking-widest-plus text-navy-900/60">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-navy-800/5 text-sm">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-navy-800/10">
                      {p.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`data:${p.images[0].mimeType};base64,${p.images[0].data}`}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <span className="font-medium text-navy-950">{p.name}</span>
                    {p.isFeatured && (
                      <span className="rounded-sm bg-amber/20 px-1.5 py-0.5 font-mono text-[10px] uppercase text-amber-strong">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-navy-900/70">
                    {p.category}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-navy-900/70">
                    {formatPrice(p.price.toString(), p.currency)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-navy-900/70">
                    {p.stock === null ? "—" : p.stock}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-sm px-2 py-1 font-mono text-[10px] uppercase tracking-widest-plus ${
                        p.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-navy-800/10 text-navy-900/50"
                      }`}
                    >
                      {p.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ProductRowActions
                      productId={p.id}
                      isActive={p.isActive}
                      editHref={`/admin/produk/${p.id}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
