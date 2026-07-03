import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MaterialForm from "@/components/admin/MaterialForm";
import { updateMaterial } from "@/lib/actions/materials";

export default async function EditMaterialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const material = await prisma.material.findUnique({ where: { id } });
  if (!material) notFound();

  const updateWithId = updateMaterial.bind(null, material.id);

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest-plus text-amber-strong">
        Edit Material
      </p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-navy-950">
        {material.name}
      </h1>

      <MaterialForm
        action={updateWithId}
        submitLabel="Update Material"
        initial={{
          name: material.name,
          densityGCm3: material.densityGCm3.toString(),
          costPerGram: material.costPerGram.toString(),
          position: material.position,
          isActive: material.isActive,
        }}
      />
    </div>
  );
}
