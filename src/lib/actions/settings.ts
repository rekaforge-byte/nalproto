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
  if (!session?.user) return { error: "Tidak dibenarkan." };

  const companyName = String(formData.get("companyName") || "").trim();
  if (!companyName) return { error: "Nama syarikat diperlukan." };

  await prisma.settings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
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
    },
    update: {
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
    },
  });

  revalidatePath("/");
  revalidatePath("/kad-perniagaan");
  revalidatePath("/hubungi");
  revalidatePath("/admin/tetapan");
  return { success: true };
}
