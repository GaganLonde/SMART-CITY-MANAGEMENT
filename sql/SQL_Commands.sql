/***************************************************
 Smart City Services Management System - MySQL SQL
 18 tables: addresses, citizens, utility_accounts,
 electricity_usage, water_usage, electricity_bills,
 water_bills, payments, public_transport_routes,
 drivers, buses, emergency_services, emergency_requests,
 waste_collection_zones, trucks, waste_collection_logs,
 complaints, complaint_updates
 Charset: utf8mb4, Engine: InnoDB
***************************************************/
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables (drop child tables first)
DROP TABLE IF EXISTS complaint_updates;
DROP TABLE IF EXISTS complaints;
DROP TABLE IF EXISTS waste_collection_logs;
DROP TABLE IF EXISTS trucks;
DROP TABLE IF EXISTS waste_collection_zones;
DROP TABLE IF EXISTS emergency_requests;
DROP TABLE IF EXISTS emergency_services;
DROP TABLE IF EXISTS buses;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS public_transport_routes;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS water_bills;
DROP TABLE IF EXISTS electricity_bills;
DROP TABLE IF EXISTS water_usage;
DROP TABLE IF EXISTS electricity_usage;
DROP TABLE IF EXISTS utility_accounts;
DROP TABLE IF EXISTS citizens;
DROP TABLE IF EXISTS addresses;

SET FOREIGN_KEY_CHECKS = 1;

-- 1) addresses
CREATE TABLE addresses (
  address_id INT AUTO_INCREMENT PRIMARY KEY,
  street VARCHAR(200),
  area VARCHAR(150),
  city VARCHAR(100),
  state VARCHAR(100),
  zipcode VARCHAR(20),
  country VARCHAR(100) DEFAULT 'India',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 2) citizens
CREATE TABLE citizens (
  citizen_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  dob DATE NULL,
  gender ENUM('M','F','Other') DEFAULT 'Other',
  phone VARCHAR(30),
  email VARCHAR(150),
  address_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_citizen_address FOREIGN KEY (address_id) REFERENCES addresses(address_id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_citizen_address (address_id),
  INDEX idx_citizen_phone (phone)
) ENGINE=InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 3) utility_accounts
CREATE TABLE utility_accounts (
  account_id INT AUTO_INCREMENT PRIMARY KEY,
  citizen_id INT NOT NULL,
  electricity_account_no VARCHAR(50) UNIQUE,
  water_account_no VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ua_citizen FOREIGN KEY (citizen_id) REFERENCES citizens(citizen_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_ua_citizen (citizen_id)
) ENGINE=InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 4) electricity_usage
CREATE TABLE electricity_usage (
  usage_id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  usage_month YEAR NOT NULL, -- use YEAR to represent year; you may add month as separate field
  usage_month_number TINYINT UNSIGNED NOT NULL, -- 1..12
  units_consumed DECIMAL(10,2) NOT NULL DEFAULT 0,
  meter_reading_time DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_eu_account FOREIGN KEY (account_id) REFERENCES utility_accounts(account_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_eu_account (account_id),
  INDEX idx_eu_month (usage_month, usage_month_number)
) ENGINE=InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 5) water_usage
CREATE TABLE water_usage (
  usage_id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  usage_month YEAR NOT NULL,
  usage_month_number TINYINT UNSIGNED NOT NULL,
  litres_consumed DECIMAL(12,2) NOT NULL DEFAULT 0,
  recorded_at DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_wu_account FOREIGN KEY (account_id) REFERENCES utility_accounts(account_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_wu_account (account_id),
  INDEX idx_wu_month (usage_month, usage_month_number)
) ENGINE=InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 6) electricity_bills
CREATE TABLE electricity_bills (
  bill_id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  bill_year YEAR NOT NULL,
  bill_month TINYINT UNSIGNED NOT NULL,
  units_consumed DECIMAL(10,2) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  status ENUM('Unpaid','Paid','Partially Paid','Overdue') DEFAULT 'Unpaid',
  due_date DATE,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_eb_account
    FOREIGN KEY (account_id)
    REFERENCES utility_accounts(account_id)
    ON DELETE CASCADE,

  INDEX idx_eb_account (account_id),
  INDEX idx_eb_status (status),
  INDEX idx_eb_period (bill_year, bill_month)
) ENGINE=InnoDB;


-- 7) water_bills
CREATE TABLE water_bills (
  bill_id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  bill_year YEAR NOT NULL,
  bill_month TINYINT UNSIGNED NOT NULL,
  litres_consumed DECIMAL(10,2),
  amount DECIMAL(12,2),
  status ENUM('Unpaid','Paid','Overdue') DEFAULT 'Unpaid',
  due_date DATE,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES utility_accounts(account_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;


-- 8) payments
CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  bill_type ENUM('Electricity','Water') NOT NULL,
  bill_id INT NOT NULL, -- references either electricity_bills.bill_id or water_bills.bill_id depending on bill_type
  payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  amount_paid DECIMAL(12,2) NOT NULL,
  mode ENUM('Cash','NEFT','UPI','Cheque','Card','Online') DEFAULT 'Online',
  transaction_ref VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_pay_bill (bill_type, bill_id),
  INDEX idx_pay_date (payment_date)
) ENGINE=InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- NOTE: payments.bill_id is not a strict foreign key because it can refer to multiple bill tables. Enforce referential integrity via application or triggers if desired.

-- 9) public_transport_routes
CREATE TABLE public_transport_routes (
  route_id INT AUTO_INCREMENT PRIMARY KEY,
  route_name VARCHAR(200) NOT NULL,
  start_point VARCHAR(200),
  end_point VARCHAR(200),
  distance_km DECIMAL(7,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_route_name (route_name)
) ENGINE=InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 10) drivers
CREATE TABLE drivers (
  driver_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  license_no VARCHAR(100),
  phone VARCHAR(30),
  address VARCHAR(300),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_driver_license (license_no),
  INDEX idx_driver_phone (phone)
) ENGINE=InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 11) buses
CREATE TABLE buses (
  bus_id INT AUTO_INCREMENT PRIMARY KEY,
  route_id INT NOT NULL,
  registration_no VARCHAR(50) UNIQUE,
  capacity INT UNSIGNED DEFAULT 0,
  driver_id INT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_buses_route FOREIGN KEY (route_id) REFERENCES public_transport_routes(route_id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_buses_driver FOREIGN KEY (driver_id) REFERENCES drivers(driver_id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_buses_route (route_id),
  INDEX idx_buses_driver (driver_id)
) ENGINE=InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 12) emergency_services
CREATE TABLE emergency_services (
  service_id INT AUTO_INCREMENT PRIMARY KEY,
  service_type VARCHAR(100) NOT NULL, -- e.g., Police, Fire, Ambulance
  phone VARCHAR(50),
  area_covered VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_es_type (service_type)
) ENGINE=InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 13) emergency_requests
CREATE TABLE emergency_requests (
  req_id INT AUTO_INCREMENT PRIMARY KEY,
  citizen_id INT,
  service_id INT NOT NULL,
  request_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  incident_datetime DATETIME,
  location VARCHAR(300),
  status ENUM('Open','Dispatched','Resolved','Cancelled') DEFAULT 'Open',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_er_citizen FOREIGN KEY (citizen_id) REFERENCES citizens(citizen_id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_er_service FOREIGN KEY (service_id) REFERENCES emergency_services(service_id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_er_service (service_id),
  INDEX idx_er_status (status)
) ENGINE=InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 14) waste_collection_zones
CREATE TABLE waste_collection_zones (
  zone_id INT AUTO_INCREMENT PRIMARY KEY,
  zone_name VARCHAR(150) NOT NULL,
  area_description VARCHAR(300),
  schedule JSON DEFAULT NULL, -- e.g., {"Mon":"7:00","Thu":"7:00"}
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_zone_name (zone_name)
) ENGINE=InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 15) trucks
CREATE TABLE trucks (
  truck_id INT AUTO_INCREMENT PRIMARY KEY,
  registration_no VARCHAR(50) UNIQUE,
  driver_id INT,
  capacity_kg INT UNSIGNED,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_trucks_driver FOREIGN KEY (driver_id) REFERENCES drivers(driver_id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_truck_driver (driver_id)
) ENGINE=InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 16) waste_collection_logs
CREATE TABLE waste_collection_logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  zone_id INT NOT NULL,
  truck_id INT,
  collection_date DATE NOT NULL,
  status ENUM('Scheduled','Completed','Missed') DEFAULT 'Scheduled',
  notes VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_wcl_zone FOREIGN KEY (zone_id) REFERENCES waste_collection_zones(zone_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_wcl_truck FOREIGN KEY (truck_id) REFERENCES trucks(truck_id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_wcl_zone_date (zone_id, collection_date),
  INDEX idx_wcl_truck (truck_id)
) ENGINE=InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 17) complaints
CREATE TABLE complaints (
  complaint_id INT AUTO_INCREMENT PRIMARY KEY,
  citizen_id INT,
  category VARCHAR(150),
  description TEXT,
  date_reported TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- ✅ FIXED
  status ENUM('Open','In Progress','Resolved','Rejected') DEFAULT 'Open',
  assigned_to VARCHAR(150),
  priority ENUM('Low','Medium','High') DEFAULT 'Medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_comp_citizen 
    FOREIGN KEY (citizen_id) REFERENCES citizens(citizen_id)
    ON DELETE SET NULL 
    ON UPDATE CASCADE,

  INDEX idx_comp_citizen (citizen_id),
  INDEX idx_comp_status (status)
) ENGINE=InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


-- 18) complaint_updates
CREATE TABLE complaint_updates (
  update_id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id INT NOT NULL,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(150),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cu_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_cu_complaint (complaint_id)
) ENGINE=InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


----------------------------------------------------
-- Sample data (small set) - adapt/extend to 1000+ later
----------------------------------------------------

-- addresses
INSERT INTO addresses (street, area, city, state, zipcode)
VALUES
('MG Road','Central','Pune','Maharashtra','411001'),
('Station Road','North','Mumbai','Maharashtra','400001'),
('Township Rd','East','Bengaluru','Karnataka','560001');

-- citizens
INSERT INTO citizens (name, dob, gender, phone, email, address_id)
VALUES
('Ramesh Patil','1980-07-12','M','9876543210','ramesh.patil@example.com',1),
('Sita Sharma','1990-03-05','F','9123456780','sita.sharma@example.com',2),
('Amit Kumar','1985-11-20','M','9988776655','amit.kumar@example.com',3);

-- utility_accounts
INSERT INTO utility_accounts (citizen_id, electricity_account_no, water_account_no)
VALUES
(1,'ELEC-PUN-0001','WATR-PUN-0001'),
(2,'ELEC-MUM-0002','WATR-MUM-0002'),
(3,'ELEC-BGL-0003','WATR-BGL-0003');

-- electricity_usage (sample months)
INSERT INTO electricity_usage (account_id, usage_month, usage_month_number, units_consumed, meter_reading_time)
VALUES
(1,2025,1,220.50,'2025-01-31 09:00:00'),
(1,2025,2,210.00,'2025-02-28 09:10:00'),
(2,2025,1,310.75,'2025-01-31 10:00:00'),
(3,2025,1,180.00,'2025-01-30 08:30:00');

-- water_usage
INSERT INTO water_usage (account_id, usage_month, usage_month_number, litres_consumed, recorded_at)
VALUES
(1,2025,1,12000.00,'2025-01-31 09:05:00'),
(2,2025,1,20000.00,'2025-01-31 10:10:00'),
(3,2025,1,8000.00,'2025-01-30 08:35:00');

-- electricity_bills
INSERT INTO electricity_bills (account_id, bill_year, bill_month, units_consumed, amount, status, due_date)
VALUES
(1,2025,1,220.50,1100.00,'Unpaid','2025-02-15'),
(1,2025,2,210.00,1050.00,'Unpaid','2025-03-15'),
(2,2025,1,310.75,1553.75,'Unpaid','2025-02-15'),
(3,2025,1,180.00,900.00,'Paid','2025-02-15');

-- water_bills
INSERT INTO water_bills (account_id, bill_year, bill_month, litres_consumed, amount, status, due_date)
VALUES
(1,2025,1,12000.00,240.00,'Paid','2025-02-10'),
(2,2025,1,20000.00,400.00,'Unpaid','2025-02-10'),
(3,2025,1,8000.00,160.00,'Paid','2025-02-10');

-- payments (note: bill_type + bill_id points to correct table via application logic)
INSERT INTO payments (bill_type, bill_id, payment_date, amount_paid, mode, transaction_ref)
VALUES
('Electricity',4,'2025-02-05 11:00:00',900.00,'Online','TXN-E-0004'),
('Water',1,'2025-01-25 10:00:00',240.00,'UPI','TXN-W-0001');

-- public_transport_routes
INSERT INTO public_transport_routes (route_name, start_point, end_point, distance_km)
VALUES
('Route-1: Central - East','Central Station','East Terminal',12.5),
('Route-2: North - South','North Hub','South Hub',18.0);

-- drivers
INSERT INTO drivers (name, license_no, phone, address)
VALUES
('Rajesh Singh','DL-PUN-12345','9870001111','MG Road, Pune'),
('Sunita Sharma','DL-MUM-54321','9870002222','Station Road, Mumbai');

-- buses
INSERT INTO buses (route_id, registration_no, capacity, driver_id)
VALUES
(1,'PN-01-BUS-001',40,1),
(2,'MH-02-BUS-010',50,2);

-- emergency_services
INSERT INTO emergency_services (service_type, phone, area_covered)
VALUES
('Police','100','Citywide'),
('Fire','101','Citywide'),
('Ambulance','102','Citywide');

-- emergency_requests
INSERT INTO emergency_requests (citizen_id, service_id, request_datetime, incident_datetime, location, status, notes)
VALUES
(1,1,'2025-01-20 08:30:00','2025-01-20 08:15:00','MG Road, Pune','Dispatched','Vehicle accident'),
(2,3,'2025-01-30 22:05:00','2025-01-30 22:00:00','Station Road, Mumbai','Resolved','Medical emergency');

-- waste_collection_zones
INSERT INTO waste_collection_zones (zone_name, area_description, schedule)
VALUES
('Zone-A','Central business district','{\"Mon\":\"07:00\",\"Thu\":\"07:00\"}'),
('Zone-B','North residential','{\"Tue\":\"07:00\",\"Fri\":\"07:00\"}');

-- trucks
INSERT INTO trucks (registration_no, driver_id, capacity_kg)
VALUES
('TRK-PUN-001',1,5000),
('TRK-MUM-010',2,7000);

-- waste_collection_logs
INSERT INTO waste_collection_logs (zone_id, truck_id, collection_date, status, notes)
VALUES
(1,1,'2025-01-20','Completed','All bins emptied'),
(2,2,'2025-01-21','Missed','Traffic delay');

-- complaints
INSERT INTO complaints (citizen_id, category, description, date_reported, status, assigned_to, priority)
VALUES
(1,'Street Light','Street light not working on MG Road','2025-01-10','Open','Electric Dept','Medium'),
(2,'Garbage','Garbage not collected in front of home','2025-01-11','In Progress','Waste Dept','High');

-- complaint_updates
INSERT INTO complaint_updates (complaint_id, update_time, updated_by, comment)
VALUES
(1,'2025-01-12 09:00:00','Electric Dept','Technician assigned'),
(2,'2025-01-12 10:00:00','Waste Dept','Truck scheduled for pickup');

----------------------------------------------------
-- Example useful views (optional)
----------------------------------------------------
CREATE OR REPLACE VIEW vw_citizen_accounts AS
SELECT c.citizen_id, c.name, c.phone, a.address_id, a.street, ua.account_id, ua.electricity_account_no, ua.water_account_no
FROM citizens c
LEFT JOIN addresses a ON c.address_id = a.address_id
LEFT JOIN utility_accounts ua ON c.citizen_id = ua.citizen_id;

-- Example view for unpaid bills (both electricity and water combined)
CREATE OR REPLACE VIEW vw_unpaid_bills AS
SELECT 'Electricity' AS bill_type, eb.bill_id AS bill_id, eb.account_id, eb.bill_year, eb.bill_month, eb.amount, eb.due_date
FROM electricity_bills eb WHERE eb.status <> 'Paid'
UNION ALL
SELECT 'Water' AS bill_type, wb.bill_id AS bill_id, wb.account_id, wb.bill_year, wb.bill_month, wb.amount, wb.due_date
FROM water_bills wb WHERE wb.status <> 'Paid';

----------------------------------------------------
-- Notes & next steps:
-- 1) payments references bill_id for both electricity and water bills via bill_type; you can
--    enforce referential integrity with triggers if you want strict cross-table FK checks.
-- 2) Add triggers:
--    - to auto-create electricity_bills from electricity_usage,
--    - to update bill status after payments insertion,
--    - to auto-create notifications on complaint insert.
-- 3) To produce 1000+ test rows use a small Python script with Faker or MySQL INSERT .. SELECT
--    against a numbers table to bulk-generate data quickly.