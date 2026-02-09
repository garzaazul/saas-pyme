-- Migración: Refactor Relación Productos-Categorías (Muchos a Muchos)
-- Contexto: Evolucionar de 1:N a N:M

-- 1. Crear Nueva Tabla Intermedia (product_categories)
CREATE TABLE IF NOT EXISTS product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(product_id, category_id)
);

-- 2. Seguridad RLS (Prioridad RC-1)
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

-- Política SELECT
CREATE POLICY "Users can view own org product_categories"
ON product_categories FOR SELECT
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Política INSERT
CREATE POLICY "Users can insert own org product_categories"
ON product_categories FOR INSERT
WITH CHECK (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Política UPDATE
CREATE POLICY "Users can update own org product_categories"
ON product_categories FOR UPDATE
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()))
WITH CHECK (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Política DELETE
CREATE POLICY "Users can delete own org product_categories"
ON product_categories FOR DELETE
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- 3. Optimización (Índices)
CREATE INDEX IF NOT EXISTS idx_product_categories_product_id ON product_categories(product_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_category_id ON product_categories(category_id);

-- 4. Migración de Datos (Data Integrity)
INSERT INTO product_categories (product_id, category_id, organization_id)
SELECT id, category_id, organization_id 
FROM products 
WHERE category_id IS NOT NULL;

-- 5. Limpieza de Esquema
ALTER TABLE products DROP COLUMN IF EXISTS category_id;

-- 6. Trigger para updated_at en la nueva tabla
DROP TRIGGER IF EXISTS update_product_categories_updated_at ON product_categories;
CREATE TRIGGER update_product_categories_updated_at
    BEFORE UPDATE ON product_categories
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
