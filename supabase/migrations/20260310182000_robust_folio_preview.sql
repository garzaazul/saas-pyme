-- Migration: Robust Folio Preview and Correlative Logic
-- Date: 2026-03-10

CREATE OR REPLACE FUNCTION get_next_folio_preview(p_org_id UUID)
RETURNS INTEGER AS $$
DECLARE
    current_seq_val INTEGER;
    init_val INTEGER;
    max_quote_folio INTEGER;
BEGIN
    -- 1. Get current value from sequences
    SELECT current_folio INTO current_seq_val
    FROM organization_sequences
    WHERE organization_id = p_org_id;

    -- 2. Get max folio from actual quotes (real source of truth)
    SELECT MAX(folio) INTO max_quote_folio
    FROM quotes
    WHERE organization_id = p_org_id;

    -- 3. Get configured folio_inicial
    SELECT folio_inicial INTO init_val
    FROM organizations
    WHERE id = p_org_id;
    
    init_val := COALESCE(init_val, 1);

    -- Determination Logic:
    -- If quote exists, next is MAX(folio) + 1.
    -- If sequence exists (but no quote), next is sequence + 1. (This handles deleted quotes better if we track it, but for now we follow max quote)
    
    IF max_quote_folio IS NOT NULL THEN
        -- Priority to existing data in quotes table
        RETURN max_quote_folio + 1;
    END IF;

    IF current_seq_val IS NOT NULL THEN
        -- Fallback to sequence if somehow quotes are empty but sequence exists
        RETURN current_seq_val + 1;
    END IF;

    -- Absolute fallback to initial configuration
    RETURN init_val;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Robust Get Next Correlative
CREATE OR REPLACE FUNCTION get_next_correlative(p_org_id UUID)
RETURNS INTEGER AS $$
DECLARE
    next_val INTEGER;
    init_val INTEGER;
    max_quote_folio INTEGER;
BEGIN
    -- 1. Get max from quotes first to avoid overlapping
    SELECT MAX(folio) INTO max_quote_folio
    FROM quotes
    WHERE organization_id = p_org_id;

    -- 2. Try to update existing sequence ensuring it's at least one more than existing max quote
    UPDATE organization_sequences
    SET current_folio = GREATEST(current_folio, COALESCE(max_quote_folio, 0)) + 1,
        updated_at = now()
    WHERE organization_id = p_org_id
    RETURNING current_folio INTO next_val;

    -- 3. If no record exists, initialize it
    IF next_val IS NULL THEN
        -- Get folio_inicial
        SELECT folio_inicial INTO init_val
        FROM organizations
        WHERE id = p_org_id;

        init_val := COALESCE(init_val, 1);
        
        -- The starting value should be the higher between init_val and existing quotes
        next_val := GREATEST(init_val, COALESCE(max_quote_folio, 0) + 1);

        INSERT INTO organization_sequences (organization_id, current_folio)
        VALUES (p_org_id, next_val)
        ON CONFLICT (organization_id) DO UPDATE
        SET current_folio = GREATEST(organization_sequences.current_folio, next_val) + 1
        RETURNING current_folio INTO next_val;
    END IF;

    RETURN next_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permissions
GRANT EXECUTE ON FUNCTION get_next_folio_preview(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_next_folio_preview(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION get_next_correlative(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_next_correlative(UUID) TO service_role;
