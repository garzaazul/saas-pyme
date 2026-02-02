-- Add is_active column to products if not exists
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
COMMENT ON COLUMN products.is_active IS 'Indica si el producto está activo o en la papelera';

-- Add index to products(is_active) for faster filtering
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- Add is_active column to quotes if not exists
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
COMMENT ON COLUMN quotes.is_active IS 'Indica si la cotización está activa o en la papelera';

-- Add index to quotes(is_active) for faster filtering
CREATE INDEX IF NOT EXISTS idx_quotes_is_active ON quotes(is_active);
