import numpy as np
import pandas as pd


FEATURE_COLUMNS = [
    "attendance_percentage",
    "assignment_completion_rate",
    "average_assignment_score",
    "average_quiz_score",
    "average_internal_score",
    "average_exam_score",
]


def generate_training_dataset(
    n_samples: int = 1000,
    random_state: int = 42,
) -> pd.DataFrame:
    """
    Generate a reproducible synthetic academic dataset.

    The dataset contains three academic-risk groups with realistic
    differences in engagement and performance.

    Labels:
        0 = Low Risk
        1 = Medium Risk
        2 = High Risk
    """

    rng = np.random.default_rng(random_state)

    # -------------------------------------------------
    # Risk group distribution
    # -------------------------------------------------

    risk_group = rng.choice(
        [0, 1, 2],
        size=n_samples,
        p=[0.50, 0.30, 0.20],
    )

    attendance = np.zeros(n_samples)
    assignment_completion = np.zeros(n_samples)
    assignment_score = np.zeros(n_samples)
    quiz_score = np.zeros(n_samples)
    internal_score = np.zeros(n_samples)
    exam_score = np.zeros(n_samples)

    # -------------------------------------------------
    # Generate academic behaviour by risk group
    # -------------------------------------------------

    for label in [0, 1, 2]:
        mask = risk_group == label
        count = mask.sum()

        if label == 0:
            # Low-risk students
            attendance[mask] = rng.normal(88, 7, count)
            assignment_completion[mask] = rng.normal(88, 7, count)
            assignment_score[mask] = rng.normal(82, 8, count)
            quiz_score[mask] = rng.normal(82, 8, count)
            internal_score[mask] = rng.normal(80, 9, count)
            exam_score[mask] = rng.normal(82, 8, count)

        elif label == 1:
            # Medium-risk students
            attendance[mask] = rng.normal(72, 8, count)
            assignment_completion[mask] = rng.normal(70, 9, count)
            assignment_score[mask] = rng.normal(65, 10, count)
            quiz_score[mask] = rng.normal(64, 10, count)
            internal_score[mask] = rng.normal(62, 10, count)
            exam_score[mask] = rng.normal(64, 10, count)

        else:
            # High-risk students
            attendance[mask] = rng.normal(50, 10, count)
            assignment_completion[mask] = rng.normal(48, 11, count)
            assignment_score[mask] = rng.normal(45, 12, count)
            quiz_score[mask] = rng.normal(44, 12, count)
            internal_score[mask] = rng.normal(42, 12, count)
            exam_score[mask] = rng.normal(43, 12, count)

    # Keep all academic values inside valid percentage ranges.
    attendance = np.clip(attendance, 0, 100)
    assignment_completion = np.clip(
        assignment_completion,
        0,
        100,
    )
    assignment_score = np.clip(
        assignment_score,
        0,
        100,
    )
    quiz_score = np.clip(
        quiz_score,
        0,
        100,
    )
    internal_score = np.clip(
        internal_score,
        0,
        100,
    )
    exam_score = np.clip(
        exam_score,
        0,
        100,
    )

    return pd.DataFrame(
        {
            "attendance_percentage": np.round(
                attendance,
                2,
            ),
            "assignment_completion_rate": np.round(
                assignment_completion,
                2,
            ),
            "average_assignment_score": np.round(
                assignment_score,
                2,
            ),
            "average_quiz_score": np.round(
                quiz_score,
                2,
            ),
            "average_internal_score": np.round(
                internal_score,
                2,
            ),
            "average_exam_score": np.round(
                exam_score,
                2,
            ),
            "risk_label": risk_group,
        }
    )
