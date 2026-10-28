"""
User Authentication, Personalization, Preferences, and Demo/Faculty Mode Router.
"""

import json
import os
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

router = APIRouter(prefix="/api/user", tags=["user"])

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data", "processed")
USER_DB_PATH = os.path.join(DATA_DIR, "users.json")

# Pre-seeded Faculty Demo Profile for quick evaluation demonstrations
FACULTY_DEMO_USER = {
    "id": "faculty_demo_01",
    "name": "Dr. Sharma",
    "email": "faculty.demo@university.edu",
    "role": "Faculty Evaluator (Demo Mode)",
    "is_demo": True,
    "preferences": {
        "preferred_origin": "MAA",
        "preferred_origin_city": "Chennai",
        "preferred_destination": "BOM",
        "preferred_destination_city": "Mumbai",
        "preferred_airline": "6E",
        "cabin_class": "Economy",
        "default_adults": 1,
        "special_fare": "regular"
    },
    "recent_searches": [
        {
            "origin": "MAA",
            "origin_city": "Chennai",
            "destination": "BOM",
            "destination_city": "Mumbai",
            "date": "2026-11-15",
            "searched_at": "Today, 10:30 AM"
        },
        {
            "origin": "DEL",
            "origin_city": "New Delhi",
            "destination": "BLR",
            "destination_city": "Bengaluru",
            "date": "2026-11-20",
            "searched_at": "Yesterday"
        },
        {
            "origin": "BOM",
            "origin_city": "Mumbai",
            "destination": "AMD",
            "destination_city": "Ahmedabad",
            "date": "2026-12-05",
            "searched_at": "3 days ago"
        }
    ],
    "saved_flights": [
        {
            "id": "saved_01",
            "flight_number": "6E 2041",
            "airline": "IndiGo",
            "route": "MAA → BOM",
            "dep_time": "06:15",
            "price_inr": 4250,
            "ontime_pct": 84.2,
            "risk_level": "Low"
        }
    ],
    "prediction_history": [
        {
            "flight": "6E 2041 (MAA → BOM)",
            "date": "2026-11-15",
            "ontime_prob": "84.2%",
            "delayed_prob": "13.6%",
            "cancelled_prob": "2.2%",
            "risk": "Low",
            "timestamp": "2026-10-29 08:30"
        },
        {
            "flight": "AI 572 (DEL → BOM)",
            "date": "2026-12-20",
            "ontime_prob": "58.1%",
            "delayed_prob": "36.4%",
            "cancelled_prob": "5.5%",
            "risk": "Moderate",
            "timestamp": "2026-10-28 14:15"
        }
    ]
}

# In-memory session store (seeded with faculty demo)
ACTIVE_SESSIONS: Dict[str, Dict[str, Any]] = {
    "faculty_demo_token": FACULTY_DEMO_USER
}

class LoginRequest(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None
    is_faculty_demo: bool = False

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    preferred_origin: Optional[str] = "MAA"
    cabin_class: Optional[str] = "Economy"

class PreferencesRequest(BaseModel):
    preferred_origin: str
    preferred_origin_city: Optional[str] = ""
    preferred_destination: Optional[str] = ""
    preferred_destination_city: Optional[str] = ""
    cabin_class: str = "Economy"
    default_adults: int = 1
    preferred_airline: Optional[str] = "6E"
    special_fare: str = "regular"

class SaveSearchRequest(BaseModel):
    origin: str
    origin_city: str
    destination: str
    destination_city: str
    date: str

class SaveFlightRequest(BaseModel):
    flight_id: str
    flight_data: Dict[str, Any]

@router.post("/login")
def login(req: LoginRequest):
    if req.is_faculty_demo or (req.email and "demo" in req.email.lower()):
        return {
            "token": "faculty_demo_token",
            "user": FACULTY_DEMO_USER,
            "message": "Logged in as Faculty Evaluator (Demo Mode)"
        }
        
    # Standard user login
    token = f"user_{hash(req.email)}"
    user_data = {
        "id": token,
        "name": req.email.split("@")[0].capitalize() if req.email else "Traveler",
        "email": req.email or "traveler@example.com",
        "role": "Standard User",
        "is_demo": False,
        "preferences": {
            "preferred_origin": "MAA",
            "preferred_origin_city": "Chennai",
            "preferred_destination": "BOM",
            "preferred_destination_city": "Mumbai",
            "preferred_airline": "6E",
            "cabin_class": "Economy",
            "default_adults": 1,
            "special_fare": "regular"
        },
        "recent_searches": [],
        "saved_flights": [],
        "prediction_history": []
    }
    ACTIVE_SESSIONS[token] = user_data
    return {
        "token": token,
        "user": user_data,
        "message": "Login successful"
    }

@router.get("/profile")
def get_profile(token: Optional[str] = "faculty_demo_token"):
    user = ACTIVE_SESSIONS.get(token, FACULTY_DEMO_USER)
    return user

@router.post("/preferences")
def update_preferences(req: PreferencesRequest, token: Optional[str] = "faculty_demo_token"):
    user = ACTIVE_SESSIONS.get(token, FACULTY_DEMO_USER)
    user["preferences"] = req.dict()
    return {"status": "success", "preferences": user["preferences"]}

@router.post("/save-search")
def save_search(req: SaveSearchRequest, token: Optional[str] = "faculty_demo_token"):
    user = ACTIVE_SESSIONS.get(token, FACULTY_DEMO_USER)
    new_entry = {
        "origin": req.origin,
        "origin_city": req.origin_city,
        "destination": req.destination,
        "destination_city": req.destination_city,
        "date": req.date,
        "searched_at": datetime.now().strftime("%b %d, %H:%M")
    }
    # Prepend and deduplicate
    user["recent_searches"] = [new_entry] + [s for s in user["recent_searches"] if not (s["origin"] == req.origin and s["destination"] == req.destination)][:5]
    return {"status": "success", "recent_searches": user["recent_searches"]}

@router.post("/save-flight")
def save_flight(req: SaveFlightRequest, token: Optional[str] = "faculty_demo_token"):
    user = ACTIVE_SESSIONS.get(token, FACULTY_DEMO_USER)
    fl = req.flight_data
    saved_item = {
        "id": req.flight_id,
        "flight_number": fl.get("flight_number", "FL 100"),
        "airline": fl.get("airline", {}).get("name", "Airline"),
        "route": f"{fl.get('origin', {}).get('iata', '')} → {fl.get('destination', {}).get('iata', '')}",
        "dep_time": fl.get("dep_time", ""),
        "price_inr": fl.get("price_inr", 0),
        "ontime_pct": fl.get("prediction", {}).get("probabilities", {}).get("ontime", 75),
        "risk_level": fl.get("prediction", {}).get("risk_level", "Low")
    }
    # Check if already saved
    existing = [x for x in user["saved_flights"] if x["id"] == req.flight_id]
    if not existing:
        user["saved_flights"].append(saved_item)
    return {"status": "success", "saved_flights": user["saved_flights"]}

@router.delete("/saved-flights/{flight_id}")
def remove_saved_flight(flight_id: str, token: Optional[str] = "faculty_demo_token"):
    user = ACTIVE_SESSIONS.get(token, FACULTY_DEMO_USER)
    user["saved_flights"] = [x for x in user["saved_flights"] if x["id"] != flight_id]
    return {"status": "success", "saved_flights": user["saved_flights"]}
