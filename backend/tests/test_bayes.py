import pytest
from app.services.bayes_engine import (
    wilson_score_interval,
    compute_step_by_step_bayes,
    calculate_expected_delay,
)

def test_wilson_score_interval_properties():
    # Test valid bounds
    res = wilson_score_interval(p_hat=0.20, n=1000, confidence=0.95)
    assert 0.0 <= res["low"] <= res["p_hat"] <= res["high"] <= 1.0
    assert res["n"] == 1000

    # Test edge case with n = 0
    res_zero = wilson_score_interval(p_hat=0.5, n=0)
    assert res_zero["low"] == 0.0
    assert res_zero["high"] == 1.0

def test_bayes_theorem_posteriors_sum():
    priors = {"On-Time": 0.78, "Delayed": 0.20, "Cancelled": 0.02}
    likelihoods = {"On-Time": 0.05, "Delayed": 0.40, "Cancelled": 0.80}
    
    result = compute_step_by_step_bayes(priors, likelihoods, "Severe Fog / Low Visibility")
    
    posteriors = result["step_5_posteriors"]
    total = sum(posteriors.values())
    
    # Probabilities must sum to approximately 1
    assert abs(total - 1.0) < 0.01
    
    # Severe weather should increase cancellation and delay probability relative to priors
    assert posteriors["Delayed"] > priors["Delayed"]
    assert posteriors["Cancelled"] > priors["Cancelled"]

def test_expected_delay_calculation():
    # When all flights are on-time, expected delay should be 0.0
    res_ontime = calculate_expected_delay(p_ontime=1.0, p_delayed=0.0, p_cancelled=0.0)
    assert res_ontime["expected_delay_minutes"] == 0.0

    # When delay probability is high, expected delay should be significant
    res_delayed = calculate_expected_delay(p_ontime=0.1, p_delayed=0.85, p_cancelled=0.05)
    assert res_delayed["expected_delay_minutes"] > 30.0
    assert res_delayed["delay_if_delayed"]["median_minutes"] > 0
