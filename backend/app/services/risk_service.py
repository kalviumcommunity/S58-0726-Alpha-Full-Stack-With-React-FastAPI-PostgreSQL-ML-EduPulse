from sqlalchemy.orm import Session

from app.ml.feature_builder import build_student_features
from app.ml.prediction_service import predict_risk
from app.models.student import Student


def get_risk_students(db: Session):
    students = db.query(Student).all()

    feature_rows = build_student_features(db)

    feature_map = {
        row["student_id"]: row
        for row in feature_rows
    }

    risk_students = []

    for student in students:
        features = feature_map.get(student.id)

        if not features:
            continue

        prediction = predict_risk(features)

        if prediction["risk_level"] not in ["High", "Medium"]:
            continue

        risk_students.append(
            {
                "student_id": student.id,
                "student_code": student.student_id,
                "name": student.name,
                "attendance_percentage": features[
                    "attendance_percentage"
                ],
                "assignment_completion_rate": features[
                    "assignment_completion_rate"
                ],
                "average_exam_score": features[
                    "average_exam_score"
                ],
                "risk_level": prediction["risk_level"],
                "ml_risk_level": prediction["risk_level"],
                "ml_risk_probabilities": prediction[
                    "risk_probabilities"
                ],
            }
        )

    return risk_students
