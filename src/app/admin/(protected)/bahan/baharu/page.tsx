import MaterialForm from "@/components/admin/MaterialForm";
import { createMaterial } from "@/lib/actions/materials";

export default function NewMaterialPage() {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest-plus text-amber-strong">
        New Material
      </p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-navy-950">
        Add Print Material
      </h1>

      <MaterialForm action={createMaterial} submitLabel="Save Material" />
    </div>
  );
}
