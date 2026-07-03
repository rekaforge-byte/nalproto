import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/actions/products";

export default function NewProductPage() {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest-plus text-amber-strong">
        New Product
      </p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-navy-950">
        Add Product
      </h1>

      <ProductForm action={createProduct} submitLabel="Save Product" />
    </div>
  );
}
