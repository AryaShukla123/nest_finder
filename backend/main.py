from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
from database import connect_to_mongo, close_mongo_connection

app = FastAPI(title="Real Estate Auth API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])

@app.get("/")
def read_root():
    return {"message": "Real Estate Auth API is running"}