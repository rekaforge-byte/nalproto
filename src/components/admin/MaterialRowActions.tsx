"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deleteMaterial, toggleMaterialActive } from "@/lib/actions/materials";

export default function MaterialRowActions({
  materialId,
  isActive,
  editHref,
}: {
  materialId: string;
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
            await toggleMaterialActive(materialId, !isActive);
          })
        }
        className="text-navy-900/70 hover:text-amber-strong disabled:opacity-50"
      >
        {isActive ? "Hide" : "Activate"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm("Delete this material?")) {
            startTransition(async () => {
              await deleteMaterial(materialId);
            });
          }
        }}
        className="text-red-600/80 hover:text-red-600 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
