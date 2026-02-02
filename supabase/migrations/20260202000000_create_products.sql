-- Migration to adapt existing products table to the new requirements
-- Base structure provided by user is already in place.

-- 1. Add type column for product/service differentiation if not exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='type') THEN
        ALTER TABLE products ADD COLUMN type TEXT CHECK (type IN ('product', 'service')) DEFAULT 'product';
    END IF;
END $$;

-- 2. Add category_id for dynamic categories relation
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='category_id') THEN
        ALTER TABLE products ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 3. Transition image_url (text) to image_urls (text array)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='image_urls') THEN
        ALTER TABLE products ADD COLUMN image_urls TEXT[] DEFAULT '{}';
        -- Migrate data if image_url has value
        UPDATE products SET image_urls = ARRAY[image_url] WHERE image_url IS NOT NULL;
    END IF;
END $$;

-- 4. Add is_active and updated_at if not present
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='is_active') THEN
        ALTER TABLE products ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='updated_at') THEN
        ALTER TABLE products ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
    END IF;
END $$;

-- 5. Set up RLS (safe to run multiple times with IF NOT EXISTS logic via policies)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own org products" ON products;
CREATE POLICY "Users can view own org products"
ON products FOR SELECT
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert own org products" ON products;
CREATE POLICY "Users can insert own org products"
ON products FOR INSERT
WITH CHECK (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can update own org products" ON products;
CREATE POLICY "Users can update own org products"
ON products FOR UPDATE
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete own org products" ON products;
CREATE POLICY "Users can delete own org products"
ON products FOR DELETE
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- 6. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
