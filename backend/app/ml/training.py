from pathlib import Path

import joblib
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

from app.ml.dataset import FEATURE_COLUMNS, generate_training_dataset


MODEL_DIR = Path(__file__).resolve().parent / "models"
MODEL_PATH = MODEL_DIR / "academic_risk_model.joblib"
SCALER_PATH = MODEL_DIR / "academic_risk_scaler.joblib"


def train_model(random_state: int = 42) -> dict:
    """
    Train the academic-risk classification model.

    Returns evaluation metrics and the paths of the saved artifacts.
    """

    dataset = generate_training_dataset(
        n_samples=1000,
        random_state=random_state,
    )

    X = dataset[FEATURE_COLUMNS]
    y = dataset["risk_label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=random_state,
        stratify=y,
    )

    scaler = StandardScaler()

    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = LogisticRegression(
        max_iter=1000,
        random_state=random_state,
    )

    model.fit(X_train_scaled, y_train)

    predictions = model.predict(X_test_scaled)

    accuracy = accuracy_score(
        y_test,
        predictions,
    )

    report = classification_report(
        y_test,
        predictions,
        output_dict=True,
        zero_division=0,
    )

    matrix = confusion_matrix(
        y_test,
        predictions,
    )

    MODEL_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    joblib.dump(
        model,
        MODEL_PATH,
    )

    joblib.dump(
        scaler,
        SCALER_PATH,
    )

    return {
        "accuracy": round(
            float(accuracy),
            4,
        ),
        "classification_report": report,
        "confusion_matrix": matrix.tolist(),
        "model_path": str(MODEL_PATH),
        "scaler_path": str(SCALER_PATH),
        "training_samples": len(X_train),
        "testing_samples": len(X_test),
    }


if __name__ == "__main__":
    results = train_model()

    print("\nAcademic Risk Model")
    print("===================")
    print(f"Accuracy: {results['accuracy']}")
    print(f"Training samples: {results['training_samples']}")
    print(f"Testing samples: {results['testing_samples']}")

    print("\nClassification Report")
    print("---------------------")

    report = pd.DataFrame(
        results["classification_report"]
    ).transpose()

    print(report)

    print("\nConfusion Matrix")
    print("----------------")
    print(
        pd.DataFrame(
            results["confusion_matrix"]
        )
    )

    print("\nModel saved to:")
    print(results["model_path"])

    print("\nScaler saved to:")
    print(results["scaler_path"])
