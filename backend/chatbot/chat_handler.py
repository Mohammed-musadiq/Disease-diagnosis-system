from openai import OpenAI
from fastapi import APIRouter, Request

router = APIRouter()

@router.post("/chat")
async def chat(request: Request):
    body = await request.json()
    messages = body.get("messages", [])

    # Call OpenAI or your own model
    response = call_openai(messages)  # You can define this function

    return {"response": response}