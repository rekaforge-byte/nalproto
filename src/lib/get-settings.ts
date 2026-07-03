import { prisma } from "@/lib/prisma";

export const defaultSettings = {
  id: 1,
  companyName: "NAL PROTO",
  tagline: "From Concept to Creation",
  aboutText:
    "NAL PROTO provides design and prototype fabrication services — from 3D printing and circuit assembly to technical repair work.",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  mapUrl: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  logoUrl: "/logo.png",
  quoteMarkupMultiplier: 3.0,
  quoteMinPrice: 5.0,
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
