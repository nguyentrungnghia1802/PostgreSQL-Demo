-- 05_triggers.sql
-- Audit trigger for products table

-- Function: captures old and new row data on UPDATE and writes to audit_logs
CREATE OR REPLACE FUNCTION log_product_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (table_name, action, old_data, new_data)
    VALUES (
        TG_TABLE_NAME,
        TG_OP,
        row_to_json(OLD)::jsonb,
        row_to_json(NEW)::jsonb
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: fires after any UPDATE on the products table
CREATE OR REPLACE TRIGGER trg_products_audit
    AFTER UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION log_product_changes();
