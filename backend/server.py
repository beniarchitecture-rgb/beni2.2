from datetime import datetime, timezone, timedelta
import json
import logging
import os
from pathlib import Path
from typing import List, Optional
import uuid

import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, Response
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


# -----------------------------
# Auth (JWT httpOnly cookies)
# -----------------------------
JWT_ALGORITHM = "HS256"


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=15),
        "type": "access",
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh",
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, user_id: str, email: str) -> None:
    response.set_cookie(
        key="access_token", value=create_access_token(user_id, email),
        httponly=True, secure=True, samesite="none", max_age=900, path="/",
    )
    response.set_cookie(
        key="refresh_token", value=create_refresh_token(user_id),
        httponly=True, secure=True, samesite="none", max_age=604800, path="/",
    )


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Non authentifié")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Token invalide")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expirée")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")
    return user


async def check_lockout(identifier: str) -> None:
    rec = await db.login_attempts.find_one({"identifier": identifier})
    if rec and rec.get("count", 0) >= 5:
        locked_until = rec.get("locked_until")
        if locked_until and datetime.fromisoformat(locked_until) > datetime.now(timezone.utc):
            raise HTTPException(status_code=429, detail="Trop de tentatives. Réessayez dans 15 minutes.")


async def record_login_failure(identifier: str) -> None:
    now = datetime.now(timezone.utc)
    rec = await db.login_attempts.find_one({"identifier": identifier})
    count = (rec.get("count", 0) if rec else 0) + 1
    update = {"count": count, "last_attempt": now.isoformat()}
    if count >= 5:
        update["locked_until"] = (now + timedelta(minutes=15)).isoformat()
    await db.login_attempts.update_one(
        {"identifier": identifier},
        {"$set": update, "$setOnInsert": {"identifier": identifier}},
        upsert=True,
    )


# -----------------------------
# Auth routes
# -----------------------------
class LoginInput(BaseModel):
    email: EmailStr
    password: str


@api_router.post("/auth/login")
async def login(payload: LoginInput, request: Request, response: Response):
    email = payload.email.lower().strip()
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{email}"
    await check_lockout(identifier)

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        await record_login_failure(identifier)
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

    await db.login_attempts.delete_one({"identifier": identifier})
    set_auth_cookies(response, user["id"], email)
    return {
        "id": user["id"],
        "email": email,
        "name": user.get("name", "Admin"),
        "role": user.get("role", "admin"),
    }


@api_router.get("/auth/me")
async def auth_me(user: dict = Depends(get_current_user)):
    return user


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"ok": True}


@api_router.post("/auth/refresh")
async def refresh_access_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Non authentifié")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Token invalide")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expirée")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")
    user = await db.users.find_one({"id": payload["sub"]})
    if not user:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")
    response.set_cookie(
        key="access_token", value=create_access_token(user["id"], user["email"]),
        httponly=True, secure=True, samesite="none", max_age=900, path="/",
    )
    return {"ok": True}


# -----------------------------
# Projects (public + admin)
# -----------------------------
PROJECT_CATEGORIES = {"institutional", "residential", "commercial", "social"}


class LocalText(BaseModel):
    fr: str = ""
    en: str = ""


class LocalList(BaseModel):
    fr: List[str] = []
    en: List[str] = []


class ProjectIn(BaseModel):
    id: str = Field(..., min_length=2, max_length=80)
    category: str
    title: LocalText
    location: LocalText = LocalText()
    year: str = ""
    area_m2: Optional[float] = None
    description: LocalText = LocalText()
    program: LocalList = LocalList()
    tags: LocalList = LocalList()
    imageUrl: str = ""
    gallery: List[str] = []


@api_router.get("/projects")
async def list_projects():
    return await db.projects.find({}, {"_id": 0}).sort("order", 1).to_list(500)


@api_router.get("/projects/{project_id}")
async def get_project(project_id: str):
    doc = await db.projects.find_one({"id": project_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Projet introuvable")
    return doc


@api_router.post("/admin/projects", status_code=201)
async def create_project(payload: ProjectIn, user: dict = Depends(get_current_user)):
    if payload.category not in PROJECT_CATEGORIES:
        raise HTTPException(status_code=422, detail="Catégorie invalide")
    if await db.projects.find_one({"id": payload.id}):
        raise HTTPException(status_code=409, detail="Un projet avec cet identifiant existe déjà")
    doc = payload.model_dump()
    doc["order"] = await db.projects.count_documents({})
    doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.projects.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.put("/admin/projects/{project_id}")
async def update_project(project_id: str, payload: ProjectIn, user: dict = Depends(get_current_user)):
    if payload.category not in PROJECT_CATEGORIES:
        raise HTTPException(status_code=422, detail="Catégorie invalide")
    doc = payload.model_dump()
    doc["id"] = project_id
    doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    res = await db.projects.update_one({"id": project_id}, {"$set": doc})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Projet introuvable")
    return await db.projects.find_one({"id": project_id}, {"_id": 0})


@api_router.delete("/admin/projects/{project_id}")
async def delete_project(project_id: str, user: dict = Depends(get_current_user)):
    res = await db.projects.delete_one({"id": project_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Projet introuvable")
    return {"ok": True}


@api_router.get("/admin/messages")
async def admin_messages(limit: int = 100, user: dict = Depends(get_current_user)):
    limit = max(1, min(500, limit))
    return await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)


async def seed_admin() -> None:
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Admin user seeded: %s", admin_email)
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )
        logger.info("Admin password updated from env: %s", admin_email)


@app.on_event("startup")
async def startup_seed():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.projects.create_index("id", unique=True)
    await seed_admin()
    if await db.projects.count_documents({}) == 0:
        seed_path = ROOT_DIR / "seed_projects.json"
        if seed_path.exists():
            projects = json.loads(seed_path.read_text(encoding="utf-8"))
            for i, p in enumerate(projects):
                p["order"] = i
            if projects:
                await db.projects.insert_many(projects)
                logger.info("Seeded %d projects", len(projects))


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