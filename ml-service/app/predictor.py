"""
AutoValue AI – Predictor Module
=================================
Loads the trained model and provides prediction + confidence interval logic.
"""

import json
import os
import random
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

# ── Artifact paths ───────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent
ARTIFACT_DIR = BASE_DIR / "artifacts"
MODEL_PATH = ARTIFACT_DIR / "final_model.pkl"
COLUMNS_PATH = ARTIFACT_DIR / "model_columns.pkl"
IMPORTANCE_PATH = ARTIFACT_DIR / "feature_importance.json"

# ── Load artifacts at module level ───────────────────────────────────────────
_model = None
_model_columns = None
_feature_importance = None


def _load_artifacts():
    global _model, _model_columns, _feature_importance

    if not MODEL_PATH.exists() or not COLUMNS_PATH.exists():
        raise RuntimeError(
            f"Model artifacts not found in {ARTIFACT_DIR}. "
            "Run 'python training/train_model.py' first."
        )

    _model = joblib.load(MODEL_PATH)
    _model_columns = joblib.load(COLUMNS_PATH)

    if IMPORTANCE_PATH.exists():
        with open(IMPORTANCE_PATH, "r") as f:
            _feature_importance = json.load(f)
    else:
        _feature_importance = {"features": [], "r2_score": 0, "mae": 0, "rmse": 0}

    print(f"✅ Model loaded: {MODEL_PATH}")
    print(f"   Columns: {len(_model_columns)} features")


def get_model():
    if _model is None:
        _load_artifacts()
    return _model


def get_columns():
    if _model_columns is None:
        _load_artifacts()
    return _model_columns


def get_feature_importance():
    if _feature_importance is None:
        _load_artifacts()
    return _feature_importance


# ── Preprocessing ────────────────────────────────────────────────────────────
def preprocess_input(input_dict: dict) -> pd.DataFrame:
    """One-hot encode input and align to training columns."""
    columns = get_columns()
    df = pd.DataFrame([input_dict])

    # Clean string columns
    for col in ["brand", "model", "transmission", "fuelType"]:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip()

    df = pd.get_dummies(df)
    df = df.reindex(columns=columns, fill_value=0)
    return df


# ── Prediction ───────────────────────────────────────────────────────────────
def predict_with_confidence(input_dict: dict) -> dict:
    """
    Predict car price with confidence interval.
    Uses individual tree predictions for uncertainty estimation.
    """
    model = get_model()
    processed = preprocess_input(input_dict)

    # Get predictions from all individual trees
    tree_predictions = np.array([
        tree.predict(processed)[0] for tree in model.estimators_
    ])

    mean_price = float(np.mean(tree_predictions))
    std_price = float(np.std(tree_predictions))

    # 95% confidence interval (≈ ±1.96 std)
    confidence_min = max(0, mean_price - 1.96 * std_price)
    confidence_max = mean_price + 1.96 * std_price

    return {
        "price": round(mean_price, 2),
        "confidence_min": round(confidence_min, 2),
        "confidence_max": round(confidence_max, 2),
    }


# ── Feature importance for a specific prediction ────────────────────────────
def get_top_features(n: int = 5) -> list:
    """Return the top-n most important features (grouped)."""
    importance = get_feature_importance()
    features = importance.get("features", [])
    return features[:n]


# ── Similar cars generator ───────────────────────────────────────────────────
def generate_similar_cars(input_dict: dict, predicted_price: float) -> list:
    """
    Generate 3 'similar' cars by varying year/mileage slightly.
    In production, this would query a database.
    """
    similar = []
    variations = [
        {"year_delta": -1, "mileage_factor": 1.15, "label": "Older, Higher Mileage"},
        {"year_delta": +1, "mileage_factor": 0.85, "label": "Newer, Lower Mileage"},
        {"year_delta": 0,  "mileage_factor": 1.30, "label": "Same Year, More Miles"},
    ]

    for var in variations:
        sim_input = input_dict.copy()
        sim_input["year"] = max(2000, input_dict.get("year", 2020) + var["year_delta"])
        sim_input["mileage"] = max(100, int(input_dict.get("mileage", 30000) * var["mileage_factor"]))

        sim_pred = predict_with_confidence(sim_input)
        sim_price = sim_pred["price"]
        diff = round(sim_price - predicted_price, 2)

        similar.append({
            "brand": input_dict.get("brand", "Unknown"),
            "model": input_dict.get("model", "Unknown"),
            "year": sim_input["year"],
            "mileage": sim_input["mileage"],
            "price": sim_price,
            "difference": diff,
        })

    return similar
