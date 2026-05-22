/**
 * Helper compartido para resolver el organization_id del usuario autenticado.
 *
 * NO lleva "use server" — es una utilidad pura que recibe el cliente de Supabase
 * ya instanciado. Debe importarse únicamente desde server actions o route handlers.
 *
 * Segunda barrera: el código asume que Supabase RLS está activo en todas las tablas
 * como capa de defensa adicional (ver Fase 1.5 del plan de seguridad).
 */

import { createClient } from "@/utils/supabase/server";

// Tipo inferido del cliente de servidor para evitar importar genéricos de supabase-js
type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

/**
 * Resuelve el organization_id del usuario autenticado en la sesión actual.
 *
 * @throws Error("No autenticado")       — si no hay sesión activa
 * @throws Error("Perfil sin organización") — si el perfil existe pero no tiene org asignada
 */
export async function getOrgId(supabase: SupabaseServerClient): Promise<string> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("No autenticado");

    const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

    if (!profile?.organization_id) throw new Error("Perfil sin organización");

    return profile.organization_id as string;
}
