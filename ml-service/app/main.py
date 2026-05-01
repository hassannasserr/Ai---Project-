"""
AutoValue AI – FastAPI Application
====================================
Main entry point for the Python ML microservice.

Run:
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .models import CarInput, PredictResponse, FeatureImportanceItem, SimilarCar
from .predictor import (
    predict_with_confidence,
    get_top_features,
    generate_similar_cars,
    get_feature_importance,
)

# ── App setup ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="AutoValue AI – ML Service",
    description="Used car price prediction powered by RandomForest",
    version="1.0.0",
)

# CORS – allow requests from React dev server and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Available brands (used by frontend dropdowns) ───────────────────────────
BRANDS = [
    "Audi", "BMW", "Ford", "Hyundai", "Mercedes",
    "Skoda", "Toyota", "Vauxhall", "VW",
]


# ── Routes ───────────────────────────────────────────────────────────────────
@app.get("/")
def health_check():
    """Health check endpoint."""
    return {"status": "API is running", "service": "AutoValue AI ML Service"}


@app.get("/brands")
def list_brands():
    """Return list of supported car brands."""
    return {"brands": BRANDS}


@app.post("/predict", response_model=PredictResponse)
def predict_price(car: CarInput):
    """
    Predict the price of a used car.
    Returns estimated price, confidence interval,
    feature importance, and similar car comparisons.
    """
    try:
        # Build input dict
        data = car.model_dump()

        # Get prediction with confidence
        result = predict_with_confidence(data)

        # Get feature importance
        top_features = get_top_features(5)
        importance_items = [
            FeatureImportanceItem(name=f["name"], importance=f["importance"])
            for f in top_features
        ]

        # Get similar cars
        similar = generate_similar_cars(data, result["price"])
        similar_items = [SimilarCar(**s) for s in similar]

        return PredictResponse(
            price=result["price"],
            confidence_min=result["confidence_min"],
            confidence_max=result["confidence_max"],
            currency="GBP",
            model_used="RandomForest",
            feature_importance=importance_items,
            similar_cars=similar_items,
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=f"Model not loaded: {e}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/feature-importance")
def feature_importance():
    """Return global feature importance from training."""
    try:
        data = get_feature_importance()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
