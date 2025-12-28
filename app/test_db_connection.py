#!/usr/bin/env python3
"""
Database connection test script
"""
import sys
import os

# Add the parent directory to the path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import db

def test_db_connection():
    """Test database connection"""
    try:
        print("Testing database connection...")

        # Try to execute a simple query to test the connection
        result = db.execute_query("SELECT 1 as test", fetch=True)

        if result:
            print("✅ Database connection successful!")
            print(f"Query result: {result}")
            return True
        else:
            print("❌ Database connection failed - no result returned")
            return False

    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_db_connection()
    sys.exit(0 if success else 1)