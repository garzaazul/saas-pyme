-- Create quote status enum
DO $$ BEGIN
    CREATE TYPE quote_status AS ENUM ('borrador', 'enviada', 'aceptada', 'facturada', 'rechazada');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create quotes table (Cabecera)
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id),
    folio INTEGER NOT NULL,
    status quote_status NOT NULL DEFAULT 'borrador',
    total_amount NUMERIC(15,0) NOT NULL DEFAULT 0, -- CLP sin decimales
    valid_until DATE,
    observations TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    priority TEXT DEFAULT 'media',
    probability INTEGER DEFAULT 0,
    estimated_close_date DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    -- Folio unique per organization
    UNIQUE(organization_id, folio)
);

-- Create quote items table (Detalle Híbrido)
CREATE TABLE IF NOT EXISTS quote_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    quantity NUMERIC NOT NULL DEFAULT 1,
    unit_price NUMERIC(15,0) NOT NULL DEFAULT 0,
    total_line NUMERIC(15,0) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;

-- Quotes Policies
CREATE POLICY "Users can view own org quotes"
ON quotes FOR SELECT
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert own org quotes"
ON quotes FOR INSERT
WITH CHECK (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update own org quotes"
ON quotes FOR UPDATE
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()))
WITH CHECK (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete own org quotes"
ON quotes FOR DELETE
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Quote Items Policies (inherit from quotes access)
CREATE POLICY "Users can view own org quote items"
ON quote_items FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM quotes 
        WHERE quotes.id = quote_items.quote_id 
        AND quotes.organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
    )
);

CREATE POLICY "Users can insert own org quote items"
ON quote_items FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM quotes 
        WHERE quotes.id = quote_items.quote_id 
        AND quotes.organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
    )
);

CREATE POLICY "Users can update own org quote items"
ON quote_items FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM quotes 
        WHERE quotes.id = quote_items.quote_id 
        AND quotes.organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
    )
);

CREATE POLICY "Users can delete own org quote items"
ON quote_items FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM quotes 
        WHERE quotes.id = quote_items.quote_id 
        AND quotes.organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
    )
);

-- Function to get next folio for organization
CREATE OR REPLACE FUNCTION get_next_quote_folio(org_id UUID)
RETURNS INTEGER AS $$
DECLARE
    next_folio INTEGER;
BEGIN
    SELECT COALESCE(MAX(folio), 0) + 1 INTO next_folio
    FROM quotes
    WHERE organization_id = org_id;
    RETURN next_folio;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_quotes_updated_at
    BEFORE UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
