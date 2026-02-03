-- Migration: Add IVA toggle setting to organizations
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS show_tax_toggle_in_catalog BOOLEAN DEFAULT FALSE;

-- Update RLS if necessary (it should already be covered by the SELECT policy for public organizations)
-- Organizations: Public can view show_tax_toggle_in_catalog
