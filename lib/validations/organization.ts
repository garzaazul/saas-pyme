import { z } from "zod";

// Helper for Chilean RUT validation (basic format check)
const rutRegex = /^(\d{1,2}(\.?\d{3}){2}-[\dkK])$/;

// Helper for Chilean WhatsApp normalization (+569...)
const whatsappRegex = /^(\+569\d{8})$/;

export const organizationSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    description: z.string().max(500, "La descripción es muy larga").nullable(),
    rut: z.string().regex(rutRegex, "Formato de RUT inválido (ej: 12.345.678-9)").nullable(),
    web_slug: z.string().min(2, "El slug debe tener al menos 2 caracteres").regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones"),
    logo_url: z.string().url("URL de logo inválida").nullable().optional(),
    whatsapp: z.string().regex(whatsappRegex, "Formato de WhatsApp inválido (ej: +56912345678)").nullable(),
    email: z.string().email("Email inválido").nullable(),
    instagram_url: z.string().url("URL de Instagram inválida").nullable().or(z.literal("")).optional(),
    facebook_url: z.string().url("URL de Facebook inválida").nullable().or(z.literal("")).optional(),
    tiktok_url: z.string().url("URL de TikTok inválida").nullable().or(z.literal("")).optional(),
    transfer_details: z.string().max(1000, "Los datos de transferencia son muy largos").nullable(),
});

export type OrganizationFormValues = z.infer<typeof organizationSchema>;
