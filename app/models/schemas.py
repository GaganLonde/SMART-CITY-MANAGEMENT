"""
Pydantic models for request/response validation
"""
from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import date, datetime

# Address Models
class AddressBase(BaseModel):
    street: Optional[str] = None
    area: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zipcode: Optional[str] = None
    country: Optional[str] = "India"

class AddressCreate(AddressBase):
    pass

class AddressUpdate(AddressBase):
    pass

class Address(AddressBase):
    address_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Citizen Models
class CitizenBase(BaseModel):
    name: str
    dob: Optional[date] = None
    gender: Optional[str] = "Other"
    phone: Optional[str] = None
    email: Optional[str] = None
    address_id: Optional[int] = None

class CitizenCreate(CitizenBase):
    pass

class CitizenUpdate(CitizenBase):
    name: Optional[str] = None

class Citizen(CitizenBase):
    citizen_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Utility Account Models
class UtilityAccountBase(BaseModel):
    citizen_id: int
    electricity_account_no: Optional[str] = None
    water_account_no: Optional[str] = None

class UtilityAccountCreate(UtilityAccountBase):
    pass

class UtilityAccountUpdate(BaseModel):
    electricity_account_no: Optional[str] = None
    water_account_no: Optional[str] = None

class UtilityAccount(UtilityAccountBase):
    account_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Electricity Usage Models
class ElectricityUsageBase(BaseModel):
    account_id: int
    usage_month: int
    usage_month_number: int
    units_consumed: float
    meter_reading_time: Optional[datetime] = None

class ElectricityUsageCreate(ElectricityUsageBase):
    pass

class ElectricityUsageUpdate(BaseModel):
    usage_month: Optional[int] = None
    usage_month_number: Optional[int] = None
    units_consumed: Optional[float] = None
    meter_reading_time: Optional[datetime] = None

class ElectricityUsage(ElectricityUsageBase):
    usage_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Water Usage Models
class WaterUsageBase(BaseModel):
    account_id: int
    usage_month: int
    usage_month_number: int
    litres_consumed: float
    recorded_at: Optional[datetime] = None

class WaterUsageCreate(WaterUsageBase):
    pass

class WaterUsageUpdate(BaseModel):
    usage_month: Optional[int] = None
    usage_month_number: Optional[int] = None
    litres_consumed: Optional[float] = None
    recorded_at: Optional[datetime] = None

class WaterUsage(WaterUsageBase):
    usage_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Electricity Bill Models
class ElectricityBillBase(BaseModel):
    account_id: int
    bill_year: int
    bill_month: int
    units_consumed: float
    amount: float
    status: Optional[str] = "Unpaid"
    due_date: Optional[date] = None

class ElectricityBillCreate(ElectricityBillBase):
    pass

class ElectricityBillUpdate(BaseModel):
    bill_year: Optional[int] = None
    bill_month: Optional[int] = None
    units_consumed: Optional[float] = None
    amount: Optional[float] = None
    status: Optional[str] = None
    due_date: Optional[date] = None

class ElectricityBill(ElectricityBillBase):
    bill_id: int
    issued_at: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True

# Water Bill Models
class WaterBillBase(BaseModel):
    account_id: int
    bill_year: int
    bill_month: int
    litres_consumed: Optional[float] = None
    amount: Optional[float] = None
    status: Optional[str] = "Unpaid"
    due_date: Optional[date] = None

class WaterBillCreate(WaterBillBase):
    pass

class WaterBillUpdate(BaseModel):
    bill_year: Optional[int] = None
    bill_month: Optional[int] = None
    litres_consumed: Optional[float] = None
    amount: Optional[float] = None
    status: Optional[str] = None
    due_date: Optional[date] = None

class WaterBill(WaterBillBase):
    bill_id: int
    issued_at: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True

# Payment Models
class PaymentBase(BaseModel):
    bill_type: str
    bill_id: int
    payment_date: Optional[datetime] = None
    amount_paid: float
    mode: Optional[str] = "Online"
    transaction_ref: Optional[str] = None

class PaymentCreate(PaymentBase):
    pass

class PaymentUpdate(BaseModel):
    payment_date: Optional[datetime] = None
    amount_paid: Optional[float] = None
    mode: Optional[str] = None
    transaction_ref: Optional[str] = None

class Payment(PaymentBase):
    payment_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Public Transport Route Models
class PublicTransportRouteBase(BaseModel):
    route_name: str
    start_point: Optional[str] = None
    end_point: Optional[str] = None
    distance_km: Optional[float] = None

class PublicTransportRouteCreate(PublicTransportRouteBase):
    pass

class PublicTransportRouteUpdate(BaseModel):
    route_name: Optional[str] = None
    start_point: Optional[str] = None
    end_point: Optional[str] = None
    distance_km: Optional[float] = None

class PublicTransportRoute(PublicTransportRouteBase):
    route_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Driver Models
class DriverBase(BaseModel):
    name: str
    license_no: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class DriverCreate(DriverBase):
    pass

class DriverUpdate(DriverBase):
    name: Optional[str] = None

class Driver(DriverBase):
    driver_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Bus Models
class BusBase(BaseModel):
    route_id: int
    registration_no: Optional[str] = None
    capacity: Optional[int] = 0
    driver_id: Optional[int] = None
    active: Optional[bool] = True

class BusCreate(BusBase):
    pass

class BusUpdate(BaseModel):
    route_id: Optional[int] = None
    registration_no: Optional[str] = None
    capacity: Optional[int] = None
    driver_id: Optional[int] = None
    active: Optional[bool] = None

class Bus(BusBase):
    bus_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Emergency Service Models
class EmergencyServiceBase(BaseModel):
    service_type: str
    phone: Optional[str] = None
    area_covered: Optional[str] = None

class EmergencyServiceCreate(EmergencyServiceBase):
    pass

class EmergencyServiceUpdate(BaseModel):
    service_type: Optional[str] = None
    phone: Optional[str] = None
    area_covered: Optional[str] = None

class EmergencyService(EmergencyServiceBase):
    service_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Emergency Request Models
class EmergencyRequestBase(BaseModel):
    citizen_id: Optional[int] = None
    service_id: int
    request_datetime: Optional[datetime] = None
    incident_datetime: Optional[datetime] = None
    location: Optional[str] = None
    status: Optional[str] = "Open"
    notes: Optional[str] = None

class EmergencyRequestCreate(EmergencyRequestBase):
    pass

class EmergencyRequestUpdate(BaseModel):
    citizen_id: Optional[int] = None
    service_id: Optional[int] = None
    request_datetime: Optional[datetime] = None
    incident_datetime: Optional[datetime] = None
    location: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class EmergencyRequest(EmergencyRequestBase):
    req_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Waste Collection Zone Models
class WasteCollectionZoneBase(BaseModel):
    zone_name: str
    area_description: Optional[str] = None
    schedule: Optional[Dict] = None

class WasteCollectionZoneCreate(WasteCollectionZoneBase):
    pass

class WasteCollectionZoneUpdate(BaseModel):
    zone_name: Optional[str] = None
    area_description: Optional[str] = None
    schedule: Optional[Dict] = None

class WasteCollectionZone(WasteCollectionZoneBase):
    zone_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Truck Models
class TruckBase(BaseModel):
    registration_no: Optional[str] = None
    driver_id: Optional[int] = None
    capacity_kg: Optional[int] = None
    active: Optional[bool] = True

class TruckCreate(TruckBase):
    pass

class TruckUpdate(BaseModel):
    registration_no: Optional[str] = None
    driver_id: Optional[int] = None
    capacity_kg: Optional[int] = None
    active: Optional[bool] = None

class Truck(TruckBase):
    truck_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Waste Collection Log Models
class WasteCollectionLogBase(BaseModel):
    zone_id: int
    truck_id: Optional[int] = None
    collection_date: date
    status: Optional[str] = "Scheduled"
    notes: Optional[str] = None

class WasteCollectionLogCreate(WasteCollectionLogBase):
    pass

class WasteCollectionLogUpdate(BaseModel):
    zone_id: Optional[int] = None
    truck_id: Optional[int] = None
    collection_date: Optional[date] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class WasteCollectionLog(WasteCollectionLogBase):
    log_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Complaint Models
class ComplaintBase(BaseModel):
    citizen_id: Optional[int] = None
    category: Optional[str] = None
    description: Optional[str] = None
    date_reported: Optional[datetime] = None
    status: Optional[str] = "Open"
    assigned_to: Optional[str] = None
    priority: Optional[str] = "Medium"

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintUpdate(BaseModel):
    citizen_id: Optional[int] = None
    category: Optional[str] = None
    description: Optional[str] = None
    date_reported: Optional[datetime] = None
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    priority: Optional[str] = None

class Complaint(ComplaintBase):
    complaint_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Complaint Update Models
class ComplaintUpdateBase(BaseModel):
    complaint_id: int
    update_time: Optional[datetime] = None
    updated_by: Optional[str] = None
    comment: Optional[str] = None

class ComplaintUpdateCreate(ComplaintUpdateBase):
    pass

class ComplaintUpdateUpdate(BaseModel):
    update_time: Optional[datetime] = None
    updated_by: Optional[str] = None
    comment: Optional[str] = None

class ComplaintUpdate(ComplaintUpdateBase):
    update_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

