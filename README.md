# ✈️ Flight Delay & Cancellation Probability Predictor

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.4+-F7931E.svg?style=flat&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?style=flat&logo=python&logoColor=white)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A production-grade, full-stack aviation intelligence web application and statistical engine designed to predict the **probability** of flight disruptions—classifying flights into **On-Time**, **Delayed** (arrival delay > 15 minutes, official BTS standard), and **Cancelled**.

Unlike simplistic binary classifiers, this system models uncertainty through calibrated multinomial probability distributions, Wilson score confidence intervals, empirical prior-likelihood Bayesian updating, and formal parametric distribution fitting.

---

## 🌟 Key Features

* **Calibrated Probability Prediction Engine**:
  * Predicts multi-class probabilities ($P(\text{On-Time})$, $P(\text{Delayed})$, $P(\text{Cancelled})$) instead of opaque labels.
  * Employs **Calibrated Multinomial Logistic Regression** and **Gaussian/Categorical Naive Bayes**.
  * Outputs 95% **Wilson Score Confidence Intervals** on all probabilities alongside exact training sample sizes ($n$).
* **Real-Time Dynamic Weather Integration**:
  * Automatically queries Open-Meteo's weather API using accurate airport latitude/longitude coordinates from OurAirports.
  * Factors in precipitation, wind gusts, visibility, cloud cover, snowfall, and temperature.
* **Winter Fog & Extreme Weather Simulator**:
  * Interactive "What-If" mode allowing travelers to simulate severe conditions (e.g. evaluating a December flight booked in June under CAT III fog conditions).
* **Interactive Probability Lab**:
  * Deep-dive exploration tool for conditional and marginal probabilities ($P(\text{Delay} \mid \text{Rain})$, $P(\text{Cancel} \mid \text{Severe Fog})$, $P(\text{Delay} \cap \text{Evening})$).
  * Dynamic query explorer calculating sample-backed probabilities and confidence bounds.
* **Rigorous Inferential Statistics & Hypothesis Testing**:
  * Welch's $t$-test (Rain vs. Dry delay minutes).
  * Two-proportion $z$-test with confidence intervals.
  * Pearson and Spearman correlation analysis across meteorological variables.
  * Chi-square ($\chi^2$) test of independence between weather severity and flight outcome.
  * Fitted continuous distributions (Log-Normal & Exponential) with Quantile-Quantile (Q-Q) plots and prediction intervals.
* **Dual US & Indian Aviation Scope**:
  * Full dataset coverage for US domestic routes (538,000+ flights).
  * Integrated **DGCA India On-Time Performance (OTP)** reference priors for domestic carriers (IndiGo, Air India, Akasa Air, SpiceJet), featuring intelligent fallback badges when routes are outside the primary US training set.
* **Zero Synthetic Data Guarantee**:
  * All statistical metrics, baseline priors, and models are trained strictly on verified US Bureau of Transportation Statistics (BTS) records and official DGCA publications.

---

## 📐 Mathematical & Statistical Formulations

### 1. Bayesian Posterior Probability
The engine calculates exact posterior probabilities using Bayes' Theorem and the Law of Total Probability:

$$P(\text{Class}_i \mid \text{Condition}) = \frac{P(\text{Condition} \mid \text{Class}_i) \cdot P(\text{Class}_i)}{\sum_{j} P(\text{Condition} \mid \text{Class}_j) \cdot P(\text{Class}_j)}$$

### 2. Wilson Score Confidence Interval
To account for finite sample sizes ($n$) when evaluating proportions ($\hat{p}$), the 95% Wilson interval is computed:

$$w = \frac{\hat{p} + \frac{z^2}{2n} \pm z \sqrt{\frac{\hat{p}(1 - \hat{p})}{n} + \frac{z^2}{4n^2}}}{1 + \frac{z^2}{n}}$$

where $z = 1.96$ for a 95% confidence level.

### 3. Expected Delay Duration
Expected arrival delay in minutes is formulated as:

$$\mathbb{E}[\text{Delay}] = P(\text{Delayed}) \times \mathbb{E}[\text{Delay} \mid \text{Delayed}] + P(\text{On-Time}) \times 0$$

where the conditional delay distribution $\text{Delay} \mid \text{Delayed}$ is modeled via a fitted **Log-Normal distribution** ($\mu = 3.65, \sigma = 0.78$), yielding 80% and 95% prediction intervals.

---

## 🛠️ Architecture & Tech Stack

```
flight-delay-predictor/
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI entry point & CORS configuration
│   │   ├── routers/              # Modular REST API endpoints
│   │   │   ├── airports.py       # Autocomplete search & coordinates
│   │   │   ├── predict.py        # Probability prediction router
│   │   │   ├── probability_lab.py# Interactive probability query engine
│   │   │   ├── stats.py          # Hypothesis tests & distribution stats
│   │   │   ├── weather.py        # Live Open-Meteo weather fetcher
│   │   │   ├── schedule.py       # Scheduled flight timetable integration
│   │   │   ├── insights.py       # Airline & airport historical benchmarks
│   │   │   └── model_eval.py     # Log-loss, Brier score, calibration curves
│   │   └── services/
│   │       ├── bayes_engine.py   # Analytical Bayesian & interval math
│   │       ├── model_service.py  # Model inference & prior-likelihood engine
│   │       └── weather_service.py# Open-Meteo integration service
│   ├── data/
│   │   ├── raw/                  # Download scripts destination (.gitkeep)
│   │   └── processed/            # Serialized models, lookup tables, Parquet
│   ├── scripts/                  # Data ingestion & training pipeline
│   │   ├── download_data.py      # US BTS chunked downloader
│   │   ├── process_airports.py   # OurAirports geolocation parser
│   │   ├── prepare_dgca_data.py  # DGCA India reference OTP parser
│   │   └── clean_and_train.py    # Training & hypothesis test pipeline
│   ├── tests/                    # Pytest automated test suite
│   ├── requirements.txt
│   └── pytest.ini
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx           # Landing page & feature showcase
│   │   │   ├── Predictor.tsx      # Core prediction interface & simulator
│   │   │   ├── ProbabilityLab.tsx # Interactive probability query tool
│   │   │   └── Stats.tsx          # Hypothesis tests & distribution graphs
│   │   ├── App.tsx               # Top-level routing and navigation
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
* **Python 3.10+** (tested on Python 3.11, 3.12, 3.13)
* **Node.js 18+** & **npm**

---

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment** *(recommended)*:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Verify processed data & models**:
   Pre-trained model artifacts, distribution stats, and lookup tables are already bundled in `data/processed/` for instant execution.
   *(Optional)* To re-download raw datasets and retrain from scratch:
   ```bash
   python scripts/download_data.py
   python scripts/process_airports.py
   python scripts/prepare_dgca_data.py
   python scripts/clean_and_train.py
   ```

5. **Run the FastAPI server**:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   API Docs available at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### Frontend Setup

1. **Open a new terminal and navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Application available at: [http://127.0.0.1:5173](http://127.0.0.1:5173)

---

## 🧪 Running Automated Tests

The backend includes a comprehensive `pytest` test suite verifying mathematical integrity, Wilson intervals, Bayes theorem summation invariants, and API endpoints.

```bash
cd backend
pytest -v
```

Expected result:
```
tests/test_api.py::test_health_check PASSED
tests/test_api.py::test_search_airports PASSED
tests/test_api.py::test_probability_lab_get PASSED
tests/test_api.py::test_probability_lab_query PASSED
tests/test_api.py::test_predict_endpoint PASSED
tests/test_api.py::test_hypothesis_tests_endpoint PASSED
tests/test_bayes.py::test_wilson_score_interval_properties PASSED
tests/test_bayes.py::test_bayes_theorem_posteriors_sum PASSED
tests/test_bayes.py::test_expected_delay_calculation PASSED

======================== 9 passed in 4.58s ========================
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check & system status |
| `POST` | `/api/predict` | Computes calibrated disruption probabilities & expected delay |
| `GET` | `/api/airports/search?q={query}` | Autocompletes airports by IATA code or city name |
| `GET` | `/api/weather?lat={lat}&lon={lon}` | Fetches real-time / forecasted weather from Open-Meteo |
| `GET` | `/api/probability-lab` | Retrieves marginal outcomes and contingency data |
| `POST` | `/api/probability-lab/query` | Computes conditional probabilities for selected variables |
| `GET` | `/api/stats/distributions` | Returns continuous distribution fit metrics, quartiles, and Q-Q coordinates |
| `GET` | `/api/stats/hypothesis-tests` | Returns Welch's t-test, Chi-Square, and correlation results with p-values |

---

## 📊 Data Sources & Provenance

1. **US Bureau of Transportation Statistics (BTS)**:
   * Source: [TranStats Reporting Carrier On-Time Performance](https://www.transtats.bts.gov)
   * Size: 538,837 verified commercial flights.
2. **Directorate General of Civil Aviation (DGCA) India**:
   * Source: [DGCA Monthly Air Traffic Statistics](https://www.dgca.gov.in)
   * Official airline OTP benchmarks for Indian carriers.
3. **Open-Meteo Weather APIs**:
   * Source: [Open-Meteo Open Data](https://open-meteo.com)
   * High-resolution meteorological measurements (free, open-access, keyless).
4. **OurAirports Worldwide Database**:
   * Source: [OurAirports Open Data](https://ourairports.com/data/)
   * Geolocation coordinates for thousands of global commercial airports.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
