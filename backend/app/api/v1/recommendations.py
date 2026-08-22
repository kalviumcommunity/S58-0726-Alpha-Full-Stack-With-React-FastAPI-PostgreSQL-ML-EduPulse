from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.base import SessionLocal
from app.dependencies.auth_dependency import get_current_user
from app.ml.feature_builder import build_student_features
from app.ml.prediction_service import predict_risk
from app.models.student import Student
from app.services.recommendation_service import generate_recommendations


router = APIRouter(
    prefix="/dashboard",
    tags=["Recommendations"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("/recommendations")
def get_recommendations(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    students = db.query(Student).all()

    feature_rows = build_student_features(db)

    feature_map = {
        row["student_id"]: row
        for row in feature_rows
    }

    recommendation_students = []

    for student in students:
        features = feature_map.get(student.id)

        if not features:
            continue

        prediction = predict_risk(features)

        if prediction["risk_level"] not in ["High", "Medium"]:
            continue

        recommendations = generate_recommendations(
            features
        )

        if not recommendations:
            continue

        recommendation_students.append(
            {
                "student_id": student.id,
                "student_code": student.student_id,
                "name": student.name,
                "risk_level": prediction["risk_level"],
                "ml_risk_probabilities": prediction[
                    "risk_probabilities"
                ],
                "recommendations": recommendations,
            }
        )

    return recommendation_students
