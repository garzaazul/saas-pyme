import { redirect } from "next/navigation";
import { getProfile } from "@/app/actions/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const profile = await getProfile();

    if (!profile) {
        redirect("/login");
    }

    const organization = profile.organizations || { name: "Mi Empresa " };
    const organizationName = organization.name || "Mi Empresa";

    return (
        <DashboardShell
            organizationName={organizationName}
            userName={profile.full_name || "Usuario"}
            userEmail={profile.email || ""}
            userAvatarUrl={undefined}
        >
            {children}
        </DashboardShell>
    );
}
