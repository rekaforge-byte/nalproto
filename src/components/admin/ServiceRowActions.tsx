"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deleteService, toggleServiceActive } from "@/lib/actions/services";

export default function ServiceRowActions({
  serviceId,
  isActive,
  editHref,
}: {
  serviceId: string;
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
            await toggleServiceActive(serviceId, !isActive);
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
          if (confirm("Delete this service?")) {
            startTransition(async () => {
              await deleteService(serviceId);
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
