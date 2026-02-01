export type CategoryTargetType = 'producto' | 'servicio' | 'ambos';

export interface BaseEntity {
    id: string;
    organization_id: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
}

export interface Category extends BaseEntity {
    name: string;
    description: string | null;
    target_type: CategoryTargetType;
}

export interface CreateCategoryInput {
    name: string;
    description?: string;
    target_type: CategoryTargetType;
    is_active?: boolean;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
    id: string;
}
