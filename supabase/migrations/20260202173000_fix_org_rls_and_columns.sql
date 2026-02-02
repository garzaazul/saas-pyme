-- Migration: Fix RLS for organizations table
-- This ensures users can update their own organization data

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- 1. SELECT Policy
DROP POLICY IF EXISTS "Users can view own organization" ON organizations;
CREATE POLICY "Users can view own organization"
ON organizations FOR SELECT
USING (id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- 2. UPDATE Policy
DROP POLICY IF EXISTS "Users can update own organization" ON organizations;
CREATE POLICY "Users can update own organization"
ON organizations FOR UPDATE
USING (id = (SELECT organization_id FROM profiles WHERE id = auth.uid()))
WITH CHECK (id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Add missing columns if for some reason migration didn't run fully before
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS transfer_details TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS tiktok_url TEXT;

COMMENT ON COLUMN organizations.transfer_details IS 'Instrucciones de pago y datos de transferencia de la empresa';
COMMENT ON COLUMN organizations.tiktok_url IS 'URL del perfil de TikTok de la empresa';
