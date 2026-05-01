"""
AutoValue AI – Model Training Pipeline
========================================
Loads a car dataset, cleans it, engineers features,
trains a RandomForestRegressor, evaluates it, and persists artifacts.

Usage:
    python training/train_model.py                          # uses synthetic data
    python training/train_model.py --data path/to/real.csv  # uses real dataset
"""

import argparse
import json
import os
import sys

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

# ── Paths ────────────────────────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ML_SERVICE_DIR = os.path.dirname(SCRIPT_DIR)
ARTIFACT_DIR = os.path.join(ML_SERVICE_DIR, "artifacts")
DEFAULT_CSV = os.path.join(SCRIPT_DIR, "synthetic_cars.csv")


def load_data(path: str) -> pd.DataFrame:
    """Load CSV and do basic sanity checks."""
    print(f"📂 Loading dataset from: {path}")
    df = pd.read_csv(path)
    print(f"   Raw shape: {df.shape}")
    return df


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """Remove duplicates, missing values, and outliers."""
    before = len(df)
    df = df.drop_duplicates()
    df = df.dropna()
    print(f"   After dedup/dropna: {len(df)} (removed {before - len(df)})")

    # Remove outliers
    df = df[df["year"] >= 2000]
    df = df[df["engineSize"] > 0]
    df = df[df["mpg"] < 200]
    df = df[df["mileage"] > 0]
    df = df[df["price"] > 500]
    print(f"   After outlier removal: {len(df)}")
    return df.reset_index(drop=True)


def train(df: pd.DataFrame):
    """Train a RandomForestRegressor and save artifacts."""
    # ── Separate features / target ───────────────────────────────────────────
    target = "price"
    X = df.drop(columns=[target])
    y = df[target]

    # ── One-hot encode categoricals ──────────────────────────────────────────
    X = pd.get_dummies(X)
    model_columns = list(X.columns)

    # ── Train / Test split ───────────────────────────────────────────────────
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"\n🔧 Training set: {X_train.shape[0]} samples")
    print(f"🔧 Test set:     {X_test.shape[0]} samples")
    print(f"🔧 Features:     {X_train.shape[1]}")

    # ── Model ────────────────────────────────────────────────────────────────
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=None,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1,
    )
    print("\n⏳ Training RandomForestRegressor (n_estimators=100) ...")
    model.fit(X_train, y_train)
    print("✅ Training complete!")

    # ── Evaluate ─────────────────────────────────────────────────────────────
    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)

    print(f"\n📊 Evaluation Results:")
    print(f"   R² Score : {r2:.4f}  ({'✅ PASS' if r2 > 0.90 else '⚠️ BELOW TARGET'})")
    print(f"   MAE      : £{mae:.2f}")
    print(f"   RMSE     : £{rmse:.2f}")

    # ── Feature importance ───────────────────────────────────────────────────
    importances = model.feature_importances_
    feat_imp = sorted(
        zip(model_columns, importances), key=lambda x: x[1], reverse=True
    )
    print(f"\n🏆 Top 10 Feature Importances:")
    for name, imp in feat_imp[:10]:
        print(f"   {name:30s} {imp:.4f}")

    # Build a simplified importance dict (group one-hot back to original feature)
    grouped_importance = {}
    for col, imp in feat_imp:
        # e.g. "brand_BMW" → "brand"
        base = col.split("_")[0] if "_" in col else col
        grouped_importance[base] = grouped_importance.get(base, 0) + imp

    # Sort and take top features
    top_features = sorted(grouped_importance.items(), key=lambda x: x[1], reverse=True)

    # ── Save artifacts ───────────────────────────────────────────────────────
    os.makedirs(ARTIFACT_DIR, exist_ok=True)

    model_path = os.path.join(ARTIFACT_DIR, "final_model.pkl")
    columns_path = os.path.join(ARTIFACT_DIR, "model_columns.pkl")
    importance_path = os.path.join(ARTIFACT_DIR, "feature_importance.json")

    joblib.dump(model, model_path)
    joblib.dump(model_columns, columns_path)

    importance_data = {
        "features": [{"name": n, "importance": round(v, 4)} for n, v in top_features],
        "r2_score": round(r2, 4),
        "mae": round(mae, 2),
        "rmse": round(rmse, 2),
    }
    with open(importance_path, "w") as f:
        json.dump(importance_data, f, indent=2)

    print(f"\n💾 Artifacts saved to: {ARTIFACT_DIR}/")
    print(f"   ├── final_model.pkl")
    print(f"   ├── model_columns.pkl")
    print(f"   └── feature_importance.json")


def main():
    parser = argparse.ArgumentParser(description="Train AutoValue AI model")
    parser.add_argument(
        "--data", type=str, default=DEFAULT_CSV,
        help="Path to the CSV dataset (default: synthetic_cars.csv)",
    )
    args = parser.parse_args()

    if not os.path.exists(args.data):
        print(f"❌ Dataset not found: {args.data}")
        print("   Run 'python training/generate_data.py' first to create synthetic data.")
        sys.exit(1)

    df = load_data(args.data)
    df = clean_data(df)
    train(df)
    print("\n🎉 All done! Model is ready for serving.")


if __name__ == "__main__":
    main()
