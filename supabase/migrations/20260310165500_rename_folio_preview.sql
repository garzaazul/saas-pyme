-- Migration: Renaming Folio Preview Function for Clarity
-- Date: 2026-03-10

DROP FUNCTION IF EXISTS preview_next_correlative(UUID);

CREATE OR REPLACE FUNCTION get_next_folio_preview(p_org_id UUID)
RETURNS INTEGER AS $$
DECLARE
    current_val INTEGER;
    init_val INTEGER;
BEGIN
    -- Get current value from sequences
    SELECT current_folio INTO current_val
    FROM organization_sequences
    WHERE organization_id = p_org_id;

    -- If exists, the NEXT folio is current_val + 1
    IF current_val IS NOT NULL THEN
        RETURN current_val + 1;
    END IF;

    -- If no record exists, the NEXT folio is the folio_inicial
    SELECT folio_inicial INTO init_val
    FROM organizations
    WHERE id = p_org_id;

    RETURN COALESCE(init_val, 1);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
