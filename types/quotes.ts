import { BaseEntity } from "./categories";

export type QuoteStatus = 'borrador' | 'enviada' | 'aceptada' | 'facturada' | 'rechazada';

export interface Quote extends BaseEntity {
    organization_id: string;
    client_id: string;
    folio: number;
    status: QuoteStatus;
    total_amount: number;
    valid_until: string | null;
    observations: string | null;
    payment_condition: string | null;
    version: number;
    is_active: boolean;
    items?: QuoteItem[];
}

export interface QuoteItem {
    id: string;
    quote_id: string;
    product_id: string | null;
    description: string;
    quantity: number;
    unit_price: number;
    total_line: number;
    created_at: string;
}

export interface CreateQuoteInput {
    client_id: string;
    status?: QuoteStatus;
    valid_until?: string | null;
    observations?: string | null;
    payment_condition?: string | null;
    items: CreateQuoteItemInput[];
}

export interface CreateQuoteItemInput {
    product_id?: string | null;
    description: string;
    quantity: number;
    unit_price: number;
}

export interface UpdateQuoteInput extends Partial<CreateQuoteInput> {
    id: string;
}
