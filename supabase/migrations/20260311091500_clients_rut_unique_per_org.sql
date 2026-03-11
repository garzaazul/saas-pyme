-- Migration: Clients RUT unique per organization
-- Date: 2026-03-11

-- First, let's check if there is a global uniqueness constraint on rut and drop it
-- In Supabase, these are often named 'clients_rut_key' or similar
DO $$ 
BEGIN 
    IF EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'clients_rut_key'
    ) THEN
        ALTER TABLE clients DROP CONSTRAINT clients_rut_key;
    END IF;
END $$;

-- Add composite unique constraint for organization_id and rut
-- This allows different organizations to have a client with the same RUT (e.g., 1-1)
-- but prevents the same organization from having duplicate RUTs.
ALTER TABLE clients ADD CONSTRAINT clients_org_rut_unique UNIQUE (organization_id, rut);
