-- Migration: Rename IVA setting and change its purpose
-- Instead of a toggle for the customer, it's now a fixed setting by the owner

ALTER TABLE organizations 
RENAME COLUMN show_tax_toggle_in_catalog TO show_tax_in_catalog;

COMMENT ON COLUMN organizations.show_tax_in_catalog IS 'If true, the catalog will automatically show prices with IVA (19%). If false, it shows net prices.';
