"""
Statistics and Hypothesis Testing router providing descriptive metrics,
fitted continuous distributions, Q-Q plots, and formal inferential tests.
"""

import os
import json
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/stats", tags=["statistics"])
PROCESSED_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data", "processed")

@router.get("/distributions")
def get_distribution_stats():
    path = os.path.join(PROCESSED_DIR, "distribution_stats.json")
    if not os.path.exists(path):
        raise HTTPException(status_code=500, detail="Distribution statistics not generated yet.")
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return {
        "source": "US Bureau of Transportation Statistics (BTS) 2023 Reporting Carrier Performance",
        "sample_size": data.get("sample_size"),
        "period": "January 2023 Full Operations (538,837 flights)",
        "metrics": {
            "mean_delay_minutes": data.get("mean"),
            "median_delay_minutes": data.get("median"),
            "variance": data.get("variance"),
            "standard_deviation": data.get("std_dev"),
            "skewness": data.get("skewness"),
            "kurtosis": data.get("kurtosis"),
            "q25_first_quartile": data.get("q25"),
            "q75_third_quartile": data.get("q75"),
            "interquartile_range_iqr": data.get("iqr")
        },
        "lognorm_fitted_parameters": data.get("lognorm_params"),
        "histogram_bins": data.get("histogram"),
        "qq_plot_points": data.get("qq_plot")
    }

@router.get("/hypothesis-tests")
def get_hypothesis_tests():
    path = os.path.join(PROCESSED_DIR, "hypothesis_tests.json")
    if not os.path.exists(path):
        raise HTTPException(status_code=500, detail="Hypothesis tests not generated yet.")
    with open(path, "r", encoding="utf-8") as f:
        tests = json.load(f)
    return {
        "source": "US Bureau of Transportation Statistics (BTS) 2023 Full Population Sample",
        "significance_threshold_alpha": 0.05,
        "tests": tests
    }
