from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.models.assignment import Assignment
from app.models.exam import Exam
from app.services.academic_validation import validate_student_exists


def get_subject_analytics(db: Session, student_id: int):
    # Make sure the student exists
    validate_student_exists(db, student_id)

    # Get all academic records for the student
    attendance_records = (
        db.query(Attendance)
        .filter(Attendance.student_id == student_id)
        .all()
    )

    assignments = (
        db.query(Assignment)
        .filter(Assignment.student_id == student_id)
        .all()
    )

    exams = (
        db.query(Exam)
        .filter(Exam.student_id == student_id)
        .all()
    )

    # Find all subjects across attendance, assignments and exams
    subjects = set()

    subjects.update(
        record.subject
        for record in attendance_records
    )

    subjects.update(
        assignment.subject
        for assignment in assignments
    )

    subjects.update(
        exam.subject
        for exam in exams
    )

    subject_analytics = []

    for subject in sorted(subjects):

        # -------------------------
        # Attendance
        # -------------------------
        subject_attendance = [
            record
            for record in attendance_records
            if record.subject == subject
        ]

        total_attendance = len(subject_attendance)

        present_count = sum(
            1
            for record in subject_attendance
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
        subject_assignments = [
            assignment
            for assignment in assignments
            if assignment.subject == subject
        ]

        total_assignments = len(subject_assignments)

        submitted_assignments = sum(
            1
            for assignment in subject_assignments
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
        subject_exams = [
            exam
            for exam in exams
            if exam.subject == subject
        ]

        average_exam_score = (
            sum(exam.score for exam in subject_exams)
            / len(subject_exams)
            if subject_exams
            else 0
        )

        subject_analytics.append({
            "subject": subject,
            "attendance_percentage": round(
                attendance_percentage,
                2
            ),
            "assignment_completion_rate": round(
                assignment_completion_rate,
                2
            ),
            "average_exam_score": round(
                average_exam_score,
                2
            )
        })

    return subject_analytics