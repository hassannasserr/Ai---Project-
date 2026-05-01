"""
AutoValue AI – Pydantic Models
"""

from pydantic import BaseModel, Field
from typing import List, Optional


class CarInput(BaseModel):
    """Input schema for car price prediction."""
    brand: str = Field(..., description="Car brand (e.g. Audi, BMW, Ford)")
    model: str = Field(..., description="Car model (e.g. A3, 3 Series)")
    year: int = Field(..., ge=2000, le=2026, description="Year of manufacture")
    transmission: str = Field(..., description="Manual, Automatic, or Semi-Auto")
    mileage: float = Field(..., ge=0, description="Total mileage in miles")
    fuelType: str = Field(..., description="Petrol, Diesel, Hybrid, or Electric")
    tax: float = Field(default=150, ge=0, description="Road tax (£)")
    mpg: float = Field(default=50.0, gt=0, lt=200, description="Miles per gallon")
    engineSize: float = Field(default=1.5, gt=0, le=7.0, description="Engine size in litres")


class SimilarCar(BaseModel):
    """A similar car comparison item."""
    brand: str
    model: str
    year: int
    mileage: int
    price: float
    difference: float


class FeatureImportanceItem(BaseModel):
    """A single feature importance entry."""
    name: str
    importance: float


class PredictResponse(BaseModel):
    """Full prediction response."""
    price: float
    confidence_min: float
    confidence_max: float
    currency: str = "GBP"
    model_used: str = "RandomForest"
    feature_importance: List[FeatureImportanceItem] = []
    similar_cars: List[SimilarCar] = []
