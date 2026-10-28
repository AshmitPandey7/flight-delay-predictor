"""
Prediction router computing calibrated probabilities, Wilson 95% CIs,
expected delay duration, risk classification, and step-by-step Bayes breakdown.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from ..services.model_service import model_service

router = APIRouter(prefix="/api/predict", tags=["prediction"])

class WeatherInput(BaseModel):
    preset: Optional[str] = None # "clear", "moderate", "severe", "winter_fog", "high_winds"
    temperature_c: Optional[float] = 20.0
    precipitation_mm: Optional[float] = 0.0
    snowfall_cm: Optional[float] = 0.0
    wind_speed_kmh: Optional[float] = 10.0
    visibility_m: Optional[float] = 10000.0
    cloud_cover_pct: Optional[float] = 10.0
    weather_code: Optional[int] = 0
    is_winter_fog: Optional[bool] = False

class PredictRequest(BaseModel):
    origin: str = Field(..., description="Departure Airport IATA code (e.g. DEL, ORD, MAA)")
    dest: str = Field(..., description="Arrival Airport IATA code (e.g. BOM, LGA, BLR)")
    carrier: str = Field(..., description="Airline Code or Name (e.g. 6E, AA, DL, AI, IndiGo)")
    dep_time: str = Field(..., description="Scheduled Departure Time (HH:MM)")
    dep_date: str = Field(..., description="Date of Departure (YYYY-MM-DD)")
    weather: Optional[WeatherInput] = None

@router.post("")
def predict_flight(req: PredictRequest):
    weather_dict = req.weather.dict() if req.weather else {}
    
    # Apply standard condition presets if specified
    preset = weather_dict.get("preset")
    if preset == "clear":
        weather_dict.update({"temperature_c": 22.0, "precipitation_mm": 0.0, "snowfall_cm": 0.0, "wind_speed_kmh": 10.0, "visibility_m": 10000.0, "is_winter_fog": False})
    elif preset == "moderate":
        weather_dict.update({"temperature_c": 18.0, "precipitation_mm": 6.0, "snowfall_cm": 0.0, "wind_speed_kmh": 26.0, "visibility_m": 3200.0, "is_winter_fog": False})
    elif preset == "severe":
        weather_dict.update({"temperature_c": 4.0, "precipitation_mm": 22.0, "snowfall_cm": 2.0, "wind_speed_kmh": 46.0, "visibility_m": 600.0, "is_winter_fog": False})
    elif preset == "winter_fog":
        weather_dict.update({"temperature_c": 7.0, "precipitation_mm": 0.0, "snowfall_cm": 0.0, "wind_speed_kmh": 6.0, "visibility_m": 350.0, "is_winter_fog": True})
    elif preset == "high_winds":
        weather_dict.update({"temperature_c": 19.0, "precipitation_mm": 3.0, "snowfall_cm": 0.0, "wind_speed_kmh": 54.0, "visibility_m": 4500.0, "is_winter_fog": False})
    elif not weather_dict:
        weather_dict = {
            "temperature_c": 20.0,
            "precipitation_mm": 0.0,
            "snowfall_cm": 0.0,
            "wind_speed_kmh": 10.0,
            "visibility_m": 10000.0,
            "is_winter_fog": False
        }
    
    result = model_service.predict(
        origin=req.origin,
        dest=req.dest,
        carrier=req.carrier,
        dep_time=req.dep_time,
        dep_date=req.dep_date,
        weather=weather_dict
    )
    
    return result
