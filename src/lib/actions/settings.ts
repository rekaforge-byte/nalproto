"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type SettingsFormState = {
  error?: string;
  success?: boolean;
};

const MAX_LOGO_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/x-icon"];

export async function updateSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const companyName = String(formData.get("companyName") || "").trim();
  if (!companyName) return { error: "Company name is required." };

  const markup = parseFloat(String(formData.get("quoteMarkupMultiplier") || "3"));
  const minPrice = parseFloat(String(formData.get("quoteMinPrice") || "5"));
  if (isNaN(markup) || markup <= 0) return { error: "Invalid markup multiplier." };
  if (isNaN(minPrice) || minPrice < 0) return { error: "Invalid minimum price." };

  // Logo upload is optional — only replace the stored logo if a new file was selected.
  let logoUrl: string | undefined;
  const logoFile = formData.get("logo");
  if (logoFile instanceof File && logoFile.size > 0) {
    if (logoFile.size > MAX_LOGO_BYTES) {
      return { error: "Logo image is too large. Max 2MB." };
    }
    if (logoFile.type && !ALLOWED_LOGO_TYPES.includes(logoFile.type)) {
      return { error: "Logo must be a PNG, JPEG, WEBP, SVG, or ICO image." };
    }
    const bytes = await logoFile.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = logoFile.type || "image/png";
    logoUrl = `data:${mimeType};base64,${base64}`;
  }

  const shared = {
    companyName,
    tagline: String(formData.get("tagline") || ""),
    aboutText: String(formData.get("aboutText") || ""),
    phone: String(formData.get("phone") || ""),
    whatsapp: String(formData.get("whatsapp") || ""),
    email: String(formData.get("email") || ""),
    address: String(formData.get("address") || ""),
    mapUrl: String(formData.get("mapUrl") || ""),
    instagram: String(formData.get("instagram") || ""),
    facebook: String(formData.get("facebook") || ""),
    tiktok: String(formData.get("tiktok") || ""),
    quoteMarkupMultiplier: markup,
    quoteMinPrice: minPrice,
    ...(logoUrl ? { logoUrl } : {}),
  };

  await prisma.settings.upsert({
    where: { id: 1 },
    create: { id: 1, ...shared },
    update: shared,
  });

  revalidatePath("/");
  revalidatePath("/kad-perniagaan");
  revalidatePath("/hubungi");
  revalidatePath("/quote");
  revalidatePath("/admin/tetapan");
  return { success: true };
}
