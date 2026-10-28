"""
End-to-End User Journey & Edge Case Testing Suite.
Tests:
1. Login -> Search Chennai (MAA) to Mumbai (BOM)
2. View flight results & verify delay probability prediction properties
3. Compare flights side-by-side
4. View statistical evaluation metrics and hypothesis tests
5. Edge cases: invalid airports, unsupported routes, missing weather
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_complete_user_journey_chennai_to_mumbai():
    # Step 1: Login via Faculty Demo Mode
    login_resp = client.post("/api/user/login", json={"is_faculty_demo": True})
    assert login_resp.status_code == 200
    user_data = login_resp.json()
    assert user_data["user"]["name"] == "Dr. Sharma"
    assert user_data["user"]["is_demo"] is True
    assert user_data["user"]["preferences"]["preferred_origin"] == "MAA"

    # Step 2: Search Chennai (MAA) to Mumbai (BOM)
    search_payload = {
        "origin": "MAA",
        "destination": "BOM",
        "departure_date": "2026-11-20",
        "trip_type": "one-way",
        "cabin_class": "Economy",
        "passengers": {"adults": 1, "children": 0, "infants": 0},
        "special_fare": "regular"
    }
    search_resp = client.post("/api/flights/search", json=search_payload)
    assert search_resp.status_code == 200
    res_data = search_resp.json()
    assert res_data["total_count"] > 0
    assert res_data["origin"]["iata"] == "MAA"
    assert res_data["destination"]["iata"] == "BOM"

    # Step 3: View flights and check delay probability properties
    flights = res_data["flights"]
    assert len(flights) >= 8

    # Verify at least one flight has Smart Recommendation flag
    smart_recommended = [f for f in flights if f.get("is_smart_recommended")]
    assert len(smart_recommended) == 1
    assert "Smart Recommendation" in smart_recommended[0]["recommendation_reason"]

    for fl in flights:
        pred = fl["prediction"]
        probs = pred["probabilities"]
        # Probabilities must sum to ~100%
        prob_sum = probs["ontime"] + probs["delayed"] + probs["cancelled"]
        assert 99.0 <= prob_sum <= 101.0, f"Probabilities did not sum to 100%: {prob_sum}"

        # Risk level must be one of Low, Moderate, High
        assert pred["risk_level"] in ["Low", "Moderate", "High"]
        assert pred["expected_delay_minutes"] >= 0

        # Booking links must exist
        assert "makemytrip" in fl["booking_links"]
        assert "airline_direct" in fl["booking_links"]

    # Step 4: Compare Flights (Select first 3 flights)
    comp_flights = flights[:3]
    comp_resp = client.post("/api/flights/compare", json={
        "flight_ids": [f["id"] for f in comp_flights],
        "flights": comp_flights
    })
    assert comp_resp.status_code == 200
    comp_data = comp_resp.json()
    assert comp_data["compared_count"] == 3
    assert "best_price_flight_id" in comp_data
    assert "lowest_delay_risk_flight_id" in comp_data

    # Step 5: View Statistical Insights & Audit
    metrics_resp = client.get("/api/model-eval/metrics")
    assert metrics_resp.status_code == 200
    metrics_data = metrics_resp.json()
    assert metrics_data["anti_leakage_audit_passed"] is True
    assert "logistic_regression_calibrated" in metrics_data
    assert metrics_data["logistic_regression_calibrated"]["accuracy"] > 0.70

    hypo_resp = client.get("/api/stats/hypothesis-tests")
    assert hypo_resp.status_code == 200
    hypo_data = hypo_resp.json()
    assert len(hypo_data["tests"]) == 5

def test_edge_case_unsupported_remote_route():
    # Test route with unknown non-standard airports (outside US training set)
    # Model should gracefully fallback to prior without crashing
    payload = {
        "origin": "IXZ", # Port Blair
        "destination": "DEL",
        "departure_date": "2026-12-10",
        "trip_type": "one-way",
        "cabin_class": "Economy"
    }
    resp = client.post("/api/flights/search", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_count"] > 0
    first_fl = data["flights"][0]
    # Prediction should have DGCA fallback badge
    assert first_fl["prediction"]["is_outside_training_data"] is True
    assert "DGCA" in first_fl["prediction"]["confidence_badge"]

def test_edge_case_empty_or_invalid_comparison():
    # Comparing fewer than 2 flights should return HTTP 400
    resp = client.post("/api/flights/compare", json={
        "flight_ids": ["F1"],
        "flights": [{"id": "F1"}]
    })
    assert resp.status_code == 400

def test_edge_case_missing_weather():
    # Predict flight with None or empty weather
    payload = {
        "origin": "MAA",
        "dest": "BOM",
        "carrier": "6E",
        "dep_time": "12:00",
        "dep_date": "2026-11-25",
        "weather": None
    }
    resp = client.post("/api/predict", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "probabilities" in data
    assert data["probabilities"]["ontime"]["probability"] > 0
