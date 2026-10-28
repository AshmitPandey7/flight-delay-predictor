"""
Flight Search & Booking router handling MakeMyTrip-style flight queries,
delay probability annotations, flight comparisons, and external booking redirects.
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from ..services.flight_search_service import flight_search_service

router = APIRouter(prefix="/api/flights", tags=["flights"])

class PassengersInput(BaseModel):
    adults: int = 1
    children: int = 0
    infants: int = 0

class FlightSearchRequest(BaseModel):
    origin: str = Field(..., description="Origin Airport IATA (e.g. MAA, BOM, DEL)")
    destination: str = Field(..., description="Destination Airport IATA (e.g. BOM, BLR)")
    departure_date: str = Field(..., description="YYYY-MM-DD")
    return_date: Optional[str] = None
    trip_type: str = "one-way" # "one-way" or "round-trip"
    cabin_class: str = "Economy" # "Economy", "Premium Economy", "Business", "First"
    passengers: Optional[PassengersInput] = None
    special_fare: str = "regular" # "regular", "student", "senior", "armed_forces"

@router.post("/search")
def search_flights(req: FlightSearchRequest):
    try:
        pax_dict = req.passengers.dict() if req.passengers else {"adults": 1, "children": 0, "infants": 0}
        results = flight_search_service.search_flights(
            origin_iata=req.origin,
            dest_iata=req.destination,
            dep_date=req.departure_date,
            cabin_class=req.cabin_class,
            trip_type=req.trip_type,
            passengers=pax_dict,
            special_fare=req.special_fare
        )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Flight search failed: {str(e)}")

class FlightCompareRequest(BaseModel):
    flight_ids: List[str]
    flights: List[Dict[str, Any]]

@router.post("/compare")
def compare_flights(req: FlightCompareRequest):
    """
    Returns side-by-side comparison metrics for up to 4 selected flights.
    """
    if len(req.flights) < 2:
        raise HTTPException(status_code=400, detail="At least 2 flights are required for comparison.")
        
    sorted_by_price = sorted(req.flights, key=lambda x: x["price_inr"])
    sorted_by_delay = sorted(req.flights, key=lambda x: x["prediction"]["probabilities"]["delayed"])
    sorted_by_duration = sorted(req.flights, key=lambda x: x["duration_minutes"])
    
    return {
        "compared_count": len(req.flights),
        "best_price_flight_id": sorted_by_price[0]["id"],
        "lowest_delay_risk_flight_id": sorted_by_delay[0]["id"],
        "fastest_flight_id": sorted_by_duration[0]["id"],
        "flights": req.flights
    }
