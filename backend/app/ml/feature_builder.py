from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.models.assignment import Assignment
from app.models.exam import Exam
from app.models.student import Student


def build_student_features(db: Session) -> list[dict]:
    """
    Build one ML feature row for every student.

    The feature builder intentionally does not calculate a risk label.
    It only extracts measurable academic indicators that can later be
    passed to an ML model.
    """

    students = db.query(Student).all()

    feature_rows = []

    for student in students:
        attendance_records = (
            db.query(Attendance)
            .filter(Attendance.student_id == student.id)
            .all()
        )

        assignments = (
            db.query(Assignment)
            .filter(Assignment.student_id == student.id)
            .all()
        )

        exams = (
            db.query(Exam)
            .filter(Exam.student_id == student.id)
            .all()
        )

        # -------------------------
        # Attendance
        # -------------------------

        total_attendance = len(attendance_records)

        present_count = sum(
            1
            for record in attendance_records
            if record.status.lower() == "present"
        )

        attendance_percentage = (
            (present_count / total_attendance) * 100
            if total_attendance
            else 0
        )

        # -------------------------
        # Assignments
        # -------------------------

        total_assignments = len(assignments)

        submitted_assignments = sum(
            1
            for assignment in assignments
            if assignment.submitted
        )

        assignment_completion_rate = (
            (submitted_assignments / total_assignments) * 100
            if total_assignments
            else 0
        )

        assignment_scores = [
            assignment.score
            for assignment in assignments
            if assignment.score is not None
        ]

        average_assignment_score = (
            sum(assignment_scores) / len(assignment_scores)
            if assignment_scores
            else 0
        )

        # -------------------------
        # Exams
        # -------------------------

        quiz_scores = []
        internal_scores = []
        other_exam_scores = []

        for exam in exams:
            exam_type = exam.exam_type.strip().lower()

            if exam_type == "quiz":
                quiz_scores.append(exam.score)

            elif exam_type in {"internal", "internal assessment"}:
                internal_scores.append(exam.score)

            else:
                other_exam_scores.append(exam.score)

        average_quiz_score = (
            sum(quiz_scores) / len(quiz_scores)
            if quiz_scores
            else 0
        )

        average_internal_score = (
            sum(internal_scores) / len(internal_scores)
            if internal_scores
            else 0
        )

        average_exam_score = (
            sum(other_exam_scores) / len(other_exam_scores)
            if other_exam_scores
            else 0
        )

        feature_rows.append(
            {
                "student_id": student.id,
                "attendance_percentage": round(
                    attendance_percentage,
                    2,
                ),
                "assignment_completion_rate": round(
                    assignment_completion_rate,
                    2,
                ),
                "average_assignment_score": round(
                    average_assignment_score,
                    2,
                ),
                "average_quiz_score": round(
                    average_quiz_score,
                    2,
                ),
                "average_internal_score": round(
                    average_internal_score,
                    2,
                ),
                "average_exam_score": round(
                    average_exam_score,
                    2,
                ),
            }
        )

    return feature_rows
