-- SMART CITY SERVICES MANAGEMENT SYSTEM
-- AUTO DATA GENERATION SCRIPT (3000+ RECORDS)
-- Compatible with MySQL 8.0+
-- =========================================

USE smart_city_management;

-- ===============================
-- ADDRESSES (300)
-- ===============================
INSERT INTO addresses (street, area, city, state, zipcode)
SELECT
  CONCAT('Street-', n),
  CONCAT('Area-', (n % 20) + 1),
  ELT((n % 4) + 1, 'Pune', 'Mumbai', 'Bengaluru', 'Delhi'),
  ELT((n % 4) + 1, 'Maharashtra','Maharashtra','Karnataka','Delhi'),
  LPAD(400000 + n, 6, '0')
FROM (
  WITH RECURSIVE seq AS (
    SELECT 1 n UNION ALL SELECT n+1 FROM seq WHERE n < 300
  ) SELECT n FROM seq
) x;

-- ===============================
-- CITIZENS (300)
-- ===============================
INSERT INTO citizens (name, dob, gender, phone, email, address_id)
SELECT
  CONCAT('Citizen-', n),
  DATE_SUB(CURDATE(), INTERVAL (20 + (n % 40)) YEAR),
  IF(n % 2 = 0, 'M', 'F'),
  CONCAT('98', LPAD(n, 8, '0')),
  CONCAT('citizen', n, '@smartcity.com'),
  n
FROM (
  WITH RECURSIVE seq AS (
    SELECT 1 n UNION ALL SELECT n+1 FROM seq WHERE n < 300
  ) SELECT n FROM seq
) x;

-- ===============================
-- UTILITY ACCOUNTS (300)
-- ===============================
INSERT INTO utility_accounts (citizen_id, electricity_account_no, water_account_no)
SELECT
  n,
  CONCAT('ELEC-', LPAD(n,5,'0')),
  CONCAT('WATR-', LPAD(n,5,'0'))
FROM (
  WITH RECURSIVE seq AS (
    SELECT 1 n UNION ALL SELECT n+1 FROM seq WHERE n < 300
  ) SELECT n FROM seq
) x;

-- ===============================
-- ELECTRICITY USAGE (600)
-- ===============================

INSERT INTO electricity_usage
(account_id, usage_month, usage_month_number, units_consumed, meter_reading_time)
SELECT
  ua.account_id,
  2025,
  m.month_no,
  ROUND(150 + RAND()*300, 2),
  DATE_ADD('2025-01-01', INTERVAL m.month_no MONTH)
FROM utility_accounts ua
CROSS JOIN (
  SELECT 1 AS month_no UNION ALL SELECT 2 UNION ALL SELECT 3
) m;

-- ===============================
-- WATER USAGE (600)
-- ===============================
INSERT INTO water_usage
(account_id, usage_month, usage_month_number, litres_consumed, recorded_at)
SELECT
  ua.account_id,
  2025,
  m.month_no,
  ROUND(5000 + RAND()*15000, 2),
  NOW()
FROM utility_accounts ua
CROSS JOIN (
  SELECT 1 AS month_no UNION ALL SELECT 2
) m;


-- ===============================
-- ELECTRICITY BILLS (600)
-- ===============================
INSERT INTO electricity_bills (account_id, bill_year, bill_month, units_consumed, amount, status, due_date)
SELECT
  account_id,
  bill_year,
  bill_month,
  units_consumed,
  ROUND(units_consumed * 5, 2),
  'Unpaid',
  DATE_ADD(CURDATE(), INTERVAL 15 DAY)
FROM electricity_usage;

-- ===============================
-- WATER BILLS (600)
-- ===============================
INSERT INTO water_bills (account_id, bill_year, bill_month, litres_consumed, amount, status, due_date)
SELECT
  account_id,
  bill_year,
  bill_month,
  litres_consumed,
  ROUND(litres_consumed * 0.02, 2),
  'Unpaid',
  DATE_ADD(CURDATE(), INTERVAL 10 DAY)
FROM water_usage;

-- ===============================
-- COMPLAINTS (200)
-- ===============================
INSERT INTO complaints (citizen_id, category, description, status, priority)
SELECT
  (n % 300) + 1,
  ELT((n % 5) + 1, 'Water','Electricity','Garbage','Road','Street Light'),
  CONCAT('Auto generated complaint #', n),
  ELT((n % 3) + 1, 'Open','In Progress','Resolved'),
  ELT((n % 3) + 1, 'Low','Medium','High')
FROM (
  WITH RECURSIVE seq AS (
    SELECT 1 n UNION ALL SELECT n+1 FROM seq WHERE n <= 200
  ) SELECT n FROM seq
) x;

-- ===============================
-- COMPLAINT UPDATES (200)
-- ===============================
INSERT INTO complaint_updates (complaint_id, update_time, remarks)
SELECT
  complaint_id,
  DATE_ADD(created_at, INTERVAL 1 DAY),
  'Auto system update'
FROM complaints;

SELECT SUM(TABLE_ROWS) AS total_rows
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'smart_city_management';
