-- 07_views.sql
-- Analytical views

-- revenue_by_region: aggregates total revenue and number of sales per region
CREATE OR REPLACE VIEW revenue_by_region AS
SELECT
    region,
    SUM(amount)   AS total_revenue,
    COUNT(*)      AS total_sales
FROM sales
GROUP BY region
ORDER BY total_revenue DESC;
