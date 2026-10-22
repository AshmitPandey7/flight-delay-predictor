"""
Airports router providing search and autocomplete across 3,000+ real commercial airports.
"""

from fastapi import APIRouter, Query
from typing import List, Optional
from ..services.model_service import model_service

router = APIRouter(prefix="/api/airports", tags=["airports"])

@router.get("/search")
def search_airports(q: str = Query(..., min_length=1)):
    q = q.strip().lower()
    matches = []
    
    # Check IATA exact matches first, then city/name
    for a in model_service.airports_lite:
        iata = a["iata"].lower()
        city = a["city"].lower()
        name = a["name"].lower()
        country = a["country"].lower()
        
        score = 0
        if iata == q:
            score = 100
        elif iata.startswith(q):
            score = 80
        elif city.startswith(q):
            score = 60
        elif q in city:
            score = 40
        elif q in name:
            score = 20
            
        if score > 0:
            matches.append((score, a))
            
    # Sort by score descending and return top 15
    matches.sort(key=lambda x: x[0], reverse=True)
    return [m[1] for m in matches[:15]]

@router.get("/popular")
def get_popular_airports():
    # Return featured Indian and US hubs
    featured_iatas = [
        "DEL", "BOM", "BLR", "HYD", "MAA", "CCU", "AMD", "COK", "GOI", "PNQ", "JAI", "LKO", # India
        "JFK", "ORD", "LAX", "ATL", "DFW", "SFO", "SEA", "BOS", "MIA" # US
    ]
    return [model_service.airports[i] for i in featured_iatas if i in model_service.airports]
