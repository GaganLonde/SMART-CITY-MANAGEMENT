from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from app import crud
from app.models import *

app = FastAPI(
    title="Smart City Management System API",
    description="REST API for managing smart city services",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== ADDRESSES ROUTES ====================
@app.post("/addresses", response_model=dict, tags=["Addresses"])
def create_address(address: AddressCreate):
    """Create a new address"""
    try:
        return crud.create_address(address.dict(exclude_none=True))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/addresses", response_model=List[dict], tags=["Addresses"])
def read_addresses(skip: int = 0, limit: int = 100):
    """Get all addresses"""
    return crud.get_all_addresses(skip, limit)

@app.get("/addresses/{address_id}", response_model=dict, tags=["Addresses"])
def read_address(address_id: int):
    """Get address by ID"""
    address = crud.get_address(address_id)
    if address is None:
        raise HTTPException(status_code=404, detail="Address not found")
    return address

@app.put("/addresses/{address_id}", response_model=dict, tags=["Addresses"])
def update_address(address_id: int, address: AddressUpdate):
    """Update an address"""
    try:
        result = crud.update_address(address_id, address.dict(exclude_none=True))
        if result is None:
            raise HTTPException(status_code=404, detail="Address not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/addresses/{address_id}", tags=["Addresses"])
def delete_address(address_id: int):
    """Delete an address"""
    try:
        return crud.delete_address(address_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== CITIZENS ROUTES ====================
@app.post("/citizens", response_model=dict, tags=["Citizens"])
def create_citizen(citizen: CitizenCreate):
    """Create a new citizen"""
    try:
        return crud.create_citizen(citizen.dict(exclude_none=True))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/citizens", response_model=List[dict], tags=["Citizens"])
def read_citizens(skip: int = 0, limit: int = 100):
    """Get all citizens"""
    return crud.get_all_citizens(skip, limit)

@app.get("/citizens/{citizen_id}", response_model=dict, tags=["Citizens"])
def read_citizen(citizen_id: int):
    """Get citizen by ID"""
    citizen = crud.get_citizen(citizen_id)
    if citizen is None:
        raise HTTPException(status_code=404, detail="Citizen not found")
    return citizen

@app.put("/citizens/{citizen_id}", response_model=dict, tags=["Citizens"])
def update_citizen(citizen_id: int, citizen: CitizenUpdate):
    """Update a citizen"""
    try:
        result = crud.update_citizen(citizen_id, citizen.dict(exclude_none=True))
        if result is None:
            raise HTTPException(status_code=404, detail="Citizen not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/citizens/{citizen_id}", tags=["Citizens"])
def delete_citizen(citizen_id: int):
    """Delete a citizen"""
    try:
        return crud.delete_citizen(citizen_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== UTILITY ACCOUNTS ROUTES ====================
@app.post("/utility-accounts", response_model=dict, tags=["Utility Accounts"])
def create_utility_account(account: UtilityAccountCreate):
    """Create a new utility account"""
    try:
        return crud.create_utility_account(account.dict(exclude_none=True))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/utility-accounts", response_model=List[dict], tags=["Utility Accounts"])
def read_utility_accounts(skip: int = 0, limit: int = 100):
    """Get all utility accounts"""
    return crud.get_all_utility_accounts(skip, limit)

@app.get("/utility-accounts/{account_id}", response_model=dict, tags=["Utility Accounts"])
def read_utility_account(account_id: int):
    """Get utility account by ID"""
    account = crud.get_utility_account(account_id)
    if account is None:
        raise HTTPException(status_code=404, detail="Utility account not found")
    return account

@app.get("/utility-accounts/citizen/{citizen_id}", response_model=List[dict], tags=["Utility Accounts"])
def read_utility_accounts_by_citizen(citizen_id: int):
    """Get utility accounts by citizen ID"""
    return crud.get_utility_accounts_by_citizen(citizen_id)

@app.put("/utility-accounts/{account_id}", response_model=dict, tags=["Utility Accounts"])
def update_utility_account(account_id: int, account: UtilityAccountUpdate):
    """Update a utility account"""
    try:
        result = crud.update_utility_account(account_id, account.dict(exclude_none=True))
        if result is None:
            raise HTTPException(status_code=404, detail="Utility account not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/utility-accounts/{account_id}", tags=["Utility Accounts"])
def delete_utility_account(account_id: int):
    """Delete a utility account"""
    try:
        return crud.delete_utility_account(account_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== ELECTRICITY USAGE ROUTES ====================
@app.post("/electricity-usage", response_model=dict, tags=["Electricity Usage"])
def create_electricity_usage(usage: ElectricityUsageCreate):
    """Create a new electricity usage record"""
    try:
        return crud.create_electricity_usage(usage.dict(exclude_none=True))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/electricity-usage", response_model=List[dict], tags=["Electricity Usage"])
def read_electricity_usage(skip: int = 0, limit: int = 100):
    """Get all electricity usage records"""
    return crud.get_all_electricity_usage(skip, limit)

@app.get("/electricity-usage/{usage_id}", response_model=dict, tags=["Electricity Usage"])
def read_electricity_usage_by_id(usage_id: int):
    """Get electricity usage by ID"""
    usage = crud.get_electricity_usage(usage_id)
    if usage is None:
        raise HTTPException(status_code=404, detail="Electricity usage not found")
    return usage

@app.get("/electricity-usage/account/{account_id}", response_model=List[dict], tags=["Electricity Usage"])
def read_electricity_usage_by_account(account_id: int):
    """Get electricity usage by account ID"""
    return crud.get_electricity_usage_by_account(account_id)

@app.put("/electricity-usage/{usage_id}", response_model=dict, tags=["Electricity Usage"])
def update_electricity_usage(usage_id: int, usage: ElectricityUsageUpdate):
    """Update electricity usage"""
    try:
        result = crud.update_electricity_usage(usage_id, usage.dict(exclude_none=True))
        if result is None:
            raise HTTPException(status_code=404, detail="Electricity usage not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/electricity-usage/{usage_id}", tags=["Electricity Usage"])
def delete_electricity_usage(usage_id: int):
    """Delete electricity usage"""
    try:
        return crud.delete_electricity_usage(usage_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== WATER USAGE ROUTES ====================
@app.post("/water-usage", response_model=dict, tags=["Water Usage"])
def create_water_usage(usage: WaterUsageCreate):
    """Create a new water usage record"""
    try:
        return crud.create_water_usage(usage.dict(exclude_none=True))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/water-usage", response_model=List[dict], tags=["Water Usage"])
def read_water_usage(skip: int = 0, limit: int = 100):
    """Get all water usage records"""
    return crud.get_all_water_usage(skip, limit)

@app.get("/water-usage/{usage_id}", response_model=dict, tags=["Water Usage"])
def read_water_usage_by_id(usage_id: int):
    """Get water usage by ID"""
    usage = crud.get_water_usage(usage_id)
    if usage is None:
        raise HTTPException(status_code=404, detail="Water usage not found")
    return usage

@app.get("/water-usage/account/{account_id}", response_model=List[dict], tags=["Water Usage"])
def read_water_usage_by_account(account_id: int):
    """Get water usage by account ID"""
    return crud.get_water_usage_by_account(account_id)

@app.put("/water-usage/{usage_id}", response_model=dict, tags=["Water Usage"])
def update_water_usage(usage_id: int, usage: WaterUsageUpdate):
    """Update water usage"""
    try:
        result = crud.update_water_usage(usage_id, usage.dict(exclude_none=True))
        if result is None:
            raise HTTPException(status_code=404, detail="Water usage not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/water-usage/{usage_id}", tags=["Water Usage"])
def delete_water_usage(usage_id: int):
    """Delete water usage"""
    try:
        return crud.delete_water_usage(usage_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== ELECTRICITY BILLS ROUTES ====================
@app.post("/electricity-bills", response_model=dict, tags=["Electricity Bills"])
def create_electricity_bill(bill: ElectricityBillCreate):
    """Create a new electricity bill"""
    try:
        return crud.create_electricity_bill(bill.dict(exclude_none=True))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/electricity-bills", response_model=List[dict], tags=["Electricity Bills"])
def read_electricity_bills(skip: int = 0, limit: int = 100):
    """Get all electricity bills"""
    return crud.get_all_electricity_bills(skip, limit)

@app.get("/electricity-bills/{bill_id}", response_model=dict, tags=["Electricity Bills"])
def read_electricity_bill(bill_id: int):
    """Get electricity bill by ID"""
    bill = crud.get_electricity_bill(bill_id)
    if bill is None:
        raise HTTPException(status_code=404, detail="Electricity bill not found")
    return bill

@app.get("/electricity-bills/account/{account_id}", response_model=List[dict], tags=["Electricity Bills"])
def read_electricity_bills_by_account(account_id: int):
    """Get electricity bills by account ID"""
    return crud.get_electricity_bills_by_account(account_id)

@app.put("/electricity-bills/{bill_id}", response_model=dict, tags=["Electricity Bills"])
def update_electricity_bill(bill_id: int, bill: ElectricityBillUpdate):
    """Update electricity bill"""
    try:
        result = crud.update_electricity_bill(bill_id, bill.dict(exclude_none=True))
        if result is None:
            raise HTTPException(status_code=404, detail="Electricity bill not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/electricity-bills/{bill_id}", tags=["Electricity Bills"])
def delete_electricity_bill(bill_id: int):
    """Delete electricity bill"""
    try:
        return crud.delete_electricity_bill(bill_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== WATER BILLS ROUTES ====================
@app.post("/water-bills", response_model=dict, tags=["Water Bills"])
def create_water_bill(bill: WaterBillCreate):
    """Create a new water bill"""
    try:
        return crud.create_water_bill(bill.dict(exclude_none=True))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/water-bills", response_model=List[dict], tags=["Water Bills"])
def read_water_bills(skip: int = 0, limit: int = 100):
    """Get all water bills"""
    return crud.get_all_water_bills(skip, limit)

@app.get("/water-bills/{bill_id}", response_model=dict, tags=["Water Bills"])
def read_water_bill(bill_id: int):
    """Get water bill by ID"""
    bill = crud.get_water_bill(bill_id)
    if bill is None:
        raise HTTPException(status_code=404, detail="Water bill not found")
    return bill

@app.get("/water-bills/account/{account_id}", response_model=List[dict], tags=["Water Bills"])
def read_water_bills_by_account(account_id: int):
    """Get water bills by account ID"""
    return crud.get_water_bills_by_account(account_id)

@app.put("/water-bills/{bill_id}", response_model=dict, tags=["Water Bills"])
def update_water_bill(bill_id: int, bill: WaterBillUpdate):
    """Update water bill"""
    try:
        result = crud.update_water_bill(bill_id, bill.dict(exclude_none=True))
        if result is None:
            raise HTTPException(status_code=404, detail="Water bill not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/water-bills/{bill_id}", tags=["Water Bills"])
def delete_water_bill(bill_id: int):
    """Delete water bill"""
    try:
        return crud.delete_water_bill(bill_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== PAYMENTS ROUTES ====================
@app.post("/payments", response_model=dict, tags=["Payments"])
def create_payment(payment: PaymentCreate):
    """Create a new payment"""
    try:
        return crud.create_payment(payment.dict(exclude_none=True))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/payments", response_model=List[dict], tags=["Payments"])
def read_payments(skip: int = 0, limit: int = 100):
    """Get all payments"""
    return crud.get_all_payments(skip, limit)

@app.get("/payments/{payment_id}", response_model=dict, tags=["Payments"])
def read_payment(payment_id: int):
    """Get payment by ID"""
    payment = crud.get_payment(payment_id)
    if payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

@app.get("/payments/bill/{bill_type}/{bill_id}", response_model=List[dict], tags=["Payments"])
def read_payments_by_bill(bill_type: str, bill_id: int):
    """Get payments by bill type and bill ID"""
    return crud.get_payments_by_bill(bill_type, bill_id)

@app.put("/payments/{payment_id}", response_model=dict, tags=["Payments"])
def update_payment(payment_id: int, payment: PaymentUpdate):
    """Update payment"""
    try:
        result = crud.update_payment(payment_id, payment.dict(exclude_none=True))
        if result is None:
            raise HTTPException(status_code=404, detail="Payment not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/payments/{payment_id}", tags=["Payments"])
def delete_payment(payment_id: int):
    """Delete payment"""
    try:
        return crud.delete_payment(payment_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== PUBLIC TRANSPORT ROUTES ====================
@app.post("/routes", response_model=dict, tags=["Public Transport Routes"])
def create_route(route: PublicTransportRouteCreate):
    """Create a new route"""
    try:
        return crud.create_route(route.dict(exclude_none=True))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/routes", response_model=List[dict], tags=["Public Transport Routes"])
def read_routes(skip: int = 0, limit: int = 100):
    """Get all routes"""
    return crud.get_all_routes(skip, limit)

@app.get("/routes/{route_id}", response_model=dict, tags=["Public Transport Routes"])
def read_route(route_id: int):
    """Get route by ID"""
    route = crud.get_route(route_id)
    if route is None:
        raise HTTPException(status_code=404, detail="Route not found")
    return route

@app.put("/routes/{route_id}", response_model=dict, tags=["Public Transport Routes"])
def update_route(route_id: int, route: PublicTransportRouteUpdate):
    """Update route"""
    try:
        result = crud.update_route(route_id, route.dict(exclude_none=True))
        if result is None:
            raise HTTPException(status_code=404, detail="Route not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/routes/{route_id}", tags=["Public Transport Routes"])
def delete_route(route_id: int):
    """Delete route"""
    try:
        return crud.delete_route(route_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== DRIVERS ROUTES ====================
@app.post("/drivers", response_model=dict, tags=["Drivers"])
def create_driver(driver: DriverCreate):
    """Create a new driver"""
    try:
        return crud.create_driver(driver.dict(exclude_none=True))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/drivers", response_model=List[dict], tags=["Drivers"])
def read_drivers(skip: int = 0, limit: int = 100):
    """Get all drivers"""
    return crud.get_all_drivers(skip, limit)

@app.get("/drivers/{driver_id}", response_model=dict, tags=["Drivers"])
def read_driver(driver_id: int):
    """Get driver by ID"""
    driver = crud.get_driver(driver_id)
    if driver is None:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver

@app.put("/drivers/{driver_id}", response_model=dict, tags=["Drivers"])
def update_driver(driver_id: int, driver: DriverUpdate):
    """Update driver"""
    try:
        result = crud.update_driver(driver_id, driver.dict(exclude_none=True))
        if result is None:
            raise HTTPException(status_code=404, detail="Driver not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/drivers/{driver_id}", tags=["Drivers"])
def delete_driver(driver_id: int):
    """Delete driver"""
    try:
        return crud.delete_driver(driver_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== BUSES ROUTES ====================
@app.post("/buses", response_model=dict, tags=["Buses"])
def create_bus(bus: BusCreate):
    """Create a new bus"""
    try:
        return crud.create_bus(bus.dict(exclude_none=True))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/buses", response_model=List[dict], tags=["Buses"])
def read_buses(skip: int = 0, limit: int = 100):
    """Get all buses"""
    return crud.get_all_buses(skip, limit)

@app.get("/buses/{bus_id}", response_model=dict, tags=["Buses"])
def read_bus(bus_id: int):
    """Get bus by ID"""
    bus = crud.get_bus(bus_id)
    if bus is None:
        raise HTTPException(status_code=404, detail="Bus not found")
    return bus

@app.get("/buses/route/{route_id}", response_model=List[dict], tags=["Buses"])
def read_buses_by_route(route_id: int):
    """Get buses by route ID"""
    return crud.get_buses_by_route(route_id)

@app.put("/buses/{bus_id}", response_model=dict, tags=["Buses"])
def update_bus(bus_id: int, bus: BusUpdate):
    """Update bus"""
    try:
        result = crud.update_bus(bus_id, bus.dict(exclude_none=True))
        if result is None:
            raise HTTPException(status_code=404, detail="Bus not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/buses/{bus_id}", tags=["Buses"])
def delete_bus(bus_id: int):
    """Delete bus"""
    try:
        return crud.delete_bus(bus_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== EMERGENCY SERVICES ROUTES ====================
@app.post("/emergency-services", response_model=dict, tags=["Emergency Services"])
def create_emergency_service(service: EmergencyServiceCreate):
    """Create a new emergency service"""
    try:
        return crud.create_emergency_service(service.dict(exclude_none=True))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/emergency-services", response_model=List[dict], tags=["Emergency Services"])
def read_emergency_services(skip: int = 0, limit: int = 100):
    """Get all emergency services"""
    return crud.get_all_emergency_services(skip, limit)

@app.get("/emergency-services/{service_id}", response_model=dict, tags=["Emergency Services"])
def read_emergency_service(service_id: int):
    """Get emergency service by ID"""
    service = crud.get_emergency_service(service_id)
    if service is None:
        raise HTTPException(status_code=404, detail="Emergency service not found")
    return service

@app.put("/emergency-services/{service_id}", response_model=dict, tags=["Emergency Services"])
def update_emergency_service(service_id: int, service: EmergencyServiceUpdate):
    """Update emergency service"""
    try:
        result = crud.update_emergency_service(service_id, service.dict(exclude_none=True))
        if result is None:
            raise HTTPException(status_code=404, detail="Emergency service not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/emergency-services/{service_id}", tags=["Emergency Services"])
def delete_emergency_service(service_id: int):
    """Delete emergency service"""
    try:
        return crud.delete_emergency_service(service_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== EMERGENCY REQUESTS ROUTES ====================
@app.post("/emergency-requests", response_model=dict, tags=["Emergency Requests"])
def create_emergency_request(request: EmergencyRequestCreate):
    """Create a new emergency request"""
    try:
        return crud.create_emergency_request(request.dict(exclude_none=True))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/emergency-requests", response_model=List[dict], tags=["Emergency Requests"])
def read_emergency_requests(skip: int = 0, limit: int = 100):
    """Get all emergency requests"""
    return crud.get_all_emergency_requests(skip, limit)

@app.get("/emergency-requests/{req_id}", response_model=dict, tags=["Emergency Requests"])
def read_emergency_request(req_id: int):
    """Get emergency request by ID"""
    request = crud.get_emergency_request(req_id)
    if request is None:
        raise HTTPException(status_code=404, detail="Emergency request not found")
    return request

@app.get("/emergency-requests/status/{status}", response_model=List[dict], tags=["Emergency Requests"])
def read_emergency_requests_by_status(status: str):
    """Get emergency requests by status"""
    return crud.get_emergency_requests_by_status(status)

@app.put("/emergency-requests/{req_id}", response_model=dict, tags=["Emergency Requests"])
def update_emergency_request(req_id: int, request: EmergencyRequestUpdate):
    """Update emergency request"""
    try:
        result = crud.update_emergency_request(req_id, request.dict(exclude_none=True))
        if result is None:
            raise HTTPException(status_code=404, detail="Emergency request not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/emergency-requests/{req_id}", tags=["Emergency Requests"])
def delete_emergency_request(req_id: int):
    """Delete emergency request"""
    try:
        return crud.delete_emergency_request(req_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== WASTE COLLECTION ZONES ROUTES ====================
@app.post("/waste-collection-zones", response_model=dict, tags=["Waste Collection Zones"])
def create_waste_collection_zone(zone: WasteCollectionZoneCreate):
    """Create a new waste collection zone"""
    try:
        return crud.create_waste_collection_zone(zone.dict(exclude_none=True))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/waste-collection-zones", response_model=List[dict], tags=["Waste Collection Zones"])
def read_waste_collection_zones(skip: int = 0, limit: int = 100):
    """Get all waste collection zones"""
    return crud.get_all_waste_collection_zones(skip, limit)

@app.get("/waste-collection-zones/{zone_id}", response_model=dict, tags=["Waste Collection Zones"])
def read_waste_collection_zone(zone_id: int):
    """Get waste collection zone by ID"""
    zone = crud.get_waste_collection_zone(zone_id)
    if zone is None:
        raise HTTPException(status_code=404, detail="Waste collection zone not found")
    return zone

@app.put("/waste-collection-zones/{zone_id}", response_model=dict, tags=["Waste Collection Zones"])
def update_waste_collection_zone(zone_id: int, zone: WasteCollectionZoneUpdate):
    """Update waste collection zone"""
    try:
        result = crud.update_waste_collection_zone(zone_id, zone.dict(exclude_none=True))
        if result is None:
            raise HTTPException(status_code=404, detail="Waste collection zone not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/waste-collection-zones/{zone_id}", tags=["Waste Collection Zones"])
def delete_waste_collection_zone(zone_id: int):
    """Delete waste collection zone"""
    try:
        return crud.delete_waste_collection_zone(zone_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== TRUCKS ROUTES ====================
@app.post("/trucks", response_model=dict, tags=["Trucks"])
def create_truck(truck: TruckCreate):
    """Create a new truck"""
    try:
        return crud.create_truck(truck.dict(exclude_none=True))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/trucks", response_model=List[dict], tags=["Trucks"])
def read_trucks(skip: int = 0, limit: int = 100):
    """Get all trucks"""
    return crud.get_all_trucks(skip, limit)

@app.get("/trucks/{truck_id}", response_model=dict, tags=["Trucks"])
def read_truck(truck_id: int):
    """Get truck by ID"""
    truck = crud.get_truck(truck_id)
    if truck is None:
        raise HTTPException(status_code=404, detail="Truck not found")
    return truck

@app.put("/trucks/{truck_id}", response_model=dict, tags=["Trucks"])
def update_truck(truck_id: int, truck: TruckUpdate):
    """Update truck"""
    try:
        result = crud.update_truck(truck_id, truck.dict(exclude_none=True))
        if result is None:
            raise HTTPException(status_code=404, detail="Truck not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/trucks/{truck_id}", tags=["Trucks"])
def delete_truck(truck_id: int):
    """Delete truck"""
    try:
        return crud.delete_truck(truck_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== WASTE COLLECTION LOGS ROUTES ====================
@app.post("/waste-collection-logs", response_model=dict, tags=["Waste Collection Logs"])
def create_waste_collection_log(log: WasteCollectionLogCreate):
    """Create a new waste collection log"""
    try:
        return crud.create_waste_collection_log(log.dict(exclude_none=True))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/waste-collection-logs", response_model=List[dict], tags=["Waste Collection Logs"])
def read_waste_collection_logs(skip: int = 0, limit: int = 100):
    """Get all waste collection logs"""
    return crud.get_all_waste_collection_logs(skip, limit)

@app.get("/waste-collection-logs/{log_id}", response_model=dict, tags=["Waste Collection Logs"])
def read_waste_collection_log(log_id: int):
    """Get waste collection log by ID"""
    log = crud.get_waste_collection_log(log_id)
    if log is None:
        raise HTTPException(status_code=404, detail="Waste collection log not found")
    return log

@app.get("/waste-collection-logs/zone/{zone_id}", response_model=List[dict], tags=["Waste Collection Logs"])
def read_waste_collection_logs_by_zone(zone_id: int):
    """Get waste collection logs by zone ID"""
    return crud.get_waste_collection_logs_by_zone(zone_id)

@app.put("/waste-collection-logs/{log_id}", response_model=dict, tags=["Waste Collection Logs"])
def update_waste_collection_log(log_id: int, log: WasteCollectionLogUpdate):
    """Update waste collection log"""
    try:
        result = crud.update_waste_collection_log(log_id, log.dict(exclude_none=True))
        if result is None:
            raise HTTPException(status_code=404, detail="Waste collection log not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/waste-collection-logs/{log_id}", tags=["Waste Collection Logs"])
def delete_waste_collection_log(log_id: int):
    """Delete waste collection log"""
    try:
        return crud.delete_waste_collection_log(log_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== COMPLAINTS ROUTES ====================
@app.post("/complaints", response_model=dict, tags=["Complaints"])
def create_complaint(complaint: ComplaintCreate):
    """Create a new complaint"""
    try:
        return crud.create_complaint(complaint.dict(exclude_none=True))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/complaints", response_model=List[dict], tags=["Complaints"])
def read_complaints(skip: int = 0, limit: int = 100):
    """Get all complaints"""
    return crud.get_all_complaints(skip, limit)

@app.get("/complaints/{complaint_id}", response_model=dict, tags=["Complaints"])
def read_complaint(complaint_id: int):
    """Get complaint by ID"""
    complaint = crud.get_complaint(complaint_id)
    if complaint is None:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint

@app.get("/complaints/status/{status}", response_model=List[dict], tags=["Complaints"])
def read_complaints_by_status(status: str):
    """Get complaints by status"""
    return crud.get_complaints_by_status(status)

@app.get("/complaints/citizen/{citizen_id}", response_model=List[dict], tags=["Complaints"])
def read_complaints_by_citizen(citizen_id: int):
    """Get complaints by citizen ID"""
    return crud.get_complaints_by_citizen(citizen_id)

@app.put("/complaints/{complaint_id}", response_model=dict, tags=["Complaints"])
def update_complaint(complaint_id: int, complaint: ComplaintUpdate):
    """Update complaint"""
    try:
        result = crud.update_complaint(complaint_id, complaint.dict(exclude_none=True))
        if result is None:
            raise HTTPException(status_code=404, detail="Complaint not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/complaints/{complaint_id}", tags=["Complaints"])
def delete_complaint(complaint_id: int):
    """Delete complaint"""
    try:
        return crud.delete_complaint(complaint_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== COMPLAINT UPDATES ROUTES ====================
@app.post("/complaint-updates", response_model=dict, tags=["Complaint Updates"])
def create_complaint_update(update: ComplaintUpdateCreate):
    """Create a new complaint update"""
    try:
        return crud.create_complaint_update(update.dict(exclude_none=True))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/complaint-updates", response_model=List[dict], tags=["Complaint Updates"])
def read_complaint_updates(skip: int = 0, limit: int = 100):
    """Get all complaint updates"""
    return crud.get_all_complaint_updates(skip, limit)

@app.get("/complaint-updates/{update_id}", response_model=dict, tags=["Complaint Updates"])
def read_complaint_update(update_id: int):
    """Get complaint update by ID"""
    update = crud.get_complaint_update(update_id)
    if update is None:
        raise HTTPException(status_code=404, detail="Complaint update not found")
    return update

@app.get("/complaint-updates/complaint/{complaint_id}", response_model=List[dict], tags=["Complaint Updates"])
def read_complaint_updates_by_complaint(complaint_id: int):
    """Get complaint updates by complaint ID"""
    return crud.get_complaint_updates_by_complaint(complaint_id)

@app.put("/complaint-updates/{update_id}", response_model=dict, tags=["Complaint Updates"])
def update_complaint_update(update_id: int, update: ComplaintUpdateUpdate):
    """Update complaint update"""
    try:
        result = crud.update_complaint_update(update_id, update.dict(exclude_none=True))
        if result is None:
            raise HTTPException(status_code=404, detail="Complaint update not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/complaint-updates/{update_id}", tags=["Complaint Updates"])
def delete_complaint_update(update_id: int):
    """Delete complaint update"""
    try:
        return crud.delete_complaint_update(update_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== ROOT ROUTE ====================
@app.get("/", tags=["Root"])
def root():
    """API root endpoint"""
    return {
        "message": "Smart City Management System API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


