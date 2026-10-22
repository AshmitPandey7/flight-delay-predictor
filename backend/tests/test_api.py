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
