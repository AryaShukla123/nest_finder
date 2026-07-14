from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DB_NAME = os.getenv("DB_NAME", "nestfinder")

client = AsyncIOMotorClient(MONGODB_URL)
database = client[DB_NAME]
users_collection = database.get_collection("users")

async def connect_to_mongo():
    global client, database
    try:
        client = AsyncIOMotorClient(MONGODB_URL)
        database = client[DB_NAME]
        # Test connection
        await client.admin.command('ping')
        print("✅ Connected to MongoDB")
    except ConnectionFailure as e:
        print(f"❌ Could not connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("🔌 MongoDB connection closed")

def get_database():
    return database