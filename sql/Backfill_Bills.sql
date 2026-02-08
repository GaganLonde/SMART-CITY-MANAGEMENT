/***************************************************
 Smart City Services Management System - MySQL Backfill Script
 Generate bills for existing usage records that don't have bills yet
 Run this AFTER installing the triggers to backfill existing data
***************************************************/

-- =====================================================
-- Backfill Electricity Bills for Existing Usage Records
-- =====================================================
INSERT INTO electricity_bills (
    account_id,
    bill_year,
    bill_month,
    units_consumed,
    amount,
    status,
    due_date
)
SELECT 
    eu.account_id,
    eu.usage_month AS bill_year,
    eu.usage_month_number AS bill_month,
    eu.units_consumed,
    -- Calculate bill amount: 5.00 per unit (adjust rate as needed)
    ROUND(eu.units_consumed * 5.00, 2) AS amount,
    'Unpaid' AS status,
    -- Set due date: 15 days after the end of the bill month
    DATE_ADD(
        LAST_DAY(STR_TO_DATE(CONCAT(eu.usage_month, '-', LPAD(eu.usage_month_number, 2, '0'), '-01'), '%Y-%m-%d')),
        INTERVAL 15 DAY
    ) AS due_date
FROM electricity_usage eu
LEFT JOIN electricity_bills eb 
    ON eu.account_id = eb.account_id
    AND eu.usage_month = eb.bill_year
    AND eu.usage_month_number = eb.bill_month
WHERE eb.bill_id IS NULL  -- Only insert bills for usage records that don't have bills yet
ORDER BY eu.account_id, eu.usage_month, eu.usage_month_number;

-- =====================================================
-- Backfill Water Bills for Existing Usage Records
-- =====================================================
INSERT INTO water_bills (
    account_id,
    bill_year,
    bill_month,
    litres_consumed,
    amount,
    status,
    due_date
)
SELECT 
    wu.account_id,
    wu.usage_month AS bill_year,
    wu.usage_month_number AS bill_month,
    wu.litres_consumed,
    -- Calculate bill amount: 0.02 per litre (adjust rate as needed)
    ROUND(wu.litres_consumed * 0.02, 2) AS amount,
    'Unpaid' AS status,
    -- Set due date: 10 days after the end of the bill month
    DATE_ADD(
        LAST_DAY(STR_TO_DATE(CONCAT(wu.usage_month, '-', LPAD(wu.usage_month_number, 2, '0'), '-01'), '%Y-%m-%d')),
        INTERVAL 10 DAY
    ) AS due_date
FROM water_usage wu
LEFT JOIN water_bills wb 
    ON wu.account_id = wb.account_id
    AND wu.usage_month = wb.bill_year
    AND wu.usage_month_number = wb.bill_month
WHERE wb.bill_id IS NULL  -- Only insert bills for usage records that don't have bills yet
ORDER BY wu.account_id, wu.usage_month, wu.usage_month_number;

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check how many electricity usage records don't have bills
SELECT 
    COUNT(*) AS usage_without_bills
FROM electricity_usage eu
LEFT JOIN electricity_bills eb 
    ON eu.account_id = eb.account_id
    AND eu.usage_month = eb.bill_year
    AND eu.usage_month_number = eb.bill_month
WHERE eb.bill_id IS NULL;

-- Check how many water usage records don't have bills
SELECT 
    COUNT(*) AS usage_without_bills
FROM water_usage wu
LEFT JOIN water_bills wb 
    ON wu.account_id = wb.account_id
    AND wu.usage_month = wb.bill_year
    AND wu.usage_month_number = wb.bill_month
WHERE wb.bill_id IS NULL;

-- Summary: Count bills created per account
SELECT 
    'Electricity' AS bill_type,
    account_id,
    COUNT(*) AS bills_created
FROM electricity_bills
GROUP BY account_id
UNION ALL
SELECT 
    'Water' AS bill_type,
    account_id,
    COUNT(*) AS bills_created
FROM water_bills
GROUP BY account_id
ORDER BY bill_type, account_id;
