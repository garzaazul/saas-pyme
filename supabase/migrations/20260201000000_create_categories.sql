-- Create categories target type enum
DO $$ BEGIN
    CREATE TYPE category_target_type AS ENUM ('producto', 'servicio', 'ambos');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    target_type category_target_type NOT NULL DEFAULT 'ambos',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own org categories"
ON categories FOR SELECT
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert own org categories"
ON categories FOR INSERT
WITH CHECK (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update own org categories"
ON categories FOR UPDATE
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()))
WITH CHECK (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete own org categories"
ON categories FOR DELETE
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Unique constraint index
CREATE UNIQUE INDEX IF NOT EXISTS categories_name_org_type_idx ON categories (organization_id, name, target_type);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
