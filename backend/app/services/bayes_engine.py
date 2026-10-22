"""
Bayes' Theorem, Law of Total Probability, Wilson Score Confidence Intervals,
and Expected Delay formulations.
"""

import math
import numpy as np

def wilson_score_interval(p_hat: float, n: int, confidence: float = 0.95) -> dict:
    """
    Computes Wilson score confidence interval for a binomial proportion.
    Formula:
      center = (p_hat + z^2 / (2n)) / (1 + z^2 / n)
      margin = (z * sqrt(p_hat*(1-p_hat)/n + z^2/(4*n^2))) / (1 + z^2/n)
    """
    if n <= 0:
        return {"low": 0.0, "high": 1.0, "p_hat": p_hat, "n": n, "margin": 0.5}
    
    # 95% two-tailed critical value
    z = 1.959963984540054
    if confidence == 0.99:
        z = 2.5758293035489004
    elif confidence == 0.90:
        z = 1.6448536269514722
        
    p_hat = max(0.0, min(1.0, float(p_hat)))
    denominator = 1.0 + (z**2) / n
    center = (p_hat + (z**2) / (2.0 * n)) / denominator
    spread = z * math.sqrt((p_hat * (1.0 - p_hat) / n) + ((z**2) / (4.0 * (n**2))))
    margin = spread / denominator
    
    low = max(0.0, center - margin)
    high = min(1.0, center + margin)
    
    return {
        "p_hat": round(p_hat, 4),
        "low": round(low, 4),
        "high": round(high, 4),
        "margin": round(margin, 4),
        "n": int(n),
        "confidence": confidence
    }

def compute_step_by_step_bayes(
    priors: dict,
    likelihoods: dict,
    condition_name: str
) -> dict:
    """
    Step-by-step Bayes theorem calculation:
    P(Y_i | C) = [ P(C | Y_i) * P(Y_i) ] / P(C)
    where P(C) = sum_j [ P(C | Y_j) * P(Y_j) ]
    """
    classes = ["On-Time", "Delayed", "Cancelled"]
    
    # Step 1: Priors
    step1_priors = {cls: float(priors.get(cls, 0.333)) for cls in classes}
    total_prior = sum(step1_priors.values())
    step1_priors = {cls: p / total_prior for cls, p in step1_priors.items()}
    
    # Step 2: Likelihoods P(C | Y)
    step2_likelihoods = {cls: float(likelihoods.get(cls, 0.333)) for cls in classes}
    
    # Step 3: Numerators / Joint Probabilities P(C ∩ Y) = P(C | Y) * P(Y)
    joint_numerators = {}
    for cls in classes:
        joint_numerators[cls] = step2_likelihoods[cls] * step1_priors[cls]
        
    # Step 4: Marginal Evidence P(C) = sum(joint_numerators)
    marginal_evidence = sum(joint_numerators.values())
    if marginal_evidence <= 0:
        marginal_evidence = 1e-9
        
    # Step 5: Posterior Probabilities P(Y | C) = Joint / Evidence
    posteriors = {}
    for cls in classes:
        post = joint_numerators[cls] / marginal_evidence
        posteriors[cls] = max(0.001, min(0.998, post))
        
    total_post = sum(posteriors.values())
    posteriors = {cls: round(p / total_post, 4) for cls, p in posteriors.items()}
    
    return {
        "condition": condition_name,
        "step_1_priors": {cls: round(val, 4) for cls, val in step1_priors.items()},
        "step_2_likelihoods": {cls: round(val, 4) for cls, val in step2_likelihoods.items()},
        "step_3_joint_probabilities": {cls: round(val, 6) for cls, val in joint_numerators.items()},
        "step_4_marginal_evidence": round(marginal_evidence, 6),
        "step_5_posteriors": posteriors,
        "mathematical_formula": "P(Class | Condition) = [ P(Condition | Class) * P(Class) ] / sum_k [ P(Condition | Class_k) * P(Class_k) ]"
    }

def calculate_expected_delay(
    p_ontime: float,
    p_delayed: float,
    p_cancelled: float,
    mean_delay_given_delayed: float = 58.4,
    lognorm_mu: float = 3.65,
    lognorm_sigma: float = 0.78
) -> dict:
    """
    Computes Expected Arrival Delay (minutes) and Log-Normal distribution intervals.
    E[Delay] = P(Delayed) * E[Delay | Delayed] + P(On-Time) * 0
    """
    expected_minutes = round(p_delayed * mean_delay_given_delayed, 1)
    
    # Log-Normal prediction intervals for delay if delayed
    # quantiles for 80% (10% to 90%) and 95% (2.5% to 97.5%)
    z_80 = 1.28155
    z_95 = 1.95996
    
    delay_median = round(math.exp(lognorm_mu), 1)
    p10 = round(math.exp(lognorm_mu - z_80 * lognorm_sigma), 1)
    p90 = round(math.exp(lognorm_mu + z_80 * lognorm_sigma), 1)
    p025 = round(math.exp(lognorm_mu - z_95 * lognorm_sigma), 1)
    p975 = round(math.exp(lognorm_mu + z_95 * lognorm_sigma), 1)
    
    return {
        "expected_delay_minutes": expected_minutes,
        "conditional_mean_delay": round(mean_delay_given_delayed, 1),
        "delay_if_delayed": {
            "median_minutes": delay_median,
            "interval_80_pct": [p10, p90],
            "interval_95_pct": [p025, p975]
        }
    }
