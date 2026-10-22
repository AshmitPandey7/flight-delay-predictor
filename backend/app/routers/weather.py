"""
Weather router querying live Open-Meteo observations by airport IATA code or lat/lon.
"""

from fastapi import APIRouter, Query, HTTPException
from ..services.weather_service import fetch_live_weather
from ..services.model_service import model_service

router = APIRouter(prefix="/api/weather", tags=["weather"])

@router.get("")
def get_weather_by_airport(iata: str = Query(...)):
    iata = iata.upper().strip()
    airport_info = model_service.airports.get(iata)
    
    if not airport_info:
        raise HTTPException(status_code=404, detail=f"Airport IATA code '{iata}' not found in OurAirports database.")
        
    lat = airport_info["lat"]
    lon = airport_info["lon"]
    weather = fetch_live_weather(lat, lon)
    weather["airport_iata"] = iata
    weather["airport_name"] = airport_info["name"]
    weather["city"] = airport_info["city"]
    weather["country"] = airport_info["country"]
    weather["coordinates"] = {"lat": lat, "lon": lon}
    
    return weather
