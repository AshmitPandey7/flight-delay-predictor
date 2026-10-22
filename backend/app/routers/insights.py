"""
Insights router providing official DGCA India aggregate OTP data and US BTS benchmarks.
"""
import os
import json
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/insights", tags=["insights"])
PROCESSED_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data", "processed")

@router.get("/india")
def get_dgca_insights():
    path = os.path.join(PROCESSED_DIR, "dgca_insights.json")
    if not os.path.exists(path):
        raise HTTPException(status_code=500, detail="DGCA data not found.")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/us")
def get_us_insights():
    path = os.path.join(PROCESSED_DIR, "model_artifacts.pkl")
    if not os.path.exists(path):
        raise HTTPException(status_code=500, detail="US stats not found.")
    import pickle
    with open(path, "rb") as f:
        artifacts = pickle.load(f)
    return {
        "carriers": artifacts.get("carrier_stats", {}),
        "airports": artifacts.get("airport_stats", {})
    }
