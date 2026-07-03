"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type ServiceFormState = {
  error?: string;
};

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Not authorized.");
}

export async function createService(
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  if (!title) return { error: "Title is required." };
  if (!description) return { error: "Description is required." };

  const position = parseInt(String(formData.get("position") || "0"), 10) || 0;
  const isActive = formData.get("isActive") === "on";

  await prisma.service.create({
    data: { title, description, position, isActive },
  });

  revalidatePath("/");
  revalidatePath("/admin/perkhidmatan");
  redirect("/admin/perkhidmatan");
}

export async function updateService(
  id: string,
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  if (!title) return { error: "Title is required." };
  if (!description) return { error: "Description is required." };

  const position = parseInt(String(formData.get("position") || "0"), 10) || 0;
  const isActive = formData.get("isActive") === "on";

  await prisma.service.update({
    where: { id },
    data: { title, description, position, isActive },
  });

  revalidatePath("/");
  revalidatePath("/admin/perkhidmatan");
  redirect("/admin/perkhidmatan");
}

export async function deleteService(id: string) {
  await requireAdmin();
  await prisma.service.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/perkhidmatan");
}

export async function toggleServiceActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.service.update({ where: { id }, data: { isActive } });
  revalidatePath("/");
  revalidatePath("/admin/perkhidmatan");
}
