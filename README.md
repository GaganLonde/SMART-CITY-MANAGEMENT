# Smart City Management System API

A comprehensive REST API for managing smart city services including utilities, transportation, emergency services, waste management, and citizen complaints.

## Features

- **18 Database Tables** with full CRUD operations
- **RESTful API** built with FastAPI
- **Automatic API Documentation** (Swagger UI and ReDoc)
- **MySQL Database** integration
- **Pydantic Models** for request/response validation
- **CORS Support** for frontend integration

## Database Schema

The system manages the following entities:

1. **Addresses** - Location information
2. **Citizens** - Citizen records
3. **Utility Accounts** - Electricity and water accounts
4. **Electricity Usage** - Electricity consumption records
5. **Water Usage** - Water consumption records
6. **Electricity Bills** - Electricity billing
7. **Water Bills** - Water billing
8. **Payments** - Payment transactions
9. **Public Transport Routes** - Bus routes
10. **Drivers** - Driver information
11. **Buses** - Bus fleet management
12. **Emergency Services** - Emergency service types
13. **Emergency Requests** - Emergency service requests
14. **Waste Collection Zones** - Waste collection areas
15. **Trucks** - Waste collection vehicles
16. **Waste Collection Logs** - Collection records
17. **Complaints** - Citizen complaints
18. **Complaint Updates** - Complaint status updates

## Installation

### Prerequisites

- Python 3.8 or higher
- MySQL 8.0 or higher
- pip (Python package manager)

### Setup Steps

1. **Clone or navigate to the project directory**

2. **Create a virtual environment** (recommended):

```bash
python -m venv venv
```

3. **Activate the virtual environment**:

   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**:

```bash
pip install -r requirements.txt
```

5. **Set up the database**:

   - Create a MySQL database:
     ```sql
     CREATE DATABASE smart_city_management;
     ```
   - Run the SQL scripts to create tables:
     ```bash
     mysql -u root -p smart_city_management < sql/SQL_Commands.sql
     ```
   - (Optional) Populate with sample data:
     ```bash
     mysql -u root -p smart_city_management < sql/SQL_Insert_Commands.sql
     ```

6. **Configure database connection**:
   - Create a `.env` file in the project root:
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=smart_city_management
     DB_PORT=3306
     ```
   - Or copy `.env.example` and update the values

## Running the API

### Development Server

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:

- **API**: http://localhost:8000
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Addresses

- `POST /addresses` - Create address
- `GET /addresses` - List all addresses
- `GET /addresses/{id}` - Get address by ID
- `PUT /addresses/{id}` - Update address
- `DELETE /addresses/{id}` - Delete address

### Citizens

- `POST /citizens` - Create citizen
- `GET /citizens` - List all citizens
- `GET /citizens/{id}` - Get citizen by ID
- `PUT /citizens/{id}` - Update citizen
- `DELETE /citizens/{id}` - Delete citizen

### Utility Accounts

- `POST /utility-accounts` - Create utility account
- `GET /utility-accounts` - List all utility accounts
- `GET /utility-accounts/{id}` - Get utility account by ID
- `GET /utility-accounts/citizen/{citizen_id}` - Get accounts by citizen
- `PUT /utility-accounts/{id}` - Update utility account
- `DELETE /utility-accounts/{id}` - Delete utility account

### Electricity Usage

- `POST /electricity-usage` - Create usage record
- `GET /electricity-usage` - List all usage records
- `GET /electricity-usage/{id}` - Get usage by ID
- `GET /electricity-usage/account/{account_id}` - Get usage by account
- `PUT /electricity-usage/{id}` - Update usage
- `DELETE /electricity-usage/{id}` - Delete usage

### Water Usage

- `POST /water-usage` - Create usage record
- `GET /water-usage` - List all usage records
- `GET /water-usage/{id}` - Get usage by ID
- `GET /water-usage/account/{account_id}` - Get usage by account
- `PUT /water-usage/{id}` - Update usage
- `DELETE /water-usage/{id}` - Delete usage

### Electricity Bills

- `POST /electricity-bills` - Create bill
- `GET /electricity-bills` - List all bills
- `GET /electricity-bills/{id}` - Get bill by ID
- `GET /electricity-bills/account/{account_id}` - Get bills by account
- `PUT /electricity-bills/{id}` - Update bill
- `DELETE /electricity-bills/{id}` - Delete bill

### Water Bills

- `POST /water-bills` - Create bill
- `GET /water-bills` - List all bills
- `GET /water-bills/{id}` - Get bill by ID
- `GET /water-bills/account/{account_id}` - Get bills by account
- `PUT /water-bills/{id}` - Update bill
- `DELETE /water-bills/{id}` - Delete bill

### Payments

- `POST /payments` - Create payment
- `GET /payments` - List all payments
- `GET /payments/{id}` - Get payment by ID
- `GET /payments/bill/{bill_type}/{bill_id}` - Get payments by bill
- `PUT /payments/{id}` - Update payment
- `DELETE /payments/{id}` - Delete payment

### Public Transport Routes

- `POST /routes` - Create route
- `GET /routes` - List all routes
- `GET /routes/{id}` - Get route by ID
- `PUT /routes/{id}` - Update route
- `DELETE /routes/{id}` - Delete route

### Drivers

- `POST /drivers` - Create driver
- `GET /drivers` - List all drivers
- `GET /drivers/{id}` - Get driver by ID
- `PUT /drivers/{id}` - Update driver
- `DELETE /drivers/{id}` - Delete driver

### Buses

- `POST /buses` - Create bus
- `GET /buses` - List all buses
- `GET /buses/{id}` - Get bus by ID
- `GET /buses/route/{route_id}` - Get buses by route
- `PUT /buses/{id}` - Update bus
- `DELETE /buses/{id}` - Delete bus

### Emergency Services

- `POST /emergency-services` - Create service
- `GET /emergency-services` - List all services
- `GET /emergency-services/{id}` - Get service by ID
- `PUT /emergency-services/{id}` - Update service
- `DELETE /emergency-services/{id}` - Delete service

### Emergency Requests

- `POST /emergency-requests` - Create request
- `GET /emergency-requests` - List all requests
- `GET /emergency-requests/{id}` - Get request by ID
- `GET /emergency-requests/status/{status}` - Get requests by status
- `PUT /emergency-requests/{id}` - Update request
- `DELETE /emergency-requests/{id}` - Delete request

### Waste Collection Zones

- `POST /waste-collection-zones` - Create zone
- `GET /waste-collection-zones` - List all zones
- `GET /waste-collection-zones/{id}` - Get zone by ID
- `PUT /waste-collection-zones/{id}` - Update zone
- `DELETE /waste-collection-zones/{id}` - Delete zone

### Trucks

- `POST /trucks` - Create truck
- `GET /trucks` - List all trucks
- `GET /trucks/{id}` - Get truck by ID
- `PUT /trucks/{id}` - Update truck
- `DELETE /trucks/{id}` - Delete truck

### Waste Collection Logs

- `POST /waste-collection-logs` - Create log
- `GET /waste-collection-logs` - List all logs
- `GET /waste-collection-logs/{id}` - Get log by ID
- `GET /waste-collection-logs/zone/{zone_id}` - Get logs by zone
- `PUT /waste-collection-logs/{id}` - Update log
- `DELETE /waste-collection-logs/{id}` - Delete log

### Complaints

- `POST /complaints` - Create complaint
- `GET /complaints` - List all complaints
- `GET /complaints/{id}` - Get complaint by ID
- `GET /complaints/status/{status}` - Get complaints by status
- `GET /complaints/citizen/{citizen_id}` - Get complaints by citizen
- `PUT /complaints/{id}` - Update complaint
- `DELETE /complaints/{id}` - Delete complaint

### Complaint Updates

- `POST /complaint-updates` - Create update
- `GET /complaint-updates` - List all updates
- `GET /complaint-updates/{id}` - Get update by ID
- `GET /complaint-updates/complaint/{complaint_id}` - Get updates by complaint
- `PUT /complaint-updates/{id}` - Update complaint update
- `DELETE /complaint-updates/{id}` - Delete complaint update

## Example Usage

### Create a Citizen

```bash
curl -X POST "http://localhost:8000/citizens" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "dob": "1990-01-15",
    "gender": "M",
    "phone": "9876543210",
    "email": "john.doe@example.com",
    "address_id": 1
  }'
```

### Get All Citizens

```bash
curl "http://localhost:8000/citizens"
```

### Create an Electricity Bill

```bash
curl -X POST "http://localhost:8000/electricity-bills" \
  -H "Content-Type: application/json" \
  -d '{
    "account_id": 1,
    "bill_year": 2025,
    "bill_month": 1,
    "units_consumed": 250.50,
    "amount": 1252.50,
    "status": "Unpaid",
    "due_date": "2025-02-15"
  }'
```

## Project Structure

```
.
├── main.py                 # Application entry point
├── app/                    # Main application package
│   ├── __init__.py
│   ├── main.py            # FastAPI application
│   ├── config.py          # Configuration
│   ├── database.py        # Database connection
│   ├── models/            # Pydantic models
│   │   ├── __init__.py
│   │   └── schemas.py     # All Pydantic schemas
│   └── crud/              # CRUD operations
│       ├── __init__.py
│       └── operations.py  # All CRUD functions
├── sql/                   # SQL scripts
│   ├── SQL_Commands.sql   # Database schema
│   └── SQL_Insert_Commands.sql # Sample data
├── requirements.txt       # Python dependencies
├── README.md              # This file
└── .env                   # Environment variables (create this)
```

## Technologies Used

- **FastAPI** - Modern, fast web framework for building APIs
- **PyMySQL** - MySQL database connector
- **Pydantic** - Data validation using Python type annotations
- **Uvicorn** - ASGI server
- **python-dotenv** - Environment variable management

## Next Steps

- Frontend development (React/Vue/Angular)
- Authentication and authorization
- API rate limiting
- Logging and monitoring
- Unit and integration tests
- Docker containerization

## License

This project is for educational purposes.

## Support

For issues or questions, please refer to the API documentation at `/docs` endpoint.
