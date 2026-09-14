from datetime import datetime, timezone
import logging
import os
from pathlib import Path
from typing import List, Optional
import uuid

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB connection
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# -----------------------------
# Models
# -----------------------------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    subject: Optional[str] = ""
    message: str
    preferred_language: str = Field(default="fr", description="fr|en")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    subject: Optional[str] = ""
    message: str
    preferred_language: str = Field(default="fr", description="fr|en")


# -----------------------------
# Routes
# -----------------------------
@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())

    doc = status_obj.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()

    _ = await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)

    for check in status_checks:
        if isinstance(check.get("timestamp"), str):
            check["timestamp"] = datetime.fromisoformat(check["timestamp"])

    return status_checks


@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(payload: ContactMessageCreate):
    msg = ContactMessage(**payload.model_dump())

    doc = msg.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()

    _ = await db.contact_messages.insert_one(doc)
    return msg


@api_router.get("/contact", response_model=List[ContactMessage])
async def list_contact_messages(limit: int = 50):
    # Basic endpoint to verify submissions. (Not protected.)
    limit = max(1, min(200, limit))

    docs = await (
        db.contact_messages.find({}, {"_id": 0})
        .sort("created_at", -1)
        .to_list(limit)
    )

    for d in docs:
        if isinstance(d.get("created_at"), str):
            d["created_at"] = datetime.fromisoformat(d["created_at"])

    return docs


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()