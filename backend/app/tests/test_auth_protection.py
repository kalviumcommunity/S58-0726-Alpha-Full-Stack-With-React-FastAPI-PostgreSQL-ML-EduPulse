from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_students_endpoint_requires_authentication():
    response = client.get("/students")

    assert response.status_code in [401, 403]


def test_student_detail_endpoint_requires_authentication():
    response = client.get("/students/1")

    assert response.status_code in [401, 403]


def test_attendance_endpoint_requires_authentication():
    response = client.get("/students/1/attendance")

    assert response.status_code in [401, 403]


def test_analytics_endpoint_requires_authentication():
    response = client.get("/students/1/analytics")

    assert response.status_code in [401, 403]


def test_dashboard_endpoint_requires_authentication():
    response = client.get("/dashboard/analytics")

    assert response.status_code in [401, 403]


def test_risk_endpoint_requires_authentication():
    response = client.get("/dashboard/risk-students")

    assert response.status_code in [401, 403]