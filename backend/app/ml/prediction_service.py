from pathlib import Path

import joblib
import pandas as pd

from app.ml.dataset import FEATURE_COLUMNS


MODEL_DIR = Path(__file__).resolve().parent / "models"

MODEL_PATH = MODEL_DIR / "academic_risk_model.joblib"
SCALER_PATH = MODEL_DIR / "academic_risk_scaler.joblib"


RISK_LABELS = {
    0: "Low",
    1: "Medium",
    2: "High",
}


def load_model():
    """Load the trained academic-risk model."""

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model file not found: {MODEL_PATH}"
        )

    return joblib.load(MODEL_PATH)


def load_scaler():
    """Load the feature scaler used during training."""

    if not SCALER_PATH.exists():
        raise FileNotFoundError(
            f"Scaler file not found: {SCALER_PATH}"
        )

    return joblib.load(SCALER_PATH)


def predict_risk(features: dict) -> dict:
    """
    Predict academic risk for one student.

    The input dictionary must contain the same academic features
    used during model training.
    """

    model = load_model()
    scaler = load_scaler()

    feature_values = {
        column: features[column]
        for column in FEATURE_COLUMNS
    }

    dataframe = pd.DataFrame(
        [feature_values],
        columns=FEATURE_COLUMNS,
    )

    scaled_features = scaler.transform(dataframe)

    prediction = int(
        model.predict(scaled_features)[0]
    )

    probabilities = model.predict_proba(
        scaled_features
    )[0]

    probability_by_label = {
        RISK_LABELS[int(class_id)]: round(
            float(probability),
            4,
        )
        for class_id, probability in zip(
            model.classes_,
            probabilities,
        )
    }

    return {
        "risk_level": RISK_LABELS[prediction],
        "risk_probabilities": probability_by_label,
    }
