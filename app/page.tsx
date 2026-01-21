import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Si hay usuario autenticado, ir al dashboard
    // Si no, ir al login
    if (user) {
        redirect("/dashboard");
    } else {
        redirect("/login");
    }
}
