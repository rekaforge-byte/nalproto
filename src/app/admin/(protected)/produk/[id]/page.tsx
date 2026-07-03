import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { updateProduct, deleteProductImage } from "@/lib/actions/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  });

  if (!product) notFound();

  const updateWithId = updateProduct.bind(null, product.id);
  const deleteImageWithId = deleteProductImage.bind(null, product.id);

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest-plus text-amber-strong">
        Edit Product
      </p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-navy-950">
        {product.name}
      </h1>

      <ProductForm
        action={updateWithId}
        submitLabel="Update Product"
        initial={{
          name: product.name,
          category: product.category,
          description: product.description,
          price: product.price.toString(),
          sku: product.sku || "",
          stock: product.stock === null ? "" : String(product.stock),
          isFeatured: product.isFeatured,
          isActive: product.isActive,
        }}
        existingImages={product.images.map((img) => ({
          id: img.id,
          dataUrl: `data:${img.mimeType};base64,${img.data}`,
        }))}
        onDeleteImage={deleteImageWithId}
      />
    </div>
  );
}
