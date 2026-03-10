-- Migration: Document Correlatives and RLS Hardening
-- Date: 2026-03-10

-- 1. Extend organizations table
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS folio_inicial INTEGER DEFAULT 1;

-- 2. Create organization_sequences table
CREATE TABLE IF NOT EXISTS organization_sequences (
    organization_id UUID PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
    current_folio INTEGER NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on organization_sequences
ALTER TABLE organization_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own org sequences"
ON organization_sequences FOR SELECT
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- 3. Atomic function to get next correlative
CREATE OR REPLACE FUNCTION get_next_correlative(org_id UUID)
RETURNS INTEGER AS $$
DECLARE
    next_val INTEGER;
    init_val INTEGER;
BEGIN
    -- Try to update existing sequence
    UPDATE organization_sequences
    SET current_folio = current_folio + 1,
        updated_at = now()
    WHERE organization_id = org_id
    RETURNING current_folio INTO next_val;

    -- If no record exists, initialize it
    IF next_val IS NULL THEN
        -- Get folio_inicial from organizations
        SELECT folio_inicial INTO init_val
        FROM organizations
        WHERE id = org_id;

        -- Use 1 if not defined
        init_val := COALESCE(init_val, 1);

        INSERT INTO organization_sequences (organization_id, current_folio)
        VALUES (org_id, init_val)
        ON CONFLICT (organization_id) DO UPDATE -- handle race condition where init happened between SELECT and INSERT
        SET current_folio = organization_sequences.current_folio + 1
        RETURNING current_folio INTO next_val;
    END IF;

    RETURN next_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RLS Hardening for vulnerable tables
-- Clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own org clients" ON clients;
CREATE POLICY "Users can manage own org clients"
ON clients FOR ALL
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()))
WITH CHECK (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Profiles (Users can view their own profile and profiles of their organization)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can view org teammates" ON profiles;
CREATE POLICY "Users can view org teammates"
ON profiles FOR SELECT
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (id = auth.uid());

-- Sales (Assuming table 'sales' exists as per dashboard.ts)
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sales') THEN
        ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Users can manage own org sales" ON sales;
        EXECUTE 'CREATE POLICY "Users can manage own org sales" ON sales FOR ALL USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())) WITH CHECK (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()))';
    END IF;
END $$;

-- Expenses (Assuming table 'expenses' exists as per dashboard.ts)
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'expenses') THEN
        ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Users can manage own org expenses" ON expenses;
        EXECUTE 'CREATE POLICY "Users can manage own org expenses" ON expenses FOR ALL USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())) WITH CHECK (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()))';
    END IF;
END $$;
