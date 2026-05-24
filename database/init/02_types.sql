-- 02_types.sql
-- Custom ENUM types

-- transfer_status: used in transfer_logs to track fund transfer results
CREATE TYPE transfer_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
