-- Add payment_terms to organizations (JSONB to store list of templates)
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS payment_terms JSONB DEFAULT '[]'::jsonb;
COMMENT ON COLUMN organizations.payment_terms IS 'Plantillas de condiciones de pago de la organización';

-- Add payment_condition to quotes (TEXT to store the specific condition for that quote)
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS payment_condition TEXT;
COMMENT ON COLUMN quotes.payment_condition IS 'Condición de pago específica de la cotización';

-- Ensure updated_at exists in quotes
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Ensure created_at exists in quote_items
ALTER TABLE quote_items ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- Ensure trigger for updated_at exists for quotes
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_quotes_updated_at') THEN
        CREATE TRIGGER update_quotes_updated_at
            BEFORE UPDATE ON quotes
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
