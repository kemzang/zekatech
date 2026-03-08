import { ServiceForm } from "../service-form";

export default function NewServicePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-foreground">Nouveau service</h1>
      <p className="mt-1 text-muted-foreground">
        Créez un nouveau type de service proposé sur le site.
      </p>
      <div className="mt-6">
        <ServiceForm />
      </div>
    </div>
  );
}
