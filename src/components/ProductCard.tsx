import Link from "next/link";
import { formatPrice } from "@/lib/utils";

type ProductCardProps = {
  slug: string;
  name: string;
  category: string;
  price: number | string;
  currency: string;
  sku?: string | null;
  imageDataUrl?: string | null;
  isFeatured?: boolean;
};

export default function ProductCard({
  slug,
  name,
  category,
  price,
  currency,
  sku,
  imageDataUrl,
  isFeatured,
}: ProductCardProps) {
  return (
    <Link
      href={`/produk/${slug}`}
      className="reg-corners group flex flex-col overflow-hidden rounded-md border border-line-soft bg-navy-900 text-amber transition-transform hover:-translate-y-0.5"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-navy-800">
        {imageDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageDataUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-xs text-paper-dim">
            Tiada Gambar
          </div>
        )}
        {isFeatured && (
          <span className="absolute left-2 top-2 rounded-sm bg-amber px-2 py-1 font-mono text-[10px] uppercase tracking-widest-plus text-navy-950">
            Pilihan
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 text-paper">
        <p className="font-mono text-[10px] uppercase tracking-widest-plus text-amber">
          {category}
          {sku ? ` · ${sku}` : ""}
        </p>
        <h3 className="font-display text-base font-semibold leading-snug text-paper">
          {name}
        </h3>
        <div className="mt-auto flex items-center justify-between border-t border-line-soft pt-3">
          <span className="font-mono text-sm font-semibold text-paper">
            {formatPrice(price, currency)}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest-plus text-paper-dim group-hover:text-amber">
            Lihat →
          </span>
        </div>
      </div>
    </Link>
  );
}
