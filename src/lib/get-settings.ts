import { prisma } from "@/lib/prisma";

export const defaultSettings = {
  id: 1,
  companyName: "NAL PROTO",
  tagline: "Prototaip. Fabrikasi. Selesai.",
  aboutText:
    "NAL PROTO menyediakan perkhidmatan reka bentuk dan fabrikasi prototaip — dari cetakan 3D, pemasangan litar, hingga kerja pembaikan teknikal.",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  mapUrl: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  logoUrl: "/logo.png",
  updatedAt: new Date(),
};

export async function getSettings() {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: 1 } });
    return settings ?? defaultSettings;
  } catch {
    // DB not reachable/migrated yet — fall back to defaults so the site still renders
    return defaultSettings;
  }
}
