import { getMyOrganization } from "@/app/actions/organizations";
import { OrganizationForm } from "@/components/dashboard/organization-form";

export default async function MiEmpresaPage() {
    const organization = await getMyOrganization();

    if (!organization) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">No se pudo cargar la información de la empresa.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Mi Empresa</h3>
                <p className="text-sm text-muted-foreground">
                    Gestiona la información de tu organización, identidad visual y datos de contacto.
                </p>
            </div>
            <OrganizationForm organization={organization} />
        </div>
    );
}
