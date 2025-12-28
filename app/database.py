"""
Database connection module
"""
import pymysql
from app.config import DB_CONFIG
from contextlib import contextmanager

class Database:
    def __init__(self):
        self.config = DB_CONFIG
    
    @contextmanager
    def get_connection(self):
        """Get database connection with context manager"""
        conn = None
        try:
            conn = pymysql.connect(**self.config)
            yield conn
        except Exception as e:
            if conn:
                conn.rollback()
            raise e
        finally:
            if conn:
                conn.close()
    
    def execute_query(self, query, params=None, fetch=True):
        """Execute a query and return results"""
        with self.get_connection() as conn:
            cursor = conn.cursor(pymysql.cursors.DictCursor)
            cursor.execute(query, params)
            if fetch:
                result = cursor.fetchall()
                cursor.close()
                return result
            cursor.close()
            return None
    
    def execute_one(self, query, params=None):
        """Execute a query and return single result"""
        with self.get_connection() as conn:
            cursor = conn.cursor(pymysql.cursors.DictCursor)
            cursor.execute(query, params)
            result = cursor.fetchone()
            cursor.close()
            return result
    
    def execute_insert(self, query, params=None):
        """Execute insert and return last insert id"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            last_id = cursor.lastrowid
            cursor.close()
            return last_id

# Global database instance
db = Database()

