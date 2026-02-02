-- Refactor Quote Statuses
-- 1. Create new ENUM value or update existing one
-- Note: In Postgres, updating ENUMs in a migration is safer by adding values or creating a new type.

-- For simplicity and data integrity, we add the new values first
ALTER TYPE quote_status ADD VALUE IF NOT EXISTS 'pendiente';
ALTER TYPE quote_status ADD VALUE IF NOT EXISTS 'aprobada';
ALTER TYPE quote_status ADD VALUE IF NOT EXISTS 'vencida';

-- 2. Update existing data mappings
UPDATE quotes SET status = 'pendiente' WHERE status IN ('borrador', 'enviada');
UPDATE quotes SET status = 'aprobada' WHERE status = 'aceptada';

-- 3. Set default for new records
ALTER TABLE quotes ALTER COLUMN status SET DEFAULT 'pendiente';

-- 4. Audit is_active (BUG FIX)
-- Ensure all quotes that aren't meant to be deleted have is_active = true
UPDATE quotes SET is_active = true WHERE is_active IS NULL;

-- 5. Add index for performance on status filtering if not exists
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
