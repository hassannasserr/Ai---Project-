"""
AutoValue AI – Synthetic Dataset Generator
============================================
Generates a realistic synthetic used-car dataset for demo/training purposes.
If you have the REAL dataset (e.g. from Kaggle / merged CSVs), use that instead.

Usage:
    python training/generate_data.py
    # Creates: training/synthetic_cars.csv  (~10 000 rows)
"""

import os
import random
import pandas as pd
import numpy as np

np.random.seed(42)
random.seed(42)

# ── Brand / Model catalogue ──────────────────────────────────────────────────
CATALOGUE = {
    "Audi":      ["A1", "A3", "A4", "A5", "A6", "Q2", "Q3", "Q5", "Q7"],
    "BMW":       ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "X1", "X3", "X5"],
    "Ford":      ["Fiesta", "Focus", "Kuga", "Puma", "EcoSport", "Mondeo", "Galaxy"],
    "Hyundai":   ["i10", "i20", "i30", "Tucson", "Kona", "Santa Fe", "Ioniq"],
    "Mercedes":  ["A Class", "B Class", "C Class", "E Class", "GLA Class", "GLC Class"],
    "Skoda":     ["Citigo", "Fabia", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq"],
    "Toyota":    ["Aygo", "Yaris", "Corolla", "C-HR", "RAV4", "Land Cruiser", "Prius"],
    "Vauxhall":  ["Corsa", "Astra", "Mokka", "Crossland X", "Grandland X", "Insignia"],
    "VW":        ["Polo", "Golf", "T-Cross", "T-Roc", "Tiguan", "Passat", "Touareg"],
}

FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"]
TRANSMISSIONS = ["Manual", "Semi-Auto", "Automatic"]

# ── Base pricing parameters per brand ────────────────────────────────────────
BRAND_BASE_PRICE = {
    "Audi": 18000, "BMW": 20000, "Ford": 10000, "Hyundai": 9000,
    "Mercedes": 22000, "Skoda": 9500, "Toyota": 12000,
    "Vauxhall": 8500, "VW": 11000,
}

BRAND_ENGINE_RANGE = {
    "Audi": (1.0, 3.0), "BMW": (1.5, 3.0), "Ford": (1.0, 2.0),
    "Hyundai": (1.0, 2.0), "Mercedes": (1.3, 3.0), "Skoda": (1.0, 2.0),
    "Toyota": (1.0, 2.5), "Vauxhall": (1.0, 2.0), "VW": (1.0, 2.5),
}


def _generate_row() -> dict:
    brand = random.choice(list(CATALOGUE))
    model = random.choice(CATALOGUE[brand])
    year = random.randint(2005, 2023)
    transmission = random.choice(TRANSMISSIONS)
    fuel_type = random.choice(FUEL_TYPES)

    eng_lo, eng_hi = BRAND_ENGINE_RANGE[brand]
    engine_size = round(random.uniform(eng_lo, eng_hi), 1)

    mileage = max(100, int(np.random.exponential(scale=20000) + (2023 - year) * 3000))
    mpg = round(random.uniform(25, 70) + (10 if fuel_type in ("Hybrid", "Diesel") else 0), 1)
    tax = random.choice([0, 20, 30, 125, 145, 150, 205, 555])

    # Realistic price generation  ─────────────────────────────────────────────
    base = BRAND_BASE_PRICE[brand]
    price = base
    price += (year - 2014) * 800                      # newer = more expensive
    price -= mileage * 0.03                            # high mileage = cheaper
    price += engine_size * 2500                         # bigger engine = pricier
    price += (5 if transmission == "Automatic" else 0) * 200
    price += (mpg - 40) * 30
    price += np.random.normal(0, 1200)                 # noise
    price = max(1500, round(price, 2))

    return {
        "brand": brand,
        "model": model,
        "year": year,
        "transmission": transmission,
        "mileage": mileage,
        "fuelType": fuel_type,
        "tax": tax,
        "mpg": mpg,
        "engineSize": engine_size,
        "price": price,
    }


def main():
    rows = [_generate_row() for _ in range(10_000)]
    df = pd.DataFrame(rows)

    out_dir = os.path.dirname(os.path.abspath(__file__))
    out_path = os.path.join(out_dir, "synthetic_cars.csv")
    df.to_csv(out_path, index=False)
    print(f"✅ Generated {len(df)} rows → {out_path}")
    print(f"   Columns: {list(df.columns)}")
    print(f"   Price range: £{df['price'].min():.0f} – £{df['price'].max():.0f}")
    print(f"   Brands: {df['brand'].nunique()}")


if __name__ == "__main__":
    main()
