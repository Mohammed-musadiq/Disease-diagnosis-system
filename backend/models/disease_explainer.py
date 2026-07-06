import requests
from typing import Dict

API_URL = "https://ai-doctor-api-ai-medical-chatbot-healthcare-ai-assistant.p.rapidapi.com/chat?noqueue=1"
API_KEY = "c35563ee3emsha09c450cd05e8ddp186724jsne707ba708f95"
API_HOST = "ai-doctor-api-ai-medical-chatbot-healthcare-ai-assistant.p.rapidapi.com"

HEADERS = {
    "Content-Type": "application/json",
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": API_HOST
}

def explain_disease(name: str) -> Dict:
    """
    Sends a disease name to the AI Doctor API and returns a patient-friendly explanation.

    Args:
        name (str): The disease name (e.g., "Melanoma")

    Returns:
        Dict: {
            "name": "Melanoma",
            "explanation": "Melanoma is a serious skin cancer..."
        }
    """
    payload = {
        "message": f"What is {name}? Explain causes, symptoms, treatment, and prevention.",
        "specialization": "dermatology",
        "language": "en"
    }

    try:
        response = requests.post(API_URL, headers=HEADERS, json=payload)
        response.raise_for_status()
        data = response.json()

        # ✅ Print raw response for debugging
        print("API raw response:", data)

        # ✅ Adjust this based on actual response structure
        explanation = (
            data.get("result", {}).get("response", {}).get("message") or
            data.get("message") or
            "No explanation available."
        )

        return {
            "name": name,
            "explanation": explanation
        }

    except requests.exceptions.RequestException as e:
        return {
            "name": name,
            "explanation": f"Error fetching explanation: {str(e)}"
        }