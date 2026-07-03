"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type AdminFormState = {
  error?: string;
  success?: boolean;
};

export async function createAdmin(
  _prevState: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!name || !email) return { error: "Name and email are required." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) return { error: "This email is already registered." };

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.admin.create({ data: { name, email, passwordHash } });

  revalidatePath("/admin/pengguna");
  return { success: true };
}

export async function deleteAdmin(adminId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authorized.");
  if (session.user.id === adminId) {
    throw new Error("You cannot delete your own account.");
  }
  const count = await prisma.admin.count();
  if (count <= 1) {
    throw new Error("At least one admin account is required.");
  }
  await prisma.admin.delete({ where: { id: adminId } });
  revalidatePath("/admin/pengguna");
}
