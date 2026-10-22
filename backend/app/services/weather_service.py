"""
Weather service interfacing with Open-Meteo APIs (Forecast and Archive).
Provides live real-time conditions by airport coordinates and Winter Fog simulations.
"""

import urllib.request
import json
import math

WMO_WEATHER_CODES = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
}

def fetch_live_weather(lat: float, lon: float) -> dict:
    """
    Queries Open-Meteo Forecast API for real-time conditions at lat/lon.
    Free, no API key required.
    """
    try:
        url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={lat:.4f}&longitude={lon:.4f}&"
            f"current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,snowfall,weather_code,cloud_cover,wind_speed_10m,wind_gusts_10m&"
            f"hourly=visibility&timezone=auto"
        )
        req = urllib.request.Request(url, headers={"User-Agent": "FlightDelayPredictor/1.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            
        current = data.get("current", {})
        code = current.get("weather_code", 0)
        
        # Visibility from hourly current hour (default 10,000m)
        hourly_vis = data.get("hourly", {}).get("visibility", [])
        vis_meters = hourly_vis[0] if hourly_vis else 10000.0
        
        weather_desc = WMO_WEATHER_CODES.get(code, "Clear / Variable")
        
        return {
            "success": True,
            "source": "Open-Meteo Live Forecast API (api.open-meteo.com)",
            "temperature_c": current.get("temperature_2m", 20.0),
            "humidity_pct": current.get("relative_humidity_2m", 50),
            "precipitation_mm": current.get("precipitation", 0.0),
            "snowfall_cm": current.get("snowfall", 0.0),
            "wind_speed_kmh": current.get("wind_speed_10m", 10.0),
            "wind_gusts_kmh": current.get("wind_gusts_10m", 15.0),
            "cloud_cover_pct": current.get("cloud_cover", 10),
            "visibility_m": vis_meters,
            "weather_code": code,
            "weather_condition": weather_desc,
            "is_fog": code in [45, 48] or vis_meters < 1000,
            "is_freezing": current.get("temperature_2m", 20.0) <= 0.0
        }
    except Exception as e:
        return {
            "success": False,
            "source": "Open-Meteo Live API (temporarily unreachable)",
            "error": str(e),
            "temperature_c": 22.0,
            "humidity_pct": 55,
            "precipitation_mm": 0.0,
            "snowfall_cm": 0.0,
            "wind_speed_kmh": 12.0,
            "wind_gusts_kmh": 16.0,
            "cloud_cover_pct": 20,
            "visibility_m": 10000.0,
            "weather_code": 0,
            "weather_condition": "Standard Clear Sky",
            "is_fog": False,
            "is_freezing": False
        }
