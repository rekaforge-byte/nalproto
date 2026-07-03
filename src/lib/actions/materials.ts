"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type MaterialFormState = {
  error?: string;
};

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Not authorized.");
}

export async function createMaterial(
  _prevState: MaterialFormState,
  formData: FormData
): Promise<MaterialFormState> {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const name = String(formData.get("name") || "").trim();
  const density = parseFloat(String(formData.get("densityGCm3") || ""));
  const costPerGram = parseFloat(String(formData.get("costPerGram") || ""));

  if (!name) return { error: "Material name is required." };
  if (isNaN(density) || density <= 0) return { error: "Invalid density." };
  if (isNaN(costPerGram) || costPerGram < 0) return { error: "Invalid cost per gram." };

  const position = parseInt(String(formData.get("position") || "0"), 10) || 0;
  const isActive = formData.get("isActive") === "on";

  await prisma.material.create({
    data: { name, densityGCm3: density, costPerGram, position, isActive },
  });

  revalidatePath("/quote");
  revalidatePath("/admin/bahan");
  redirect("/admin/bahan");
}

export async function updateMaterial(
  id: string,
  _prevState: MaterialFormState,
  formData: FormData
): Promise<MaterialFormState> {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const name = String(formData.get("name") || "").trim();
  const density = parseFloat(String(formData.get("densityGCm3") || ""));
  const costPerGram = parseFloat(String(formData.get("costPerGram") || ""));

  if (!name) return { error: "Material name is required." };
  if (isNaN(density) || density <= 0) return { error: "Invalid density." };
  if (isNaN(costPerGram) || costPerGram < 0) return { error: "Invalid cost per gram." };

  const position = parseInt(String(formData.get("position") || "0"), 10) || 0;
  const isActive = formData.get("isActive") === "on";

  await prisma.material.update({
    where: { id },
    data: { name, densityGCm3: density, costPerGram, position, isActive },
  });

  revalidatePath("/quote");
  revalidatePath("/admin/bahan");
  redirect("/admin/bahan");
}

export async function deleteMaterial(id: string) {
  await requireAdmin();
  await prisma.material.delete({ where: { id } });
  revalidatePath("/quote");
  revalidatePath("/admin/bahan");
}

export async function toggleMaterialActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.material.update({ where: { id }, data: { isActive } });
  revalidatePath("/quote");
  revalidatePath("/admin/bahan");
}
