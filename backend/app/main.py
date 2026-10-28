from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import predict, weather, schedule, airports, stats, probability_lab, insights, model_eval, flights, user

app = FastAPI(
    title="Flight Delay & Cancellation Probability Predictor",
    description="Flight Delay & Cancellation Probability Predictor Backend API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router)
app.include_router(weather.router)
app.include_router(schedule.router)
app.include_router(airports.router)
app.include_router(stats.router)
app.include_router(probability_lab.router)
app.include_router(insights.router)
app.include_router(model_eval.router)
app.include_router(flights.router)
app.include_router(user.router)

@app.get("/")
def root():
    return {"status": "online", "message": "Flight Predictor API is running."}
