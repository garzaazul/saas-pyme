-- Migration: Fix RLS Recursion in Profiles Table
-- Date: 2026-03-10

-- 1. Create a security definer function to fetch organization_id
-- This function bypasses RLS for the profiles table itself to avoid infinite recursion
CREATE OR REPLACE FUNCTION get_my_organization_id()
RETURNS UUID AS $$
    SELECT organization_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 2. Update profiles table policies
-- Remove problematic teammate policy
DROP POLICY IF EXISTS "Users can view org teammates" ON profiles;

-- Re-implement teammate policy using the safe function
CREATE POLICY "Users can view org teammates"
ON profiles FOR SELECT
USING (organization_id = get_my_organization_id());

-- 3. (Optional but recommended) Update other policies to use the function for consistency/performance
-- Organizations
DROP POLICY IF EXISTS "Users can view own organization" ON organizations;
CREATE POLICY "Users can view own organization"
ON organizations FOR SELECT
USING (id = get_my_organization_id());

DROP POLICY IF EXISTS "Users can update own organization" ON organizations;
CREATE POLICY "Users can update own organization"
ON organizations FOR UPDATE
USING (id = get_my_organization_id());

-- Quotes
DROP POLICY IF EXISTS "Users can view own org quotes" ON quotes;
CREATE POLICY "Users can view own org quotes"
ON quotes FOR SELECT
USING (organization_id = get_my_organization_id());

DROP POLICY IF EXISTS "Users can insert own org quotes" ON quotes;
CREATE POLICY "Users can insert own org quotes"
ON quotes FOR INSERT
WITH CHECK (organization_id = get_my_organization_id());

-- Clients
DROP POLICY IF EXISTS "Users can manage own org clients" ON clients;
CREATE POLICY "Users can manage own org clients"
ON clients FOR ALL
USING (organization_id = get_my_organization_id())
WITH CHECK (organization_id = get_my_organization_id());

-- Products
DROP POLICY IF EXISTS "Users can view own org products" ON products;
CREATE POLICY "Users can view own org products"
ON products FOR SELECT
USING (organization_id = get_my_organization_id());

DROP POLICY IF EXISTS "Users can insert own org products" ON products;
CREATE POLICY "Users can insert own org products"
ON products FOR INSERT
WITH CHECK (organization_id = get_my_organization_id());

-- Sales
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sales') THEN
        ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Users can manage own org sales" ON sales;
        EXECUTE 'CREATE POLICY "Users can manage own org sales" ON sales FOR ALL USING (organization_id = get_my_organization_id()) WITH CHECK (organization_id = get_my_organization_id())';
    END IF;
END $$;

-- Expenses
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'expenses') THEN
        ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Users can manage own org expenses" ON expenses;
        EXECUTE 'CREATE POLICY "Users can manage own org expenses" ON expenses FOR ALL USING (organization_id = get_my_organization_id()) WITH CHECK (organization_id = get_my_organization_id())';
    END IF;
END $$;
