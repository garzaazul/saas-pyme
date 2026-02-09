-- Migración: Políticas RLS Públicas para Relaciones de Categorías (Catálogo)
-- Contexto: Permitir que clientes anónimos vean las categorías asociadas a productos en el catálogo público.

-- 1. Política SELECT para acceso público
-- Permite lectura si la organización tiene un web_slug activo (es pública)
CREATE POLICY "Public can view product_categories via web_slug"
ON product_categories FOR SELECT
USING (
    organization_id IN (
        SELECT id FROM organizations WHERE web_slug IS NOT NULL
    )
);

-- Nota: categories y products ya tienen políticas similares en 20260203002000_public_catalog_rls.sql
