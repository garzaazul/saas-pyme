-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price BIGINT NOT NULL DEFAULT 0, -- Manejo en CLP (sin decimales)
    stock_quantity INTEGER DEFAULT 0,
    type TEXT CHECK (type IN ('product', 'service')) NOT NULL DEFAULT 'product',
    image_urls TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own org products"
ON products FOR SELECT
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert own org products"
ON products FOR INSERT
WITH CHECK (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update own org products"
ON products FOR UPDATE
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete own org products"
ON products FOR DELETE
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Storage Policies (Simplified - assumes bucket 'products' exists or will be created)
-- Note: Supabase storage policies are often better managed via UI for complex folder structures 
-- but we can define the basics if we have access to storage schema.
-- Assuming standard storage.objects table access:

/* 
-- Example of storage policies if allowed:
CREATE POLICY "Image Upload Policy" ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'products' AND (storage.foldername(name))[1] = (SELECT organization_id::text FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Image View Policy" ON storage.objects FOR SELECT TO authenticated 
USING (bucket_id = 'products');
*/
