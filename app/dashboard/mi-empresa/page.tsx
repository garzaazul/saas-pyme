import { getMyOrganization } from "@/app/actions/organizations";
import { OrganizationForm } from "@/components/dashboard/organization-form";

export default async function MiEmpresaPage() {
    const organization = await getMyOrganization();

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
