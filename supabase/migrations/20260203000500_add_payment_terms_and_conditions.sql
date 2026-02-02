-- Add payment_terms to organizations (JSONB to store list of templates)
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS payment_terms JSONB DEFAULT '[]'::jsonb;
COMMENT ON COLUMN organizations.payment_terms IS 'Plantillas de condiciones de pago de la organización';

-- Add payment_condition to quotes (TEXT to store the specific condition for that quote)
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS payment_condition TEXT;
COMMENT ON COLUMN quotes.payment_condition IS 'Condición de pago específica de la cotización';
