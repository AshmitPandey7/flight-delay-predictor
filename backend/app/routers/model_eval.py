"""
Model Evaluation router providing calibration curves, Brier scores, and accuracy metrics.
"""
import os
import json
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/model-eval", tags=["model-eval"])
PROCESSED_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data", "processed")

@router.get("/metrics")
def get_model_metrics():
    path = os.path.join(PROCESSED_DIR, "model_metrics.json")
    if not os.path.exists(path):
        raise HTTPException(status_code=500, detail="Model metrics not found.")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)
