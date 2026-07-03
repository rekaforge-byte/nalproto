import ServiceForm from "@/components/admin/ServiceForm";
import { createService } from "@/lib/actions/services";

export default function NewServicePage() {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest-plus text-amber-strong">
        New Service
      </p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-navy-950">
        Add Service
      </h1>

      <ServiceForm action={createService} submitLabel="Save Service" />
    </div>
  );
}
