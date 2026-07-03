"use client";

import { useTransition } from "react";
import { deleteAdmin } from "@/lib/actions/admins";

export default function DeleteAdminButton({
  adminId,
  disabled,
}: {
  adminId: string;
  disabled?: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={disabled || pending}
      onClick={() => {
        if (confirm("Padam akaun admin ini?")) {
          startTransition(async () => {
            try {
              await deleteAdmin(adminId);
            } catch (err) {
              alert(err instanceof Error ? err.message : "Gagal memadam.");
            }
          });
        }
      }}
      className="font-mono text-xs uppercase tracking-widest-plus text-red-600/80 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Padam
    </button>
  );
}
