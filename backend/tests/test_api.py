import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"

def test_search_airports():
    response = client.get("/api/airports/search?q=DEL")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert any(airport["iata"] == "DEL" for airport in data)

def test_probability_lab_get():
    response = client.get("/api/probability-lab")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert "marginal_outcomes" in data["data"]
    assert "On-Time" in data["data"]["marginal_outcomes"]

def test_probability_lab_query():
    payload = {
        "condition_type": "weather",
        "condition_value": "severe"
    }
    response = client.post("/api/probability-lab/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "condition_label" in data
    assert "p_delayed" in data
    assert "probability" in data["p_delayed"]

def test_predict_endpoint():
    payload = {
        "origin": "JFK",
        "dest": "LAX",
        "carrier": "AA",
        "dep_time": "10:30",
        "dep_date": "2026-11-15",
        "weather": {
            "temperature_c": 15.0,
            "precipitation_mm": 0.0,
            "snowfall_cm": 0.0,
            "wind_speed_kmh": 10.0,
            "visibility_m": 10000.0,
            "cloud_cover_pct": 20.0,
            "weather_code": 0,
            "is_winter_fog": False
        }
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert "probabilities" in res
    assert "expected_delay" in res
    assert "risk_assessment" in res
    
    probs = res["probabilities"]
    total_prob = probs["ontime"]["probability"] + probs["delayed"]["probability"] + probs["cancelled"]["probability"]
    assert abs(total_prob - 1.0) < 0.01

def test_hypothesis_tests_endpoint():
    response = client.get("/api/stats/hypothesis-tests")
    assert response.status_code == 200
    data = response.json()
    assert "tests" in data
    assert "welch_t_test" in data["tests"]
    assert "chi_square_test" in data["tests"]

def test_flight_search_chennai_to_mumbai():
    payload = {
        "origin": "MAA",
        "destination": "BOM",
        "departure_date": "2026-11-20",
        "cabin_class": "Economy",
        "trip_type": "one-way",
        "passengers": {"adults": 1, "children": 0, "infants": 0},
        "special_fare": "regular"
    }
    response = client.post("/api/flights/search", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "flights" in data
    assert len(data["flights"]) > 0
    first_fl = data["flights"][0]
    assert "prediction" in first_fl
    assert "probabilities" in first_fl["prediction"]
    assert "expected_delay_minutes" in first_fl["prediction"]
    assert "booking_links" in first_fl
    assert any(f.get("is_smart_recommended") for f in data["flights"])

def test_faculty_demo_login():
    response = client.post("/api/user/login", json={"is_faculty_demo": True})
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["user"]["is_demo"] is True
    assert data["user"]["name"] == "Dr. Sharma"
    assert data["user"]["preferences"]["preferred_origin"] == "MAA"

def test_flight_comparison():
    search_res = client.post("/api/flights/search", json={
        "origin": "MAA",
        "destination": "BOM",
        "departure_date": "2026-11-20"
    }).json()
    sample_flights = search_res["flights"][:2]
    
    comp_res = client.post("/api/flights/compare", json={
        "flight_ids": [f["id"] for f in sample_flights],
        "flights": sample_flights
    })
    assert comp_res.status_code == 200
    comp_data = comp_res.json()
    assert comp_data["compared_count"] == 2
    assert "best_price_flight_id" in comp_data
    assert "lowest_delay_risk_flight_id" in comp_data
