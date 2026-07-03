import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ServiceForm from "@/components/admin/ServiceForm";
import { updateService } from "@/lib/actions/services";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  const updateWithId = updateService.bind(null, service.id);

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest-plus text-amber-strong">
        Edit Service
      </p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-navy-950">
        {service.title}
      </h1>

      <ServiceForm
        action={updateWithId}
        submitLabel="Update Service"
        initial={{
          title: service.title,
          description: service.description,
          position: service.position,
          isActive: service.isActive,
        }}
      />
    </div>
  );
}
