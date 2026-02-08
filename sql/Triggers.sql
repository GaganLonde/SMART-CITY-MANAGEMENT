/***************************************************
 Smart City Services Management System - MySQL Triggers
 Automatically generate utility bills after usage insertion
***************************************************/

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trg_auto_create_electricity_bill;
DROP TRIGGER IF EXISTS trg_auto_create_water_bill;

DELIMITER $$

-- =====================================================
-- TRIGGER 1: Auto-create Electricity Bill after Usage Insert
-- =====================================================
CREATE TRIGGER trg_auto_create_electricity_bill
AFTER INSERT ON electricity_usage
FOR EACH ROW
BEGIN
    DECLARE bill_amount DECIMAL(12,2);
    DECLARE due_date DATE;
    DECLARE bill_exists INT DEFAULT 0;
    
    -- Check if bill already exists for this account/year/month
    SELECT COUNT(*) INTO bill_exists
    FROM electricity_bills
    WHERE account_id = NEW.account_id
      AND bill_year = NEW.usage_month
      AND bill_month = NEW.usage_month_number;
    
    -- Only create bill if it doesn't already exist
    IF bill_exists = 0 THEN
        -- Calculate bill amount: 5.00 per unit (adjust rate as needed)
        SET bill_amount = NEW.units_consumed * 5.00;
        
        -- Set due date: 15 days after the end of the bill month
        SET due_date = DATE_ADD(
            LAST_DAY(STR_TO_DATE(CONCAT(NEW.usage_month, '-', LPAD(NEW.usage_month_number, 2, '0'), '-01'), '%Y-%m-%d')),
            INTERVAL 15 DAY
        );
        
        -- Insert the electricity bill
        INSERT INTO electricity_bills (
            account_id,
            bill_year,
            bill_month,
            units_consumed,
            amount,
            status,
            due_date
        ) VALUES (
            NEW.account_id,
            NEW.usage_month,
            NEW.usage_month_number,
            NEW.units_consumed,
            bill_amount,
            'Unpaid',
            due_date
        );
    END IF;
END$$

-- =====================================================
-- TRIGGER 2: Auto-create Water Bill after Usage Insert
-- =====================================================
CREATE TRIGGER trg_auto_create_water_bill
AFTER INSERT ON water_usage
FOR EACH ROW
BEGIN
    DECLARE bill_amount DECIMAL(12,2);
    DECLARE due_date DATE;
    DECLARE bill_exists INT DEFAULT 0;
    
    -- Check if bill already exists for this account/year/month
    SELECT COUNT(*) INTO bill_exists
    FROM water_bills
    WHERE account_id = NEW.account_id
      AND bill_year = NEW.usage_month
      AND bill_month = NEW.usage_month_number;
    
    -- Only create bill if it doesn't already exist
    IF bill_exists = 0 THEN
        -- Calculate bill amount: 0.02 per litre (adjust rate as needed)
        SET bill_amount = NEW.litres_consumed * 0.02;
        
        -- Set due date: 10 days after the end of the bill month
        SET due_date = DATE_ADD(
            LAST_DAY(STR_TO_DATE(CONCAT(NEW.usage_month, '-', LPAD(NEW.usage_month_number, 2, '0'), '-01'), '%Y-%m-%d')),
            INTERVAL 10 DAY
        );
        
        -- Insert the water bill
        INSERT INTO water_bills (
            account_id,
            bill_year,
            bill_month,
            litres_consumed,
            amount,
            status,
            due_date
        ) VALUES (
            NEW.account_id,
            NEW.usage_month,
            NEW.usage_month_number,
            NEW.litres_consumed,
            bill_amount,
            'Unpaid',
            due_date
        );
    END IF;
END$$

DELIMITER ;

-- =====================================================
-- Verification Queries (Optional - for testing)
-- =====================================================

-- Test: Insert a new electricity usage record
-- INSERT INTO electricity_usage (account_id, usage_month, usage_month_number, units_consumed, meter_reading_time)
-- VALUES (1, 2025, 3, 250.00, NOW());
-- 
-- Check if bill was created:
-- SELECT * FROM electricity_bills WHERE account_id = 1 AND bill_year = 2025 AND bill_month = 3;

-- Test: Insert a new water usage record
-- INSERT INTO water_usage (account_id, usage_month, usage_month_number, litres_consumed, recorded_at)
-- VALUES (1, 2025, 3, 15000.00, NOW());
-- 
-- Check if bill was created:
-- SELECT * FROM water_bills WHERE account_id = 1 AND bill_year = 2025 AND bill_month = 3;
