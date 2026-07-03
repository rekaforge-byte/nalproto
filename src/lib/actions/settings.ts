"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type SettingsFormState = {
  error?: string;
  success?: boolean;
};

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
