# AeroProb • Flight Delay & Cancellation Probability Predictor

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Anime.js](https://img.shields.io/badge/Anime.js-v4-FF4B4B.svg?style=flat&logo=javascript&logoColor=white)](https://animejs.com/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.4+-F7931E.svg?style=flat&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?style=flat&logo=python&logoColor=white)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A production-grade, full-stack aviation intelligence web application and calibrated statistical engine that predicts the **probability** of commercial flight disruptions—classifying flights into **On-Time**, **Delayed** (arrival delay > 15 minutes, official BTS standard), and **Cancelled**.

Engineered around a **Black, White, and Electric Purple/Violet** visual identity, AeroProb pairs MakeMyTrip-inspired flight booking and search with rigorous Bayesian inference, Platt-scaled multinomial logistic regression, and Open-Meteo live atmospheric telemetry.

---

## Key Features

### 1. MakeMyTrip-Inspired Flight Booking & Search
* **Frictionless Route Discovery**: One-way and round-trip searches across top Indian metro airports (Chennai MAA, Mumbai BOM, Delhi DEL, Bengaluru BLR, Hyderabad HYD, Kolkata CCU, Ahmedabad AMD, etc.) and international gateways.
* **Integrated Disruption Risk Indicators**: Every flight card displays segmented **On-Time**, **Delayed**, and **Cancelled** probabilities, expected delay minutes, and primary risk driver factor.
* **Smart Recommendation Engine**: Dynamically balances ticket price, journey duration, and predicted delay risk to highlight optimal flight choices.
* **Side-by-Side Flight Comparison Dock**: Select up to 4 flights simultaneously to compare prices, arrival reliability, and 95% Wilson confidence intervals.
* **External Search & Booking**: Direct "Search on MakeMyTrip (External)" link with formatted date parameters (`DD/MM/YYYY`) opening live booking searches in a new browser tab.

### 2. Cinematic Aviation Landing Page (Anime.js v4)
* **Visual Identity**: Premium deep black surfaces, electric violet highlights, and crisp typography.
* **Anime.js Entrance Choreography**: Smooth staggered badge reveals, headline typography transitions, floating aircraft card animations, and responsive section storytelling.
* **1-Click Faculty Demo Mode**: Instant authentication as Dr. Sharma with pre-loaded travel preferences, recent searches, and automatic Chennai (MAA) to Mumbai (BOM) flight search evaluation.

### 3. User Authentication & Personalization
* **Session Persistence**: User profile drawer supporting saved preferred origin/destination airports, default cabin class, and preferred airlines (IndiGo, Air India, Vistara, Akasa Air, SpiceJet).
* **Recent Searches & Bookmarked Flights**: Replay previous route queries or bookmark specific flights to a local wishlist with real-time OTP tracking.
* **Prediction History**: Historical log of calibrated disruption probabilities for past evaluated flights.

### 4. Custom Hypothetical Flight Simulator
* **Scenario Planning**: Counterfactual sandbox for evaluating future flights under simulated environmental conditions.
* **Meteorological Condition Presets**:
  * *Live Telemetry* (Airport coordinate Open-Meteo query)
  * *Clear / Favorable Conditions*
  * *Moderate Rain & Adverse Winds (26 km/h)*
  * *Severe Storm & Low Visibility (600m)*
  * *Winter Fog CAT III (Delhi NCR Extreme 350m)*
  * *High Crosswinds & Squalls (54 km/h)*
* **Step-by-Step Bayes Decomposition**: Transparent prior $P(Y)$, likelihood $P(W \mid Y)$, joint numerator, marginal evidence $P(W)$, and posterior $P(Y \mid W)$ table.

### 5. Interactive Probability Lab
* **Dynamic Variable-Condition Explorer**: Query conditional probabilities $P(Y \mid C)$ across Weather Conditions, Scheduled Time of Day, and Operating Airline Carriers.
* **Confidence Intervals**: 95% asymmetric Wilson score intervals calculated for every conditional probability with sample size $n$.
* **Baseline Marginal Comparisons**: Contrast conditional probabilities against the entire BTS population baseline ($P(\text{On-Time}) = 77.1\%$, $P(\text{Delayed}) = 20.9\%$, $P(\text{Cancelled}) = 1.9\%$).

### 6. Statistical Insights & Model Audit
* **Anti-Data Leakage Verification**: All post-departure features (`ArrDelay`, `DepDelay`, `WeatherDelay`, `CancellationCode`) are strictly quarantined. Models use only pre-departure scheduling, Open-Meteo forecasts, and training-split historical priors.
* **Model Comparison Suite**: Calibrated Multinomial Logistic Regression (Brier: 0.3747, Log-Loss: 0.5401) vs. Gaussian Naive Bayes baseline.
* **Hypothesis Testing**: Welch's $t$-test, Chi-Square test of independence, two-proportion $z$-test, ANOVA, and Pearson correlation coefficients.

---

## 📐 Mathematical & Statistical Formulations

### 1. Bayesian Posterior Probability
The engine calculates exact posterior probabilities using Bayes' Theorem and the Law of Total Probability:

$$P(\text{Class}_i \mid \text{Weather}) = \frac{P(\text{Weather} \mid \text{Class}_i) \cdot P(\text{Class}_i)}{\sum_{j} P(\text{Weather} \mid \text{Class}_j) \cdot P(\text{Class}_j)}$$

### 2. Wilson Score Confidence Interval
To account for finite sample sizes ($n$) when evaluating proportions ($\hat{p}$), the 95% Wilson interval is computed:

$$w = \frac{\hat{p} + \frac{z^2}{2n} \pm z \sqrt{\frac{\hat{p}(1 - \hat{p})}{n} + \frac{z^2}{4n^2}}}{1 + \frac{z^2}{n}}$$

where $z = 1.96$ for a 95% confidence level.

### 3. Expected Disruption Delay
Expected arrival delay in minutes is formulated as:

$$\mathbb{E}[\text{Delay}] = P(\text{Delayed}) \times \mathbb{E}[\text{Delay} \mid \text{Delayed}] + P(\text{On-Time}) \times 0$$

where the conditional delay distribution $\text{Delay} \mid \text{Delayed}$ is modeled via a fitted **Log-Normal distribution** ($\mu = 3.65, \sigma = 0.78$), yielding 80% and 95% prediction intervals.

---

## 🛠️ Architecture & Tech Stack

```
flight-delay-predictor/
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI entry point & CORS configuration
│   │   ├── routers/                   # Modular REST API endpoints
│   │   │   ├── airports.py            # Autocomplete search & coordinates
│   │   │   ├── flights.py             # Flight booking search & smart recommendation
│   │   │   ├── predict.py             # Calibrated probability prediction router
│   │   │   ├── probability_lab.py     # Interactive probability query engine
│   │   │   ├── stats.py               # Hypothesis tests & distribution stats
│   │   │   ├── user.py                # User auth, preferences & demo mode
│   │   │   ├── weather.py             # Live Open-Meteo weather fetcher
│   │   │   └── model_eval.py          # Log-loss, Brier score, calibration curves
│   │   └── services/
│   │       ├── bayes_engine.py        # Analytical Bayesian & Wilson interval math
│   │       ├── flight_search_service.py # Route generator & MMT deep links
│   │       ├── model_service.py       # Model inference & prior-likelihood engine
│   │       └── weather_service.py     # Open-Meteo integration service
│   ├── data/
│   │   ├── raw/                       # Download scripts destination (.gitkeep)
│   │   └── processed/                 # Serialized models, lookup tables, Parquet
│   ├── scripts/                       # Data ingestion & training pipeline
│   │   ├── download_data.py           # US BTS chunked downloader
│   │   ├── process_airports.py        # OurAirports geolocation parser
│   │   ├── prepare_dgca_data.py       # DGCA India reference OTP parser
│   │   └── clean_and_train.py         # Anti-leakage training & hypothesis pipeline
│   ├── tests/                         # Pytest automated test suite (16 tests)
│   ├── requirements.txt
│   └── pytest.ini
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal.tsx          # Login & registration modal
│   │   │   ├── FlightCompareModal.tsx # Side-by-side flight comparison modal
│   │   │   ├── FlightSearchWidget.tsx # MakeMyTrip-inspired search widget
│   │   │   └── UserProfileDrawer.tsx  # User preferences & history drawer
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx        # Cinematic Anime.js hero & storytelling
│   │   │   ├── Home.tsx               # Main booking dashboard
│   │   │   ├── FlightSearch.tsx       # Flight search results with delay probabilities
│   │   │   ├── Predictor.tsx          # Custom hypothetical simulator
│   │   │   ├── ProbabilityLab.tsx     # Interactive conditional probability lab
│   │   │   └── Stats.tsx              # Statistical insights & model evaluation
│   │   ├── App.tsx                    # Authentication gating & app routing
│   │   └── index.css                  # Deep black & electric purple design tokens
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── .gitignore
└── README.md
```

---

## Getting Started

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

4. **Run the FastAPI server**:
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

The backend includes a comprehensive 16-test suite verifying mathematical invariants, Wilson intervals, zero-leakage training invariants, and end-to-end user journeys:

```bash
cd backend
pytest -v
```

Expected output:
```
tests/test_api.py::test_health_check PASSED                              [  6%]
tests/test_api.py::test_search_airports PASSED                           [ 12%]
tests/test_api.py::test_probability_lab_get PASSED                       [ 18%]
tests/test_api.py::test_probability_lab_query PASSED                     [ 25%]
tests/test_api.py::test_predict_endpoint PASSED                          [ 31%]
tests/test_api.py::test_hypothesis_tests_endpoint PASSED                 [ 37%]
tests/test_api.py::test_flight_search_chennai_to_mumbai PASSED           [ 43%]
tests/test_api.py::test_faculty_demo_login PASSED                        [ 50%]
tests/test_api.py::test_flight_comparison PASSED                         [ 56%]
tests/test_bayes.py::test_wilson_score_interval_properties PASSED        [ 62%]
tests/test_bayes.py::test_bayes_theorem_posteriors_sum PASSED            [ 68%]
tests/test_bayes.py::test_expected_delay_calculation PASSED              [ 75%]
tests/test_e2e_journey.py::test_complete_user_journey_chennai_to_mumbai PASSED [ 81%]
tests/test_e2e_journey.py::test_edge_case_unsupported_remote_route PASSED [ 87%]
tests/test_e2e_journey.py::test_edge_case_empty_or_invalid_comparison PASSED [ 93%]
tests/test_e2e_journey.py::test_edge_case_missing_weather PASSED         [100%]

======================= 16 passed in 8.22s ========================
```

---

## REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check & system status |
| `POST` | `/api/user/login` | Authenticate user or initiate 1-click Faculty Demo mode |
| `GET` | `/api/user/profile` | Retrieve user profile, preferences, and recent search history |
| `POST` | `/api/flights/search` | MakeMyTrip-style flight search with real-time delay probabilities |
| `POST` | `/api/flights/compare` | Multi-criteria comparison between selected flight IDs |
| `POST` | `/api/predict` | Computes calibrated disruption probabilities & expected delay |
| `GET` | `/api/airports/search?q={query}` | Autocompletes airports by IATA code or city name |
| `GET` | `/api/weather?iata={iata}` | Fetches real-time / forecasted weather from Open-Meteo |
| `GET` | `/api/probability-lab` | Retrieves marginal outcomes and contingency data |
| `GET` | `/api/probability-lab/options` | Dynamic variables and conditions for conditional analysis |
| `POST` | `/api/probability-lab/query` | Computes conditional probabilities with 95% Wilson CIs |
| `GET` | `/api/model-eval/metrics` | Model performance comparison, log-loss, Brier score, and calibration curves |
| `GET` | `/api/stats/hypothesis-tests` | Welch's t-test, Chi-Square, ANOVA, and correlation results |

---

## Data Sources & Provenance

1. **US Bureau of Transportation Statistics (BTS)**:
   * Source: [TranStats Reporting Carrier On-Time Performance](https://www.transtats.bts.gov)
   * 538,837 verified commercial flights with zero synthetic augmentation.
2. **Directorate General of Civil Aviation (DGCA) India**:
   * Source: [DGCA Monthly Air Traffic Statistics](https://www.dgca.gov.in)
   * Official airline OTP benchmarks for Indian carriers (IndiGo, Air India, Akasa Air, SpiceJet).
3. **Open-Meteo Weather APIs**:
   * Source: [Open-Meteo Open Data](https://open-meteo.com)
   * Live and forecasted meteorological measurements matched by airport coordinates.
4. **OurAirports Worldwide Database**:
   * Source: [OurAirports Open Data](https://ourairports.com/data/)
   * Precision geolocation coordinates for thousands of global commercial airports.

---

## License

This project is licensed under the [MIT License](LICENSE).
