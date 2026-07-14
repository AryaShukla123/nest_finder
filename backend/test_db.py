import asyncio
from database import users_collection

async def test_connection():
    try:
        print("Testing MongoDB Connection...")
        # Attempt a simple count query
        count = await users_collection.count_documents({})
        print(f" Success! Connected to database. Current user count: {count}")
    except Exception as e:
        print(f"\n❌ DATABASE CONNECTION FAILED:\n{e}")

asyncio.run(test_connection())