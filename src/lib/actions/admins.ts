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
  if (!session?.user) return { error: "Tidak dibenarkan." };

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!name || !email) return { error: "Nama dan emel diperlukan." };
  if (password.length < 8) return { error: "Kata laluan mesti sekurang-kurangnya 8 aksara." };

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) return { error: "Emel ini sudah didaftarkan." };

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.admin.create({ data: { name, email, passwordHash } });

  revalidatePath("/admin/pengguna");
  return { success: true };
}

export async function deleteAdmin(adminId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Tidak dibenarkan.");
  if (session.user.id === adminId) {
    throw new Error("Anda tidak boleh memadam akaun sendiri.");
  }
  const count = await prisma.admin.count();
  if (count <= 1) {
    throw new Error("Sekurang-kurangnya satu akaun admin diperlukan.");
  }
  await prisma.admin.delete({ where: { id: adminId } });
  revalidatePath("/admin/pengguna");
}
