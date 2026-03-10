-- Migration: Folio Preview Function
-- Date: 2026-03-10

CREATE OR REPLACE FUNCTION preview_next_correlative(org_id UUID)
RETURNS INTEGER AS $$
DECLARE
    current_val INTEGER;
    init_val INTEGER;
BEGIN
    -- Get current value from sequences
    SELECT current_folio INTO current_val
    FROM organization_sequences
    WHERE organization_id = org_id;

    -- If exists, the NEXT folio is current_val + 1
    IF current_val IS NOT NULL THEN
        RETURN current_val + 1;
    END IF;

    -- If no record exists, the NEXT folio is the folio_inicial
    SELECT folio_inicial INTO init_val
    FROM organizations
    WHERE id = org_id;

    RETURN COALESCE(init_val, 1);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
