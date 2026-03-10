import { BaseEntity } from "./categories";

export interface PaymentTermTemplate {
    id: string;
    label: string;
    is_default: boolean;
}

export interface Organization extends BaseEntity {
    name: string;
    description: string | null;
    rut: string | null;
    web_slug: string | null;
    logo_url: string | null;
    whatsapp: string | null;
    email: string | null;
    instagram_url: string | null;
    facebook_url: string | null;
    tiktok_url: string | null;
    transfer_details: string | null;
    payment_terms: PaymentTermTemplate[] | null;
    show_tax_in_catalog: boolean;
    folio_inicial: number;
}

export type UpdateOrganizationInput = Partial<Omit<Organization, keyof BaseEntity>>;
