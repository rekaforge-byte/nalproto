import { getSettings } from "@/lib/get-settings";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest-plus text-amber-strong">
        Konfigurasi
      </p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-navy-950">
        Tetapan Syarikat
      </h1>
      <p className="mt-2 max-w-xl font-sans text-sm text-navy-900/60">
        Maklumat ini dipaparkan pada laman utama, kad perniagaan digital, dan halaman hubungi.
      </p>

      <SettingsForm
        settings={{
          companyName: settings.companyName,
          tagline: settings.tagline,
          aboutText: settings.aboutText,
          phone: settings.phone,
          whatsapp: settings.whatsapp,
          email: settings.email,
          address: settings.address,
          mapUrl: settings.mapUrl,
          instagram: settings.instagram,
          facebook: settings.facebook,
          tiktok: settings.tiktok,
        }}
      />
    </div>
  );
}
