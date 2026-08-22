from app.ml.risk_factors import analyze_risk_factors


RECOMMENDATION_MAP = {
    "Attendance": {
        "action": "Attendance Improvement Plan",
        "priority": "High",
        "description": (
            "Monitor attendance closely and discuss barriers "
            "affecting regular class participation."
        ),
    },
    "Assignment Completion": {
        "action": "Assignment Catch-up",
        "priority": "High",
        "description": (
            "Identify incomplete assignments and create a "
            "short-term submission plan."
        ),
    },
    "Assignment Performance": {
        "action": "Assignment Academic Support",
        "priority": "Medium",
        "description": (
            "Review assignment mistakes and provide targeted "
            "academic guidance."
        ),
    },
    "Quiz Performance": {
        "action": "Quiz Revision Support",
        "priority": "Medium",
        "description": (
            "Recommend revision of weak topics and additional "
            "practice before the next assessment."
        ),
    },
    "Internal Assessment": {
        "action": "Internal Assessment Support",
        "priority": "High",
        "description": (
            "Review internal assessment performance and identify "
            "subjects requiring faculty intervention."
        ),
    },
    "Exam Performance": {
        "action": "Exam Preparation Support",
        "priority": "High",
        "description": (
            "Create an exam preparation plan focused on weak "
            "subjects and concepts."
        ),
    },
}


def generate_recommendations(features: dict) -> list[dict]:
    """
    Generate actionable academic recommendations from
    measurable student risk factors.

    This layer does not change the ML prediction.
    """

    risk_factors = analyze_risk_factors(features)

    recommendations = []

    for factor in risk_factors:
        recommendation = RECOMMENDATION_MAP.get(
            factor["factor"]
        )

        if not recommendation:
            continue

        recommendations.append(
            {
                "factor": factor["factor"],
                "severity": factor["severity"],
                "value": factor["value"],
                "action": recommendation["action"],
                "priority": recommendation["priority"],
                "description": recommendation["description"],
            }
        )

    return recommendations
