from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from PIL import Image
import io
import os

# --- Import Chatbot Router ---
from chatbot.chat_handler import router as chat_router

# --- Import AI Models and Content Provider ---
from models import skin_analyzer, xray_analyzer, mri_analyzer, text_analyzer, content_provider
from models.text_analyzer import predict

# --- (Optional) MongoDB setup example ---
# from config.db import users_collection  # Uncomment if using MongoDB

# --- FastAPI App Setup ---
app = FastAPI(title="Final Project: MedAI Hub")

# Include Chatbot Router
app.include_router(chat_router, prefix="/chatbot", tags=["Chatbot"])

# --- Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Security & JWT Setup ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# --- Pydantic Models ---
class User(BaseModel):
    email: str
    password: str
    role: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TextRequest(BaseModel):
    text: str


# --- Root Endpoint ---
@app.get("/")
def root():
    return {"status": "ok", "message": "MedAI Hub backend with Chatbot running"}


# --- Authentication Endpoints ---
@app.post("/auth/register", response_model=User)
async def register_user(user: User):
    # Example MongoDB integration (uncomment and configure if using)
    # existing_user = await users_collection.find_one({"email": user.email})
    # if existing_user:
    #     raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed_password = pwd_context.hash(user.password)
    user_data = user.dict()
    user_data["password"] = hashed_password

    # Insert into DB (example placeholder)
    # new_user = await users_collection.insert_one(user_data)
    # created_user = await users_collection.find_one({"_id": new_user.inserted_id})
    # return created_user
    return user_data  # Placeholder return (no DB)


@app.post("/auth/login", response_model=Token)
async def login_user(form_data: User):
    # Example MongoDB integration (uncomment and configure if using)
    # user = await users_collection.find_one({"email": form_data.email})
    # if not user or not pwd_context.verify(form_data.password, user["password"]):
    #     raise HTTPException(status_code=401, detail="Incorrect email or password")

    # Generate JWT token
    access_token = create_access_token(data={"sub": form_data.email, "role": form_data.role})
    return {"access_token": access_token, "token_type": "bearer"}


# --- Helper Function for Image-Based Models ---
async def process_image_request(file: UploadFile, analyzer):
    try:
        content = await file.read()
        img = Image.open(io.BytesIO(content))
        result = analyzer.predict(img)
        result['confidence'] = float(result['confidence'])
        for item in result['ranked']:
            item['prob'] = float(item['prob'])
        return JSONResponse({
            "success": True,
            "result": result,
            "disclaimer": "This is a prototype. Consult a medical professional."
        })
    except Exception as e:
        return JSONResponse({"success": False, "error": str(e)}, status_code=500)


# --- AI Analysis Endpoints ---
@app.post("/predict/skin")
async def predict_skin(file: UploadFile = File(...)):
    return await process_image_request(file, skin_analyzer)


@app.post("/predict/xray")
async def predict_xray(file: UploadFile = File(...)):
    return await process_image_request(file, xray_analyzer)


@app.post("/predict/mri")
async def predict_mri(file: UploadFile = File(...)):
    return await process_image_request(file, mri_analyzer)


@app.post("/predict/text")
async def predict_text(request: TextRequest):
    result = predict(request.text)
    return {
        "success": True,
        "result": result,
        "disclaimer": "This is a prototype."
    }


# --- Wellness Hub Content Endpoints ---
@app.get("/content/workouts")
async def get_workouts_library():
    return content_provider.get_all_workouts()


@app.get("/content/diets")
async def get_diets_library():
    return content_provider.get_all_diets()


@app.get("/content/suggestion")
async def get_daily_suggestion():
    return content_provider.get_daily_suggestion()
