import asyncio
from database import users_collection

async def test_connection():
    try:
        # Try finding any user (even if collection is empty)
        user = await users_collection.find_one({})
        if user:
            print("✅ Connection successful! Found a user:", user)
        else:
            print("✅ Connection successful! No users in the collection yet.")
    except Exception as e:
        print("❌ Connection failed:", e)

if __name__ == "__main__":
    asyncio.run(test_connection())
