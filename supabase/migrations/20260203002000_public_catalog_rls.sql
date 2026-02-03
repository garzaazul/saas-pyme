-- 0. Ensure columns exist and web_slug is unique
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS web_slug TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS logo_url TEXT;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'organizations_web_slug_key') THEN
        ALTER TABLE organizations ADD CONSTRAINT organizations_web_slug_key UNIQUE (web_slug);
    END IF;
END $$;

-- 1. Organizations: Allow public SELECT if web_slug is set
DROP POLICY IF EXISTS "Public can view organizations by slug" ON organizations;
CREATE POLICY "Public can view organizations by slug"
ON organizations FOR SELECT
USING (web_slug IS NOT NULL);

-- 2. Products: Allow public SELECT for active products of public organizations
DROP POLICY IF EXISTS "Public can view active products" ON products;
CREATE POLICY "Public can view active products"
ON products FOR SELECT
USING (
    is_active = true AND 
    organization_id IN (SELECT id FROM organizations WHERE web_slug IS NOT NULL)
);

-- 3. Categories: Allow public SELECT for active categories of public organizations
DROP POLICY IF EXISTS "Public can view active categories" ON categories;
CREATE POLICY "Public can view active categories"
ON categories FOR SELECT
USING (
    is_active = true AND 
    organization_id IN (SELECT id FROM organizations WHERE web_slug IS NOT NULL)
);
