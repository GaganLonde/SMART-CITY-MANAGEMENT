"""
CRUD operations for all tables
"""
from app.database import db
from typing import List, Optional, Dict, Union
import json

# ==================== ADDRESSES ====================
def create_address(data: dict):
    query = """
        INSERT INTO addresses (street, area, city, state, zipcode, country)
        VALUES (%(street)s, %(area)s, %(city)s, %(state)s, %(zipcode)s, %(country)s)
    """
    address_id = db.execute_insert(query, data)
    return get_address(address_id)

def get_address(address_id: int):
    query = "SELECT * FROM addresses WHERE address_id = %s"
    return db.execute_one(query, (address_id,))

def get_all_addresses(skip: int = 0, limit: int = 100):
    query = "SELECT * FROM addresses LIMIT %s OFFSET %s"
    return db.execute_query(query, (limit, skip))

def update_address(address_id: int, data: dict):
    fields = []
    params = {}
    for key, value in data.items():
        if value is not None:
            fields.append(f"{key} = %({key})s")
            params[key] = value
    
    if not fields:
        return get_address(address_id)
    
    params['address_id'] = address_id
    query = f"UPDATE addresses SET {', '.join(fields)} WHERE address_id = %(address_id)s"
    db.execute_query(query, params, fetch=False)
    return get_address(address_id)

def delete_address(address_id: int):
    query = "DELETE FROM addresses WHERE address_id = %s"
    db.execute_query(query, (address_id,), fetch=False)
    return {"message": "Address deleted successfully"}

# ==================== CITIZENS ====================
def create_citizen(data: dict):
    query = """
        INSERT INTO citizens (name, dob, gender, phone, email, address_id)
        VALUES (%(name)s, %(dob)s, %(gender)s, %(phone)s, %(email)s, %(address_id)s)
    """
    citizen_id = db.execute_insert(query, data)
    return get_citizen(citizen_id)

def get_citizen(identifier: Union[int, str]):
    if isinstance(identifier, str) and not identifier.isdigit():
        # If it's a string and not a digit, search by name (exact match)
        query = "SELECT * FROM citizens WHERE name = %s"
        return db.execute_one(query, (identifier,))
    else:
        # If it's an int or a string that represents a digit, search by ID
        citizen_id = int(identifier)
        query = "SELECT * FROM citizens WHERE citizen_id = %s"
        return db.execute_one(query, (citizen_id,))

def get_all_citizens(skip: int = 0, limit: int = 100, name: Optional[str] = None):
    if name:
        query = "SELECT * FROM citizens WHERE name LIKE %s LIMIT %s OFFSET %s"
        search_pattern = f"%{name}%"
        return db.execute_query(query, (search_pattern, limit, skip))
    else:
        query = "SELECT * FROM citizens LIMIT %s OFFSET %s"
        return db.execute_query(query, (limit, skip))

def update_citizen(citizen_id: int, data: dict):
    fields = []
    params = {}
    for key, value in data.items():
        if value is not None:
            fields.append(f"{key} = %({key})s")
            params[key] = value
    
    if not fields:
        return get_citizen(citizen_id)
    
    params['citizen_id'] = citizen_id
    query = f"UPDATE citizens SET {', '.join(fields)} WHERE citizen_id = %(citizen_id)s"
    db.execute_query(query, params, fetch=False)
    return get_citizen(citizen_id)

def delete_citizen(citizen_id: int):
    query = "DELETE FROM citizens WHERE citizen_id = %s"
    db.execute_query(query, (citizen_id,), fetch=False)
    return {"message": "Citizen deleted successfully"}

# ==================== UTILITY ACCOUNTS ====================
def create_utility_account(data: dict):
    query = """
        INSERT INTO utility_accounts (citizen_id, electricity_account_no, water_account_no)
        VALUES (%(citizen_id)s, %(electricity_account_no)s, %(water_account_no)s)
    """
    account_id = db.execute_insert(query, data)
    return get_utility_account(account_id)

def get_utility_account(account_id: int):
    query = "SELECT * FROM utility_accounts WHERE account_id = %s"
    return db.execute_one(query, (account_id,))

def get_all_utility_accounts(skip: int = 0, limit: int = 100):
    query = "SELECT * FROM utility_accounts LIMIT %s OFFSET %s"
    return db.execute_query(query, (limit, skip))

def get_utility_accounts_by_citizen(citizen_id: int):
    query = "SELECT * FROM utility_accounts WHERE citizen_id = %s"
    return db.execute_query(query, (citizen_id,))

def update_utility_account(account_id: int, data: dict):
    fields = []
    params = {}
    for key, value in data.items():
        if value is not None:
            fields.append(f"{key} = %({key})s")
            params[key] = value
    
    if not fields:
        return get_utility_account(account_id)
    
    params['account_id'] = account_id
    query = f"UPDATE utility_accounts SET {', '.join(fields)} WHERE account_id = %(account_id)s"
    db.execute_query(query, params, fetch=False)
    return get_utility_account(account_id)

def delete_utility_account(account_id: int):
    query = "DELETE FROM utility_accounts WHERE account_id = %s"
    db.execute_query(query, (account_id,), fetch=False)
    return {"message": "Utility account deleted successfully"}

# ==================== ELECTRICITY USAGE ====================
def create_electricity_usage(data: dict):
    query = """
        INSERT INTO electricity_usage (account_id, usage_month, usage_month_number, units_consumed, meter_reading_time)
        VALUES (%(account_id)s, %(usage_month)s, %(usage_month_number)s, %(units_consumed)s, %(meter_reading_time)s)
    """
    usage_id = db.execute_insert(query, data)
    return get_electricity_usage(usage_id)

def get_electricity_usage(usage_id: int):
    query = "SELECT * FROM electricity_usage WHERE usage_id = %s"
    return db.execute_one(query, (usage_id,))

def get_all_electricity_usage(skip: int = 0, limit: int = 100):
    query = "SELECT * FROM electricity_usage LIMIT %s OFFSET %s"
    return db.execute_query(query, (limit, skip))

def get_electricity_usage_by_account(account_id: int):
    query = "SELECT * FROM electricity_usage WHERE account_id = %s ORDER BY usage_month DESC, usage_month_number DESC"
    return db.execute_query(query, (account_id,))

def update_electricity_usage(usage_id: int, data: dict):
    fields = []
    params = {}
    for key, value in data.items():
        if value is not None:
            fields.append(f"{key} = %({key})s")
            params[key] = value
    
    if not fields:
        return get_electricity_usage(usage_id)
    
    params['usage_id'] = usage_id
    query = f"UPDATE electricity_usage SET {', '.join(fields)} WHERE usage_id = %(usage_id)s"
    db.execute_query(query, params, fetch=False)
    return get_electricity_usage(usage_id)

def delete_electricity_usage(usage_id: int):
    query = "DELETE FROM electricity_usage WHERE usage_id = %s"
    db.execute_query(query, (usage_id,), fetch=False)
    return {"message": "Electricity usage deleted successfully"}

# ==================== WATER USAGE ====================
def create_water_usage(data: dict):
    query = """
        INSERT INTO water_usage (account_id, usage_month, usage_month_number, litres_consumed, recorded_at)
        VALUES (%(account_id)s, %(usage_month)s, %(usage_month_number)s, %(litres_consumed)s, %(recorded_at)s)
    """
    usage_id = db.execute_insert(query, data)
    return get_water_usage(usage_id)

def get_water_usage(usage_id: int):
    query = "SELECT * FROM water_usage WHERE usage_id = %s"
    return db.execute_one(query, (usage_id,))

def get_all_water_usage(skip: int = 0, limit: int = 100):
    query = "SELECT * FROM water_usage LIMIT %s OFFSET %s"
    return db.execute_query(query, (limit, skip))

def get_water_usage_by_account(account_id: int):
    query = "SELECT * FROM water_usage WHERE account_id = %s ORDER BY usage_month DESC, usage_month_number DESC"
    return db.execute_query(query, (account_id,))

def update_water_usage(usage_id: int, data: dict):
    fields = []
    params = {}
    for key, value in data.items():
        if value is not None:
            fields.append(f"{key} = %({key})s")
            params[key] = value
    
    if not fields:
        return get_water_usage(usage_id)
    
    params['usage_id'] = usage_id
    query = f"UPDATE water_usage SET {', '.join(fields)} WHERE usage_id = %(usage_id)s"
    db.execute_query(query, params, fetch=False)
    return get_water_usage(usage_id)

def delete_water_usage(usage_id: int):
    query = "DELETE FROM water_usage WHERE usage_id = %s"
    db.execute_query(query, (usage_id,), fetch=False)
    return {"message": "Water usage deleted successfully"}

# ==================== ELECTRICITY BILLS ====================
def create_electricity_bill(data: dict):
    query = """
        INSERT INTO electricity_bills (account_id, bill_year, bill_month, units_consumed, amount, status, due_date)
        VALUES (%(account_id)s, %(bill_year)s, %(bill_month)s, %(units_consumed)s, %(amount)s, %(status)s, %(due_date)s)
    """
    bill_id = db.execute_insert(query, data)
    return get_electricity_bill(bill_id)

def get_electricity_bill(bill_id: int):
    query = "SELECT * FROM electricity_bills WHERE bill_id = %s"
    return db.execute_one(query, (bill_id,))

def get_all_electricity_bills(skip: int = 0, limit: int = 100):
    query = "SELECT * FROM electricity_bills LIMIT %s OFFSET %s"
    return db.execute_query(query, (limit, skip))

def get_electricity_bills_by_account(account_id: int):
    query = "SELECT * FROM electricity_bills WHERE account_id = %s ORDER BY bill_year DESC, bill_month DESC"
    return db.execute_query(query, (account_id,))

def update_electricity_bill(bill_id: int, data: dict):
    fields = []
    params = {}
    for key, value in data.items():
        if value is not None:
            fields.append(f"{key} = %({key})s")
            params[key] = value
    
    if not fields:
        return get_electricity_bill(bill_id)
    
    params['bill_id'] = bill_id
    query = f"UPDATE electricity_bills SET {', '.join(fields)} WHERE bill_id = %(bill_id)s"
    db.execute_query(query, params, fetch=False)
    return get_electricity_bill(bill_id)

def delete_electricity_bill(bill_id: int):
    query = "DELETE FROM electricity_bills WHERE bill_id = %s"
    db.execute_query(query, (bill_id,), fetch=False)
    return {"message": "Electricity bill deleted successfully"}

# ==================== WATER BILLS ====================
def create_water_bill(data: dict):
    query = """
        INSERT INTO water_bills (account_id, bill_year, bill_month, litres_consumed, amount, status, due_date)
        VALUES (%(account_id)s, %(bill_year)s, %(bill_month)s, %(litres_consumed)s, %(amount)s, %(status)s, %(due_date)s)
    """
    bill_id = db.execute_insert(query, data)
    return get_water_bill(bill_id)

def get_water_bill(bill_id: int):
    query = "SELECT * FROM water_bills WHERE bill_id = %s"
    return db.execute_one(query, (bill_id,))

def get_all_water_bills(skip: int = 0, limit: int = 100):
    query = "SELECT * FROM water_bills LIMIT %s OFFSET %s"
    return db.execute_query(query, (limit, skip))

def get_water_bills_by_account(account_id: int):
    query = "SELECT * FROM water_bills WHERE account_id = %s ORDER BY bill_year DESC, bill_month DESC"
    return db.execute_query(query, (account_id,))

def update_water_bill(bill_id: int, data: dict):
    fields = []
    params = {}
    for key, value in data.items():
        if value is not None:
            fields.append(f"{key} = %({key})s")
            params[key] = value
    
    if not fields:
        return get_water_bill(bill_id)
    
    params['bill_id'] = bill_id
    query = f"UPDATE water_bills SET {', '.join(fields)} WHERE bill_id = %(bill_id)s"
    db.execute_query(query, params, fetch=False)
    return get_water_bill(bill_id)

def delete_water_bill(bill_id: int):
    query = "DELETE FROM water_bills WHERE bill_id = %s"
    db.execute_query(query, (bill_id,), fetch=False)
    return {"message": "Water bill deleted successfully"}

# ==================== PAYMENTS ====================
def create_payment(data: dict):
    query = """
        INSERT INTO payments (bill_type, bill_id, payment_date, amount_paid, mode, transaction_ref)
        VALUES (%(bill_type)s, %(bill_id)s, %(payment_date)s, %(amount_paid)s, %(mode)s, %(transaction_ref)s)
    """
    payment_id = db.execute_insert(query, data)
    return get_payment(payment_id)

def get_payment(payment_id: int):
    query = "SELECT * FROM payments WHERE payment_id = %s"
    return db.execute_one(query, (payment_id,))

def get_all_payments(skip: int = 0, limit: int = 100):
    query = "SELECT * FROM payments LIMIT %s OFFSET %s"
    return db.execute_query(query, (limit, skip))

def get_payments_by_bill(bill_type: str, bill_id: int):
    query = "SELECT * FROM payments WHERE bill_type = %s AND bill_id = %s"
    return db.execute_query(query, (bill_type, bill_id))

def update_payment(payment_id: int, data: dict):
    fields = []
    params = {}
    for key, value in data.items():
        if value is not None:
            fields.append(f"{key} = %({key})s")
            params[key] = value
    
    if not fields:
        return get_payment(payment_id)
    
    params['payment_id'] = payment_id
    query = f"UPDATE payments SET {', '.join(fields)} WHERE payment_id = %(payment_id)s"
    db.execute_query(query, params, fetch=False)
    return get_payment(payment_id)

def delete_payment(payment_id: int):
    query = "DELETE FROM payments WHERE payment_id = %s"
    db.execute_query(query, (payment_id,), fetch=False)
    return {"message": "Payment deleted successfully"}

# ==================== PUBLIC TRANSPORT ROUTES ====================
def create_route(data: dict):
    query = """
        INSERT INTO public_transport_routes (route_name, start_point, end_point, distance_km)
        VALUES (%(route_name)s, %(start_point)s, %(end_point)s, %(distance_km)s)
    """
    route_id = db.execute_insert(query, data)
    return get_route(route_id)

def get_route(route_id: int):
    query = "SELECT * FROM public_transport_routes WHERE route_id = %s"
    return db.execute_one(query, (route_id,))

def get_all_routes(skip: int = 0, limit: int = 100):
    query = "SELECT * FROM public_transport_routes LIMIT %s OFFSET %s"
    return db.execute_query(query, (limit, skip))

def update_route(route_id: int, data: dict):
    fields = []
    params = {}
    for key, value in data.items():
        if value is not None:
            fields.append(f"{key} = %({key})s")
            params[key] = value
    
    if not fields:
        return get_route(route_id)
    
    params['route_id'] = route_id
    query = f"UPDATE public_transport_routes SET {', '.join(fields)} WHERE route_id = %(route_id)s"
    db.execute_query(query, params, fetch=False)
    return get_route(route_id)

def delete_route(route_id: int):
    query = "DELETE FROM public_transport_routes WHERE route_id = %s"
    db.execute_query(query, (route_id,), fetch=False)
    return {"message": "Route deleted successfully"}

# ==================== DRIVERS ====================
def create_driver(data: dict):
    query = """
        INSERT INTO drivers (name, license_no, phone, address)
        VALUES (%(name)s, %(license_no)s, %(phone)s, %(address)s)
    """
    driver_id = db.execute_insert(query, data)
    return get_driver(driver_id)

def get_driver(driver_id: int):
    query = "SELECT * FROM drivers WHERE driver_id = %s"
    return db.execute_one(query, (driver_id,))

def get_all_drivers(skip: int = 0, limit: int = 100):
    query = "SELECT * FROM drivers LIMIT %s OFFSET %s"
    return db.execute_query(query, (limit, skip))

def update_driver(driver_id: int, data: dict):
    fields = []
    params = {}
    for key, value in data.items():
        if value is not None:
            fields.append(f"{key} = %({key})s")
            params[key] = value
    
    if not fields:
        return get_driver(driver_id)
    
    params['driver_id'] = driver_id
    query = f"UPDATE drivers SET {', '.join(fields)} WHERE driver_id = %(driver_id)s"
    db.execute_query(query, params, fetch=False)
    return get_driver(driver_id)

def delete_driver(driver_id: int):
    query = "DELETE FROM drivers WHERE driver_id = %s"
    db.execute_query(query, (driver_id,), fetch=False)
    return {"message": "Driver deleted successfully"}

# ==================== BUSES ====================
def create_bus(data: dict):
    query = """
        INSERT INTO buses (route_id, registration_no, capacity, driver_id, active)
        VALUES (%(route_id)s, %(registration_no)s, %(capacity)s, %(driver_id)s, %(active)s)
    """
    bus_id = db.execute_insert(query, data)
    return get_bus(bus_id)

def get_bus(bus_id: int):
    query = "SELECT * FROM buses WHERE bus_id = %s"
    return db.execute_one(query, (bus_id,))

def get_all_buses(skip: int = 0, limit: int = 100):
    query = "SELECT * FROM buses LIMIT %s OFFSET %s"
    return db.execute_query(query, (limit, skip))

def get_buses_by_route(route_id: int):
    query = "SELECT * FROM buses WHERE route_id = %s"
    return db.execute_query(query, (route_id,))

def update_bus(bus_id: int, data: dict):
    fields = []
    params = {}
    for key, value in data.items():
        if value is not None:
            fields.append(f"{key} = %({key})s")
            params[key] = value
    
    if not fields:
        return get_bus(bus_id)
    
    params['bus_id'] = bus_id
    query = f"UPDATE buses SET {', '.join(fields)} WHERE bus_id = %(bus_id)s"
    db.execute_query(query, params, fetch=False)
    return get_bus(bus_id)

def delete_bus(bus_id: int):
    query = "DELETE FROM buses WHERE bus_id = %s"
    db.execute_query(query, (bus_id,), fetch=False)
    return {"message": "Bus deleted successfully"}

# ==================== EMERGENCY SERVICES ====================
def create_emergency_service(data: dict):
    query = """
        INSERT INTO emergency_services (service_type, phone, area_covered)
        VALUES (%(service_type)s, %(phone)s, %(area_covered)s)
    """
    service_id = db.execute_insert(query, data)
    return get_emergency_service(service_id)

def get_emergency_service(service_id: int):
    query = "SELECT * FROM emergency_services WHERE service_id = %s"
    return db.execute_one(query, (service_id,))

def get_all_emergency_services(skip: int = 0, limit: int = 100):
    query = "SELECT * FROM emergency_services LIMIT %s OFFSET %s"
    return db.execute_query(query, (limit, skip))

def update_emergency_service(service_id: int, data: dict):
    fields = []
    params = {}
    for key, value in data.items():
        if value is not None:
            fields.append(f"{key} = %({key})s")
            params[key] = value
    
    if not fields:
        return get_emergency_service(service_id)
    
    params['service_id'] = service_id
    query = f"UPDATE emergency_services SET {', '.join(fields)} WHERE service_id = %(service_id)s"
    db.execute_query(query, params, fetch=False)
    return get_emergency_service(service_id)

def delete_emergency_service(service_id: int):
    query = "DELETE FROM emergency_services WHERE service_id = %s"
    db.execute_query(query, (service_id,), fetch=False)
    return {"message": "Emergency service deleted successfully"}

# ==================== EMERGENCY REQUESTS ====================
def create_emergency_request(data: dict):
    query = """
        INSERT INTO emergency_requests (citizen_id, service_id, request_datetime, incident_datetime, location, status, notes)
        VALUES (%(citizen_id)s, %(service_id)s, %(request_datetime)s, %(incident_datetime)s, %(location)s, %(status)s, %(notes)s)
    """
    req_id = db.execute_insert(query, data)
    return get_emergency_request(req_id)

def get_emergency_request(req_id: int):
    query = "SELECT * FROM emergency_requests WHERE req_id = %s"
    return db.execute_one(query, (req_id,))

def get_all_emergency_requests(skip: int = 0, limit: int = 100):
    query = "SELECT * FROM emergency_requests LIMIT %s OFFSET %s"
    return db.execute_query(query, (limit, skip))

def get_emergency_requests_by_status(status: str):
    query = "SELECT * FROM emergency_requests WHERE status = %s"
    return db.execute_query(query, (status,))

def update_emergency_request(req_id: int, data: dict):
    fields = []
    params = {}
    for key, value in data.items():
        if value is not None:
            fields.append(f"{key} = %({key})s")
            params[key] = value
    
    if not fields:
        return get_emergency_request(req_id)
    
    params['req_id'] = req_id
    query = f"UPDATE emergency_requests SET {', '.join(fields)} WHERE req_id = %(req_id)s"
    db.execute_query(query, params, fetch=False)
    return get_emergency_request(req_id)

def delete_emergency_request(req_id: int):
    query = "DELETE FROM emergency_requests WHERE req_id = %s"
    db.execute_query(query, (req_id,), fetch=False)
    return {"message": "Emergency request deleted successfully"}

# ==================== WASTE COLLECTION ZONES ====================
def create_waste_collection_zone(data: dict):
    schedule = data.get('schedule')
    if schedule and isinstance(schedule, dict):
        schedule = json.dumps(schedule)
    
    query = """
        INSERT INTO waste_collection_zones (zone_name, area_description, schedule)
        VALUES (%(zone_name)s, %(area_description)s, %(schedule)s)
    """
    data['schedule'] = schedule
    zone_id = db.execute_insert(query, data)
    return get_waste_collection_zone(zone_id)

def get_waste_collection_zone(zone_id: int):
    query = "SELECT * FROM waste_collection_zones WHERE zone_id = %s"
    result = db.execute_one(query, (zone_id,))
    if result and result.get('schedule'):
        try:
            result['schedule'] = json.loads(result['schedule'])
        except:
            pass
    return result

def get_all_waste_collection_zones(skip: int = 0, limit: int = 100):
    query = "SELECT * FROM waste_collection_zones LIMIT %s OFFSET %s"
    results = db.execute_query(query, (limit, skip))
    for result in results:
        if result.get('schedule'):
            try:
                result['schedule'] = json.loads(result['schedule'])
            except:
                pass
    return results

def update_waste_collection_zone(zone_id: int, data: dict):
    schedule = data.get('schedule')
    if schedule and isinstance(schedule, dict):
        data['schedule'] = json.dumps(schedule)
    
    fields = []
    params = {}
    for key, value in data.items():
        if value is not None:
            fields.append(f"{key} = %({key})s")
            params[key] = value
    
    if not fields:
        return get_waste_collection_zone(zone_id)
    
    params['zone_id'] = zone_id
    query = f"UPDATE waste_collection_zones SET {', '.join(fields)} WHERE zone_id = %(zone_id)s"
    db.execute_query(query, params, fetch=False)
    return get_waste_collection_zone(zone_id)

def delete_waste_collection_zone(zone_id: int):
    query = "DELETE FROM waste_collection_zones WHERE zone_id = %s"
    db.execute_query(query, (zone_id,), fetch=False)
    return {"message": "Waste collection zone deleted successfully"}

# ==================== TRUCKS ====================
def create_truck(data: dict):
    query = """
        INSERT INTO trucks (registration_no, driver_id, capacity_kg, active)
        VALUES (%(registration_no)s, %(driver_id)s, %(capacity_kg)s, %(active)s)
    """
    truck_id = db.execute_insert(query, data)
    return get_truck(truck_id)

def get_truck(truck_id: int):
    query = "SELECT * FROM trucks WHERE truck_id = %s"
    return db.execute_one(query, (truck_id,))

def get_all_trucks(skip: int = 0, limit: int = 100):
    query = "SELECT * FROM trucks LIMIT %s OFFSET %s"
    return db.execute_query(query, (limit, skip))

def update_truck(truck_id: int, data: dict):
    fields = []
    params = {}
    for key, value in data.items():
        if value is not None:
            fields.append(f"{key} = %({key})s")
            params[key] = value
    
    if not fields:
        return get_truck(truck_id)
    
    params['truck_id'] = truck_id
    query = f"UPDATE trucks SET {', '.join(fields)} WHERE truck_id = %(truck_id)s"
    db.execute_query(query, params, fetch=False)
    return get_truck(truck_id)

def delete_truck(truck_id: int):
    query = "DELETE FROM trucks WHERE truck_id = %s"
    db.execute_query(query, (truck_id,), fetch=False)
    return {"message": "Truck deleted successfully"}

# ==================== WASTE COLLECTION LOGS ====================
def create_waste_collection_log(data: dict):
    query = """
        INSERT INTO waste_collection_logs (zone_id, truck_id, collection_date, status, notes)
        VALUES (%(zone_id)s, %(truck_id)s, %(collection_date)s, %(status)s, %(notes)s)
    """
    log_id = db.execute_insert(query, data)
    return get_waste_collection_log(log_id)

def get_waste_collection_log(log_id: int):
    query = "SELECT * FROM waste_collection_logs WHERE log_id = %s"
    return db.execute_one(query, (log_id,))

def get_all_waste_collection_logs(skip: int = 0, limit: int = 100):
    query = "SELECT * FROM waste_collection_logs LIMIT %s OFFSET %s"
    return db.execute_query(query, (limit, skip))

def get_waste_collection_logs_by_zone(zone_id: int):
    query = "SELECT * FROM waste_collection_logs WHERE zone_id = %s ORDER BY collection_date DESC"
    return db.execute_query(query, (zone_id,))

def update_waste_collection_log(log_id: int, data: dict):
    fields = []
    params = {}
    for key, value in data.items():
        if value is not None:
            fields.append(f"{key} = %({key})s")
            params[key] = value
    
    if not fields:
        return get_waste_collection_log(log_id)
    
    params['log_id'] = log_id
    query = f"UPDATE waste_collection_logs SET {', '.join(fields)} WHERE log_id = %(log_id)s"
    db.execute_query(query, params, fetch=False)
    return get_waste_collection_log(log_id)

def delete_waste_collection_log(log_id: int):
    query = "DELETE FROM waste_collection_logs WHERE log_id = %s"
    db.execute_query(query, (log_id,), fetch=False)
    return {"message": "Waste collection log deleted successfully"}

# ==================== COMPLAINTS ====================
def create_complaint(data: dict):
    query = """
        INSERT INTO complaints (citizen_id, category, description, date_reported, status, assigned_to, priority)
        VALUES (%(citizen_id)s, %(category)s, %(description)s, %(date_reported)s, %(status)s, %(assigned_to)s, %(priority)s)
    """
    complaint_id = db.execute_insert(query, data)
    return get_complaint(complaint_id)

def get_complaint(complaint_id: int):
    query = "SELECT * FROM complaints WHERE complaint_id = %s"
    return db.execute_one(query, (complaint_id,))

def get_all_complaints(skip: int = 0, limit: int = 100):
    query = "SELECT * FROM complaints LIMIT %s OFFSET %s"
    return db.execute_query(query, (limit, skip))

def get_complaints_by_status(status: str):
    query = "SELECT * FROM complaints WHERE status = %s"
    return db.execute_query(query, (status,))

def get_complaints_by_citizen(citizen_id: int):
    query = "SELECT * FROM complaints WHERE citizen_id = %s ORDER BY date_reported DESC"
    return db.execute_query(query, (citizen_id,))

def update_complaint(complaint_id: int, data: dict):
    fields = []
    params = {}
    for key, value in data.items():
        if value is not None:
            fields.append(f"{key} = %({key})s")
            params[key] = value
    
    if not fields:
        return get_complaint(complaint_id)
    
    params['complaint_id'] = complaint_id
    query = f"UPDATE complaints SET {', '.join(fields)} WHERE complaint_id = %(complaint_id)s"
    db.execute_query(query, params, fetch=False)
    return get_complaint(complaint_id)

def delete_complaint(complaint_id: int):
    query = "DELETE FROM complaints WHERE complaint_id = %s"
    db.execute_query(query, (complaint_id,), fetch=False)
    return {"message": "Complaint deleted successfully"}

# ==================== COMPLAINT UPDATES ====================
def create_complaint_update(data: dict):
    query = """
        INSERT INTO complaint_updates (complaint_id, update_time, updated_by, comment)
        VALUES (%(complaint_id)s, %(update_time)s, %(updated_by)s, %(comment)s)
    """
    update_id = db.execute_insert(query, data)
    return get_complaint_update(update_id)

def get_complaint_update(update_id: int):
    query = "SELECT * FROM complaint_updates WHERE update_id = %s"
    return db.execute_one(query, (update_id,))

def get_all_complaint_updates(skip: int = 0, limit: int = 100):
    query = "SELECT * FROM complaint_updates LIMIT %s OFFSET %s"
    return db.execute_query(query, (limit, skip))

def get_complaint_updates_by_complaint(complaint_id: int):
    query = "SELECT * FROM complaint_updates WHERE complaint_id = %s ORDER BY update_time DESC"
    return db.execute_query(query, (complaint_id,))

def update_complaint_update(update_id: int, data: dict):
    fields = []
    params = {}
    for key, value in data.items():
        if value is not None:
            fields.append(f"{key} = %({key})s")
            params[key] = value
    
    if not fields:
        return get_complaint_update(update_id)
    
    params['update_id'] = update_id
    query = f"UPDATE complaint_updates SET {', '.join(fields)} WHERE update_id = %(update_id)s"
    db.execute_query(query, params, fetch=False)
    return get_complaint_update(update_id)

def delete_complaint_update(update_id: int):
    query = "DELETE FROM complaint_updates WHERE update_id = %s"
    db.execute_query(query, (update_id,), fetch=False)
    return {"message": "Complaint update deleted successfully"}

# ==================== DASHBOARD STATS ====================
def get_dashboard_stats():
    """Get aggregated statistics for dashboard"""
    stats = {}
    
    # Total citizens
    result = db.execute_one("SELECT COUNT(*) as count FROM citizens")
    stats['total_citizens'] = result['count'] if result else 0
    
    # Total utility accounts
    result = db.execute_one("SELECT COUNT(*) as count FROM utility_accounts")
    stats['total_utility_accounts'] = result['count'] if result else 0
    
    # Electricity usage (current month)
    year_result = db.execute_one("SELECT YEAR(CURRENT_DATE) as year")
    month_result = db.execute_one("SELECT MONTH(CURRENT_DATE) as month")
    current_year = year_result['year'] if year_result else 2025
    current_month = month_result['month'] if month_result else 1
    
    elec_usage = db.execute_one(
        "SELECT COALESCE(SUM(units_consumed), 0) as total FROM electricity_usage WHERE usage_month = %s AND usage_month_number = %s",
        (current_year, current_month)
    )
    stats['electricity_usage_kwh'] = float(elec_usage['total']) if elec_usage and elec_usage.get('total') is not None else 0
    
    # Water usage (current month)
    water_usage = db.execute_one(
        "SELECT COALESCE(SUM(litres_consumed), 0) as total FROM water_usage WHERE usage_month = %s AND usage_month_number = %s",
        (current_year, current_month)
    )
    stats['water_usage_litres'] = float(water_usage['total']) if water_usage and water_usage.get('total') is not None else 0
    
    # Active buses
    result = db.execute_one("SELECT COUNT(*) as count FROM buses WHERE active = TRUE")
    stats['active_buses'] = result['count'] if result else 0
    
    # Emergency requests by status
    result = db.execute_one("SELECT COUNT(*) as count FROM emergency_requests WHERE status = 'Open'")
    stats['emergency_open'] = result['count'] if result else 0
    result = db.execute_one("SELECT COUNT(*) as count FROM emergency_requests WHERE status = 'Dispatched'")
    stats['emergency_dispatched'] = result['count'] if result else 0
    result = db.execute_one("SELECT COUNT(*) as count FROM emergency_requests WHERE status = 'Resolved'")
    stats['emergency_resolved'] = result['count'] if result else 0
    
    # Complaints by status
    result = db.execute_one("SELECT COUNT(*) as count FROM complaints WHERE status = 'Open'")
    stats['complaints_open'] = result['count'] if result else 0
    result = db.execute_one("SELECT COUNT(*) as count FROM complaints WHERE status = 'In Progress'")
    stats['complaints_in_progress'] = result['count'] if result else 0
    result = db.execute_one("SELECT COUNT(*) as count FROM complaints WHERE status = 'Resolved'")
    stats['complaints_resolved'] = result['count'] if result else 0
    
    # Waste collection stats
    result = db.execute_one("SELECT COUNT(*) as count FROM waste_collection_zones")
    stats['waste_zones'] = result['count'] if result else 0
    result = db.execute_one("SELECT COUNT(*) as count FROM trucks WHERE active = TRUE")
    stats['active_trucks'] = result['count'] if result else 0
    
    # Revenue (sum of paid bills)
    elec_revenue = db.execute_one(
        "SELECT COALESCE(SUM(amount), 0) as total FROM electricity_bills WHERE status = 'Paid'"
    )
    water_revenue = db.execute_one(
        "SELECT COALESCE(SUM(amount), 0) as total FROM water_bills WHERE status = 'Paid'"
    )
    elec_total = float(elec_revenue['total']) if elec_revenue and elec_revenue.get('total') is not None else 0
    water_total = float(water_revenue['total']) if water_revenue and water_revenue.get('total') is not None else 0
    stats['total_revenue'] = elec_total + water_total
    
    # Pending bills
    result = db.execute_one(
        "SELECT COUNT(*) as count FROM (SELECT bill_id FROM electricity_bills WHERE status != 'Paid' UNION ALL SELECT bill_id FROM water_bills WHERE status != 'Paid') as t"
    )
    stats['pending_bills'] = result['count'] if result else 0
    
    # Recent emergency requests (last 5)
    stats['recent_emergencies'] = db.execute_query(
        "SELECT req_id, service_id, location, status, request_datetime, created_at FROM emergency_requests ORDER BY request_datetime DESC LIMIT 5"
    ) or []
    
    # Recent complaints (last 5)
    stats['recent_complaints'] = db.execute_query(
        "SELECT complaint_id, category, description, status, date_reported, created_at FROM complaints ORDER BY date_reported DESC LIMIT 5"
    ) or []
    
    return stats

