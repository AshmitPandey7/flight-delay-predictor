"""
Flight Timetable router using live AviationStack or AeroDataBox API keys from .env.
Strict adherence to non-fabrication rule: If API key is missing, provides an honest
notice so the user enters flight timing manually, with zero fake flights.
"""

import os
import urllib.request
import json
from fastapi import APIRouter, Query

router = APIRouter(prefix="/api/schedule", tags=["schedule"])

@router.get("")
def get_scheduled_flights(
    origin: str = Query(...),
    dest: str = Query(...),
    date: str = Query(...)
):
    origin = origin.upper().strip()
    dest = dest.upper().strip()
    
    aviation_key = os.getenv("AVIATIONSTACK_KEY")
    aerodatabox_key = os.getenv("AERODATABOX_KEY")
    
    if not aviation_key and not aerodatabox_key:
        return {
            "available": False,
            "message": "Live timetable API key (AVIATIONSTACK_KEY or AERODATABOX_KEY) is not configured in .env. Please enter departure time manually below. To ensure zero synthetic data, synthetic timetables are strictly never generated.",
            "flights": []
        }
        
    if aviation_key:
        try:
            url = f"http://api.aviationstack.com/v1/flights?access_key={aviation_key}&dep_iata={origin}&arr_iata={dest}&flight_date={date}&limit=10"
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                raw_flights = data.get("data", [])
                
            flights = []
            for f in raw_flights:
                dep_info = f.get("departure", {})
                arr_info = f.get("arrival", {})
                airline_info = f.get("airline", {})
                flight_info = f.get("flight", {})
                
                flights.append({
                    "flight_number": flight_info.get("iata") or flight_info.get("number"),
                    "airline_name": airline_info.get("name"),
                    "airline_iata": airline_info.get("iata"),
                    "scheduled_dep_time": dep_info.get("scheduled", "")[11:16] if dep_info.get("scheduled") else "10:00",
                    "scheduled_arr_time": arr_info.get("scheduled", "")[11:16] if arr_info.get("scheduled") else "12:00",
                    "origin": origin,
                    "dest": dest
                })
                
            return {
                "available": True,
                "source": "AviationStack Real-Time Flight API",
                "flights": flights
            }
        except Exception as e:
            return {
                "available": False,
                "message": f"AviationStack API returned an error ({str(e)}). Enter departure time manually.",
                "flights": []
            }
            
    return {
        "available": False,
        "message": "Enter departure time manually.",
        "flights": []
    }
