from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.models.assignment import Assignment
from app.models.exam import Exam
from app.services.academic_validation import validate_student_exists


def get_student_analytics(db: Session, student_id: int):
    # Make sure the student exists
    validate_student_exists(db, student_id)

    # -------------------------
    # Attendance
    # -------------------------
    attendance_records = (
        db.query(Attendance)
        .filter(Attendance.student_id == student_id)
        .all()
    )

    total_attendance = len(attendance_records)

    present_count = sum(
        1
        for record in attendance_records
        if record.status.lower() == "present"
    )

    attendance_percentage = (
        (present_count / total_attendance) * 100
        if total_attendance > 0
        else 0
    )

    # -------------------------
    # Assignments
    # -------------------------
    assignments = (
        db.query(Assignment)
        .filter(Assignment.student_id == student_id)
        .all()
    )

    total_assignments = len(assignments)

    submitted_assignments = sum(
        1
        for assignment in assignments
        if assignment.submitted
    )

    assignment_completion_rate = (
        (submitted_assignments / total_assignments) * 100
        if total_assignments > 0
        else 0
    )

    # -------------------------
    # Exams
    # -------------------------
    exams = (
        db.query(Exam)
        .filter(Exam.student_id == student_id)
        .all()
    )

    average_exam_score = (
        sum(exam.score for exam in exams) / len(exams)
        if exams
        else 0
    )

    # -------------------------
    # Risk Level
    # -------------------------
    if (
        attendance_percentage < 60
        or assignment_completion_rate < 60
        or average_exam_score < 50
    ):
        risk_level = "High"

    elif (
        attendance_percentage < 75
        or assignment_completion_rate < 75
        or average_exam_score < 65
    ):
        risk_level = "Medium"

    else:
        risk_level = "Low"

    return {
        "student_id": student_id,
        "attendance_percentage": round(attendance_percentage, 2),
        "assignment_completion_rate": round(
            assignment_completion_rate,
            2
        ),
        "average_exam_score": round(average_exam_score, 2),
        "risk_level": risk_level
    }