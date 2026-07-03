"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deleteProduct, toggleProductActive } from "@/lib/actions/products";

export default function ProductRowActions({
  productId,
  isActive,
  editHref,
}: {
  productId: string;
  isActive: boolean;
  editHref: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-3 font-mono text-xs uppercase tracking-widest-plus">
      <Link href={editHref} className="text-navy-900/70 hover:text-amber-strong">
        Edit
      </Link>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await toggleProductActive(productId, !isActive);
          })
        }
        className="text-navy-900/70 hover:text-amber-strong disabled:opacity-50"
      >
        {isActive ? "Sembunyi" : "Aktifkan"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm("Padam produk ini? Tindakan ini tidak boleh dibatalkan.")) {
            startTransition(async () => {
              await deleteProduct(productId);
            });
          }
        }}
        className="text-red-600/80 hover:text-red-600 disabled:opacity-50"
      >
        Padam
      </button>
    </div>
  );
}
