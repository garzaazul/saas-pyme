import { BaseEntity } from "./categories";

export type ProductType = 'product' | 'service';

export interface Product extends BaseEntity {
    category_id: string | null;
    name: string;
    description: string | null;
    base_price: number;
    current_stock: number;
    min_stock_alert: number;
    unit: string;
    is_stock_product: boolean;
    type: ProductType;
    image_urls: string[];
    is_active: boolean;
}

export interface CreateProductInput {
    name: string;
    description?: string;
    category_id?: string;
    base_price: number;
    current_stock?: number;
    min_stock_alert?: number;
    unit?: string;
    is_stock_product?: boolean;
    type: ProductType;
    image_urls: string[];
    is_active?: boolean;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
    id: string;
}
