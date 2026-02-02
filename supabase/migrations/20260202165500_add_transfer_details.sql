-- Add transfer_details column to organizations table
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS transfer_details TEXT;

-- Comment on column
COMMENT ON COLUMN organizations.transfer_details IS 'Instrucciones de pago y datos de transferencia de la empresa';
