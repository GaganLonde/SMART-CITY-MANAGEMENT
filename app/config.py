"""
Database configuration for Smart City Management System
"""
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'smart_city_management'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'charset': 'utf8mb4',
    'autocommit': True
}

