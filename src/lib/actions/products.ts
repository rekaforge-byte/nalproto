"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authorized. Please log in again.");
  }
  return session;
}

const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3MB per image, stored as base64 in DB

async function fileToDataUrl(file: File): Promise<{ data: string; mimeType: string }> {
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  return { data: base64, mimeType: file.type || "image/jpeg" };
}

export type ProductFormState = {
  error?: string;
};

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "Umum").trim() || "Umum";
  const description = String(formData.get("description") || "").trim();
  const priceRaw = String(formData.get("price") || "0");
  const price = parseFloat(priceRaw);
  const stockRaw = formData.get("stock");
  const stock = stockRaw ? parseInt(String(stockRaw), 10) : null;
  const sku = String(formData.get("sku") || "").trim() || null;
  const isFeatured = formData.get("isFeatured") === "on";
  const isActive = formData.get("isActive") !== "off";

  if (!name) return { error: "Product name is required." };
  if (isNaN(price) || price < 0) return { error: "Invalid price." };

  let slug = slugify(name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const images = formData.getAll("images") as File[];
  const validImages = images.filter((f) => f instanceof File && f.size > 0);

  for (const img of validImages) {
    if (img.size > MAX_IMAGE_BYTES) {
      return { error: `Image "${img.name}" is too large. Max 3MB per image.` };
    }
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      category,
      description,
      price,
      stock,
      sku,
      isFeatured,
      isActive,
    },
  });

  let position = 0;
  for (const img of validImages) {
    const { data, mimeType } = await fileToDataUrl(img);
    await prisma.productImage.create({
      data: { productId: product.id, data, mimeType, position: position++ },
    });
  }

  revalidatePath("/admin/produk");
  revalidatePath("/produk");
  redirect("/admin/produk");
}

export async function updateProduct(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "Umum").trim() || "Umum";
  const description = String(formData.get("description") || "").trim();
  const priceRaw = String(formData.get("price") || "0");
  const price = parseFloat(priceRaw);
  const stockRaw = formData.get("stock");
  const stock = stockRaw ? parseInt(String(stockRaw), 10) : null;
  const sku = String(formData.get("sku") || "").trim() || null;
  const isFeatured = formData.get("isFeatured") === "on";
  const isActive = formData.get("isActive") !== "off";

  if (!name) return { error: "Product name is required." };
  if (isNaN(price) || price < 0) return { error: "Invalid price." };

  const images = formData.getAll("images") as File[];
  const validImages = images.filter((f) => f instanceof File && f.size > 0);
  for (const img of validImages) {
    if (img.size > MAX_IMAGE_BYTES) {
      return { error: `Image "${img.name}" is too large. Max 3MB per image.` };
    }
  }

  await prisma.product.update({
    where: { id: productId },
    data: { name, category, description, price, stock, sku, isFeatured, isActive },
  });

  if (validImages.length > 0) {
    const currentMax = await prisma.productImage.count({ where: { productId } });
    let position = currentMax;
    for (const img of validImages) {
      const { data, mimeType } = await fileToDataUrl(img);
      await prisma.productImage.create({
        data: { productId, data, mimeType, position: position++ },
      });
    }
  }

  revalidatePath("/admin/produk");
  revalidatePath(`/admin/produk/${productId}`);
  revalidatePath("/produk");
  return {};
}

export async function deleteProduct(productId: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/admin/produk");
  revalidatePath("/produk");
}

export async function deleteProductImage(productId: string, imageId: string) {
  await requireAdmin();
  await prisma.productImage.delete({ where: { id: imageId } });
  revalidatePath(`/admin/produk/${productId}`);
  revalidatePath("/produk");
}

export async function toggleProductActive(productId: string, isActive: boolean) {
  await requireAdmin();
  await prisma.product.update({ where: { id: productId }, data: { isActive } });
  revalidatePath("/admin/produk");
  revalidatePath("/produk");
}
