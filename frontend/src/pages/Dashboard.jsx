import { useCallback, useEffect, useState } from "react";
import "../App.css";

import {
  getDashboardAnalytics,
  getRiskStudents,
  getStudentAnalytics,
} from "../services/analytics";

import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../services/student";
import { getRecommendations } from "../services/recommendations";
import {
  getInterventions,
  updateInterventionStatus,
} from "../services/interventions";

function Dashboard({ onLogout }) {
  // ==============================
  // NAVIGATION
  // ==============================

  const [activeSection, setActiveSection] = useState("dashboard");

  // ==============================
  // STUDENTS
  // ==============================

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // DASHBOARD ANALYTICS
  // ==============================

  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");

  // ==============================
  // RISK MONITORING
  // ==============================

  const [riskStudents, setRiskStudents] = useState([]);
  const [riskLoading, setRiskLoading] = useState(true);
  const [riskError, setRiskError] = useState("");

  // ==============================
  // RECOMMENDATIONS
  // ==============================

  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [recommendationsError, setRecommendationsError] = useState("");

  // ==============================
  // INTERVENTIONS
  // ==============================

  const [interventions, setInterventions] = useState([]);
  const [interventionsLoading, setInterventionsLoading] = useState(true);
  const [interventionsError, setInterventionsError] = useState("");
  const [updatingInterventionId, setUpdatingInterventionId] = useState(null);

  // ==============================
  // STUDENT ANALYTICS
  // ==============================

  const [studentAnalytics, setStudentAnalytics] = useState(null);

  const [studentAnalyticsLoading, setStudentAnalyticsLoading] = useState(false);

  const [studentAnalyticsError, setStudentAnalyticsError] = useState("");

  // ==============================
  // LOAD INTERVENTIONS
  // ==============================

  const loadInterventions = useCallback(async () => {
    setInterventionsLoading(true);

    try {
      const data = await getInterventions();

      setInterventions(data);
      setInterventionsError("");
    } catch (error) {
      console.error("Interventions error:", error);

      setInterventionsError(
        error.response?.data?.detail || "Unable to load interventions",
      );
    } finally {
      setInterventionsLoading(false);
    }
  }, []);

  // ==============================
  // UPDATE INTERVENTION STATUS
  // ==============================

  const handleInterventionStatusChange = async (interventionId, status) => {
    setUpdatingInterventionId(interventionId);

    try {
      const updatedIntervention = await updateInterventionStatus(
        interventionId,
        status,
      );

      setInterventions((current) =>
        current.map((intervention) =>
          intervention.id === updatedIntervention.id
            ? updatedIntervention
            : intervention,
        ),
      );

      setInterventionsError("");
    } catch (error) {
      console.error("Intervention status update error:", error);

      setInterventionsError(
        error.response?.data?.detail || "Unable to update intervention status",
      );
    } finally {
      setUpdatingInterventionId(null);
    }
  };

  // ==============================
  // SEARCH
  // ==============================

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // ==============================
  // SORT
  // ==============================

  const [sortBy, setSortBy] = useState("id");

  const [order, setOrder] = useState("asc");

  // ==============================
  // PAGINATION
  // ==============================

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  // ==============================
  // CREATE
  // ==============================

  const [studentId, setStudentId] = useState("");

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [department, setDepartment] = useState("");

  const [year, setYear] = useState("");

  const [semester, setSemester] = useState("");

  const [creating, setCreating] = useState(false);

  const [createMessage, setCreateMessage] = useState("");

  // ==============================
  // EDIT
  // ==============================

  const [editingId, setEditingId] = useState(null);

  const [editStudentId, setEditStudentId] = useState("");

  const [editName, setEditName] = useState("");

  const [editEmail, setEditEmail] = useState("");

  const [editDepartment, setEditDepartment] = useState("");

  const [editYear, setEditYear] = useState("");

  const [editSemester, setEditSemester] = useState("");

  const [updating, setUpdating] = useState(false);

  // ==============================
  // DETAILS
  // ==============================

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [loadingDetails, setLoadingDetails] = useState(false);

  // ==============================
  // DELETE
  // ==============================

  const [deletingId, setDeletingId] = useState(null);

  // ==============================
  // LOAD DASHBOARD ANALYTICS
  // ==============================

  const loadDashboardAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);

    try {
      const data = await getDashboardAnalytics();

      setAnalytics(data);
      setAnalyticsError("");
    } catch (error) {
      console.error("Dashboard analytics error:", error);

      setAnalyticsError(
        error.response?.data?.detail || "Unable to load dashboard analytics",
      );
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  // ==============================
  // LOAD RISK STUDENTS
  // ==============================

  const loadRiskStudents = useCallback(async () => {
    setRiskLoading(true);

    try {
      const data = await getRiskStudents();

      setRiskStudents(data);
      setRiskError("");
    } catch (error) {
      console.error("Risk students error:", error);

      setRiskError(
        error.response?.data?.detail || "Unable to load risk students",
      );
    } finally {
      setRiskLoading(false);
    }
  }, []);

  // ==============================
  // LOAD RECOMMENDATIONS
  // ==============================

  const loadRecommendations = useCallback(async () => {
    setRecommendationsLoading(true);

    try {
      const data = await getRecommendations();

      setRecommendations(data);
      setRecommendationsError("");
    } catch (error) {
      console.error("Recommendations error:", error);

      setRecommendationsError(
        error.response?.data?.detail || "Unable to load recommendations",
      );
    } finally {
      setRecommendationsLoading(false);
    }
  }, []);

  // ==============================
  // LOAD STUDENT ANALYTICS
  // ==============================

  const loadStudentAnalytics = useCallback(async (studentIdValue) => {
    setStudentAnalyticsLoading(true);
    setStudentAnalyticsError("");

    try {
      const data = await getStudentAnalytics(studentIdValue);

      console.log("Student analytics data:", data);

      setStudentAnalytics(data);
    } catch (error) {
      console.error("Student analytics error:", error);

      setStudentAnalytics(null);

      setStudentAnalyticsError(
        error.response?.data?.detail || "Unable to load student analytics",
      );
    } finally {
      setStudentAnalyticsLoading(false);
    }
  }, []);

  // ==============================
  // LOAD STUDENTS
  // ==============================

  const loadStudents = useCallback(
    async (pageValue, searchValue, sortValue, orderValue) => {
      setLoading(true);

      try {
        const data = await getStudents(
          pageValue,
          limit,
          searchValue,
          sortValue,
          orderValue,
        );

        setStudents(data.data);
        setTotal(data.total);
        setError("");
      } catch (error) {
        console.error("Students error:", error);

        setError(error.response?.data?.detail || "Unable to load students");
      } finally {
        setLoading(false);
      }
    },
    [limit],
  );

  // ==============================
  // INITIAL LOAD
  // ==============================

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStudents(1, "", "id", "asc");
  }, [loadStudents]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboardAnalytics();
  }, [loadDashboardAnalytics]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRiskStudents();
  }, [loadRiskStudents]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRecommendations();
  }, [loadRecommendations]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadInterventions();
  }, [loadInterventions]);

  // ==============================
  // SEARCH
  // ==============================

  const handleSearch = (event) => {
    event.preventDefault();

    setSearch(searchInput);
    setPage(1);

    loadStudents(1, searchInput, sortBy, order);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);

    loadStudents(1, "", sortBy, order);
  };

  // ==============================
  // SORT
  // ==============================

  const handleSort = () => {
    setPage(1);

    loadStudents(1, search, sortBy, order);
  };

  // ==============================
  // PAGINATION
  // ==============================

  const totalPages = Math.ceil(total / limit);

  const handlePreviousPage = () => {
    if (page <= 1) {
      return;
    }

    const newPage = page - 1;

    setPage(newPage);

    loadStudents(newPage, search, sortBy, order);
  };

  const handleNextPage = () => {
    if (page >= totalPages) {
      return;
    }

    const newPage = page + 1;

    setPage(newPage);

    loadStudents(newPage, search, sortBy, order);
  };

  // ==============================
  // CREATE STUDENT
  // ==============================

  const handleCreateStudent = async (event) => {
    event.preventDefault();

    setCreating(true);
    setCreateMessage("");

    try {
      await createStudent({
        student_id: studentId,
        name,
        email,
        department,
        year: Number(year),
        semester: Number(semester),
      });

      setStudentId("");
      setName("");
      setEmail("");
      setDepartment("");
      setYear("");
      setSemester("");

      setCreateMessage("Student created successfully!");

      await loadStudents(page, search, sortBy, order);

      await loadDashboardAnalytics();
      await loadRiskStudents();
    } catch (error) {
      console.error("Create student error:", error);

      setCreateMessage(
        error.response?.data?.detail || "Failed to create student",
      );
    } finally {
      setCreating(false);
    }
  };

  // ==============================
  // VIEW DETAILS
  // ==============================

  const handleViewDetails = async (studentIdValue) => {
    setLoadingDetails(true);

    setStudentAnalytics(null);
    setStudentAnalyticsError("");

    try {
      const student = await getStudentById(studentIdValue);

      setSelectedStudent(student);

      await loadStudentAnalytics(studentIdValue);
    } catch (error) {
      console.error("Student details error:", error);

      alert(error.response?.data?.detail || "Unable to load student details");
    } finally {
      setLoadingDetails(false);
    }
  };

  // ==============================
  // CLOSE DETAILS
  // ==============================

  const handleCloseDetails = () => {
    setSelectedStudent(null);
    setStudentAnalytics(null);
    setStudentAnalyticsError("");
  };

  // ==============================
  // EDIT STUDENT
  // ==============================

  const handleEditStudent = (student) => {
    setEditingId(student.id);

    setEditStudentId(student.student_id);

    setEditName(student.name);
    setEditEmail(student.email);

    setEditDepartment(student.department);

    setEditYear(student.year);
    setEditSemester(student.semester);
  };

  const handleCancelEdit = () => {
    setEditingId(null);

    setEditStudentId("");
    setEditName("");
    setEditEmail("");
    setEditDepartment("");
    setEditYear("");
    setEditSemester("");
  };

  // ==============================
  // UPDATE STUDENT
  // ==============================

  const handleUpdateStudent = async (studentIdValue) => {
    setUpdating(true);

    try {
      const updatedStudent = await updateStudent(studentIdValue, {
        student_id: editStudentId,
        name: editName,
        email: editEmail,
        department: editDepartment,
        year: Number(editYear),
        semester: Number(editSemester),
      });

      setSelectedStudent((currentStudent) => {
        if (currentStudent && currentStudent.id === studentIdValue) {
          return updatedStudent;
        }

        return currentStudent;
      });

      if (selectedStudent && selectedStudent.id === studentIdValue) {
        await loadStudentAnalytics(studentIdValue);
      }

      handleCancelEdit();

      await loadStudents(page, search, sortBy, order);

      await loadDashboardAnalytics();
      await loadRiskStudents();
    } catch (error) {
      console.error("Update student error:", error);

      alert(error.response?.data?.detail || "Failed to update student");
    } finally {
      setUpdating(false);
    }
  };

  // ==============================
  // DELETE STUDENT
  // ==============================

  const handleDeleteStudent = async (studentIdValue) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?",
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(studentIdValue);

    try {
      await deleteStudent(studentIdValue);

      if (selectedStudent && selectedStudent.id === studentIdValue) {
        setSelectedStudent(null);
        setStudentAnalytics(null);
        setStudentAnalyticsError("");
      }

      await loadStudents(page, search, sortBy, order);

      await loadDashboardAnalytics();
      await loadRiskStudents();
    } catch (error) {
      console.error("Delete student error:", error);

      alert(error.response?.data?.detail || "Failed to delete student");
    } finally {
      setDeletingId(null);
    }
  };

  // ==============================
  // RENDER
  // ==============================

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">E</div>
          <div>
            <h2>EduPulse</h2>
            <span>Academic Intelligence</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`sidebar-item ${
              activeSection === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveSection("dashboard")}
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            className={`sidebar-item ${
              activeSection === "students" ? "active" : ""
            }`}
            onClick={() => setActiveSection("students")}
          >
            <span>◉</span>
            Students
          </button>

          <button
            className={`sidebar-item ${
              activeSection === "attendance" ? "active" : ""
            }`}
            onClick={() => setActiveSection("attendance")}
          >
            <span>✓</span>
            Attendance
          </button>

          <button
            className={`sidebar-item ${
              activeSection === "assignments" ? "active" : ""
            }`}
            onClick={() => setActiveSection("assignments")}
          >
            <span>▤</span>
            Assignments
          </button>

          <button
            className={`sidebar-item ${
              activeSection === "exams" ? "active" : ""
            }`}
            onClick={() => setActiveSection("exams")}
          >
            <span>▣</span>
            Exams
          </button>

          <button
            className={`sidebar-item ${
              activeSection === "analytics" ? "active" : ""
            }`}
            onClick={() => setActiveSection("analytics")}
          >
            <span>◫</span>
            Analytics
          </button>

          <button
            className={`sidebar-item ${
              activeSection === "reports" ? "active" : ""
            }`}
            onClick={() => setActiveSection("reports")}
          >
            <span>▥</span>
            Reports
          </button>

          <button
            className={`sidebar-item ${
              activeSection === "recommendations" ? "active" : ""
            }`}
            onClick={() => setActiveSection("recommendations")}
          >
            <span>✦</span>
            Recommendations
          </button>

          <button
            className={`sidebar-item ${
              activeSection === "interventions" ? "active" : ""
            }`}
            onClick={() => setActiveSection("interventions")}
          >
            <span>✓</span>
            Interventions
          </button>

          <button
            className={`sidebar-item ${
              activeSection === "messages" ? "active" : ""
            }`}
            onClick={() => setActiveSection("messages")}
          >
            <span>✉</span>
            Messages
          </button>

          <button
            className={`sidebar-item ${
              activeSection === "settings" ? "active" : ""
            }`}
            onClick={() => setActiveSection("settings")}
          >
            <span>⚙</span>
            Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">F</div>
            <div>
              <strong>Faculty</strong>
              <span>Academic Staff</span>
            </div>
          </div>

          <button className="sidebar-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <div className="topbar-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search students, reports..."
              aria-label="Search"
            />
          </div>

          <div className="topbar-actions">
            <button className="notification-button">🔔</button>

            <div className="topbar-profile">
              <div className="user-avatar">F</div>
              <div>
                <strong>Faculty</strong>
                <span>Academic Staff</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard">
          <div className="dashboard-header">
            <div>
              <h1>EduPulse Dashboard</h1>
              <p>University academic performance and risk monitoring.</p>
            </div>
          </div>
          <hr />
          {activeSection === "dashboard" && (
            <>
              {/* ============================== */}
              {/* ACADEMIC ANALYTICS */}
              {/* ============================== */}
              <section className="dashboard-section">
                <div className="dashboard-section-header">
                  <h2>Academic Analytics</h2>
                  <p>Overview of academic performance across all students.</p>
                </div>

                {analyticsLoading && (
                  <p className="status-message">Loading analytics...</p>
                )}

                {analyticsError && (
                  <p className="error-message">{analyticsError}</p>
                )}

                {analytics && !analyticsLoading && (
                  <div className="analytics-grid">
                    <div className="analytics-card">
                      <h3>Total Students</h3>
                      <div className="analytics-card-value">
                        {analytics.total_students}
                      </div>
                      <div className="analytics-card-label">
                        Students enrolled
                      </div>
                    </div>

                    <div className="analytics-card">
                      <h3>Average Attendance</h3>
                      <div className="analytics-card-value">
                        {analytics.average_attendance}%
                      </div>
                      <div className="analytics-card-label">
                        Overall attendance
                      </div>
                    </div>

                    <div className="analytics-card">
                      <h3>Assignment Completion</h3>
                      <div className="analytics-card-value">
                        {analytics.average_assignment_completion}%
                      </div>
                      <div className="analytics-card-label">
                        Average completion
                      </div>
                    </div>

                    <div className="analytics-card">
                      <h3>Average Exam Score</h3>
                      <div className="analytics-card-value">
                        {analytics.average_exam_score}
                      </div>
                      <div className="analytics-card-label">
                        Overall exam performance
                      </div>
                    </div>

                    <div className="analytics-card">
                      <h3>High Risk Students</h3>
                      <div className="analytics-card-value">
                        {analytics.high_risk_students}
                      </div>
                      <div className="analytics-card-label">
                        Require immediate attention
                      </div>
                    </div>

                    <div className="analytics-card">
                      <h3>Medium Risk Students</h3>
                      <div className="analytics-card-value">
                        {analytics.medium_risk_students}
                      </div>
                      <div className="analytics-card-label">
                        Need monitoring
                      </div>
                    </div>

                    <div className="analytics-card">
                      <h3>Low Risk Students</h3>
                      <div className="analytics-card-value">
                        {analytics.low_risk_students}
                      </div>
                      <div className="analytics-card-label">
                        Performing well
                      </div>
                    </div>

                    <div className="analytics-card">
                      <h3>No Data Students</h3>
                      <div className="analytics-card-value">
                        {analytics.no_data_students}
                      </div>
                      <div className="analytics-card-label">
                        No academic records
                      </div>
                    </div>
                  </div>
                )}
              </section>
              {/* ============================== */}
              {/* RISK MONITORING */}
              {/* ============================== */}
              <section className="dashboard-section">
                <div className="dashboard-section-header">
                  <h2>Risk Monitoring</h2>
                  <p>Students currently requiring academic attention.</p>
                </div>

                {riskLoading && (
                  <p className="status-message">Loading risk students...</p>
                )}

                {riskError && <p className="error-message">{riskError}</p>}

                {!riskLoading && !riskError && riskStudents.length === 0 && (
                  <p className="status-message">
                    No high or medium risk students found.
                  </p>
                )}

                {!riskLoading && !riskError && riskStudents.length > 0 && (
                  <div className="risk-grid">
                    {riskStudents.map((student) => {
                      const riskClass =
                        student.risk_level === "High"
                          ? "risk-high"
                          : student.risk_level === "Medium"
                            ? "risk-medium"
                            : "risk-low";

                      return (
                        <div
                          key={student.student_id}
                          className={`risk-card ${riskClass}`}
                        >
                          <h3>{student.name}</h3>

                          <p>
                            <strong>Student Code:</strong>{" "}
                            {student.student_code}
                          </p>

                          <p>
                            <strong>Attendance:</strong>{" "}
                            {student.attendance_percentage}%
                          </p>

                          <p>
                            <strong>Assignment Completion:</strong>{" "}
                            {student.assignment_completion_rate}%
                          </p>

                          <p>
                            <strong>Average Exam Score:</strong>{" "}
                            {student.average_exam_score}
                          </p>

                          <p>
                            <strong>Risk Level:</strong> {student.risk_level}
                          </p>

                          {student.risk_factors?.length > 0 && (
                            <div className="risk-factors">
                              <h4>Risk Factors</h4>

                              {student.risk_factors.map((factor, index) => (
                                <div
                                  key={`${factor.factor}-${index}`}
                                  className={`risk-factor risk-factor-${factor.severity.toLowerCase()}`}
                                >
                                  <div className="risk-factor-header">
                                    <strong>{factor.factor}</strong>
                                    <span>{factor.severity}</span>
                                  </div>

                                  <p>{factor.message}</p>

                                  <small>Current value: {factor.value}</small>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}

          {activeSection === "students" && (
            <>
              {/* ============================== */}
              {/* CREATE STUDENT */}
              {/* ============================== */}
              <section className="student-form-section">
                <div className="dashboard-section-header">
                  <h2>Create Student</h2>
                  <p>Add a new student to the academic system.</p>
                </div>

                <form className="student-form" onSubmit={handleCreateStudent}>
                  <div className="form-grid">
                    <div className="form-field">
                      <label>Student ID</label>
                      <input
                        type="text"
                        placeholder="Example: STU007"
                        value={studentId}
                        onChange={(event) => setStudentId(event.target.value)}
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label>Name</label>
                      <input
                        type="text"
                        placeholder="Enter student name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label>Email</label>
                      <input
                        type="email"
                        placeholder="Enter student email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label>Department</label>
                      <input
                        type="text"
                        placeholder="Example: Computer Science"
                        value={department}
                        onChange={(event) => setDepartment(event.target.value)}
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label>Year</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        placeholder="Example: 3"
                        value={year}
                        onChange={(event) => setYear(event.target.value)}
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label>Semester</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        placeholder="Example: 6"
                        value={semester}
                        onChange={(event) => setSemester(event.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="student-form-actions">
                    <button type="submit" disabled={creating}>
                      {creating ? "Creating..." : "Create Student"}
                    </button>
                  </div>

                  {createMessage && (
                    <p className="status-message">{createMessage}</p>
                  )}
                </form>
              </section>
              <hr />
              {/* ============================== */}
              {/* SEARCH & SORT */}
              {/* ============================== */}

              <section className="student-tools-section">
                <div className="dashboard-section-header">
                  <h2>Search & Sort Students</h2>
                  <p>
                    Find students and organize the list by academic information.
                  </p>
                </div>

                <div className="dashboard-toolbar">
                  <form className="toolbar-search" onSubmit={handleSearch}>
                    <div className="toolbar-field toolbar-search-field">
                      <label htmlFor="student-search">Search Students</label>

                      <input
                        id="student-search"
                        type="text"
                        placeholder="Search by name"
                        value={searchInput}
                        onChange={(event) => setSearchInput(event.target.value)}
                      />
                    </div>

                    <button type="submit">Search</button>

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={handleClearSearch}
                    >
                      Clear
                    </button>
                  </form>

                  <div className="toolbar-divider" />

                  <div className="toolbar-sort">
                    <div className="toolbar-field">
                      <label htmlFor="sort-by">Sort By</label>

                      <select
                        id="sort-by"
                        value={sortBy}
                        onChange={(event) => setSortBy(event.target.value)}
                      >
                        <option value="id">ID</option>
                        <option value="student_id">Student ID</option>
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                        <option value="department">Department</option>
                        <option value="year">Year</option>
                        <option value="semester">Semester</option>
                      </select>
                    </div>

                    <div className="toolbar-field">
                      <label htmlFor="sort-order">Order</label>

                      <select
                        id="sort-order"
                        value={order}
                        onChange={(event) => setOrder(event.target.value)}
                      >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                      </select>
                    </div>

                    <button type="button" onClick={handleSort}>
                      Apply Sort
                    </button>
                  </div>
                </div>

                {search && (
                  <p className="search-result-message">
                    Showing results for: <strong>{search}</strong>
                  </p>
                )}
              </section>

              <hr />
              {/* ============================== */}
              {/* STUDENT DETAILS */}
              {/* ============================== */}

              {selectedStudent && (
                <section className="student-details">
                  <div className="dashboard-section-header">
                    <h2>Student Details</h2>
                    <p>
                      Academic profile and performance overview for the selected
                      student.
                    </p>
                  </div>

                  <div className="student-details-grid">
                    <div className="student-detail-item">
                      <div className="student-detail-label">ID</div>
                      <div className="student-detail-value">
                        {selectedStudent.id}
                      </div>
                    </div>

                    <div className="student-detail-item">
                      <div className="student-detail-label">Student ID</div>
                      <div className="student-detail-value">
                        {selectedStudent.student_id}
                      </div>
                    </div>

                    <div className="student-detail-item">
                      <div className="student-detail-label">Name</div>
                      <div className="student-detail-value">
                        {selectedStudent.name}
                      </div>
                    </div>

                    <div className="student-detail-item">
                      <div className="student-detail-label">Email</div>
                      <div className="student-detail-value">
                        {selectedStudent.email}
                      </div>
                    </div>

                    <div className="student-detail-item">
                      <div className="student-detail-label">Department</div>
                      <div className="student-detail-value">
                        {selectedStudent.department}
                      </div>
                    </div>

                    <div className="student-detail-item">
                      <div className="student-detail-label">Year</div>
                      <div className="student-detail-value">
                        {selectedStudent.year}
                      </div>
                    </div>

                    <div className="student-detail-item">
                      <div className="student-detail-label">Semester</div>
                      <div className="student-detail-value">
                        {selectedStudent.semester}
                      </div>
                    </div>
                  </div>

                  <div className="student-performance-section">
                    <div className="dashboard-section-header">
                      <h3>Academic Performance</h3>
                      <p>Current engagement and academic indicators.</p>
                    </div>

                    {studentAnalyticsLoading && (
                      <p className="status-message">
                        Loading academic analytics...
                      </p>
                    )}

                    {studentAnalyticsError && (
                      <p className="error-message">{studentAnalyticsError}</p>
                    )}

                    {!studentAnalyticsLoading &&
                      !studentAnalyticsError &&
                      studentAnalytics && (
                        <div className="performance-grid">
                          <div className="performance-card">
                            <div className="performance-card-label">
                              Attendance
                            </div>
                            <div className="performance-card-value">
                              {studentAnalytics.attendance_percentage}%
                            </div>
                          </div>

                          <div className="performance-card">
                            <div className="performance-card-label">
                              Assignment Completion
                            </div>
                            <div className="performance-card-value">
                              {studentAnalytics.assignment_completion_rate}%
                            </div>
                          </div>

                          <div className="performance-card">
                            <div className="performance-card-label">
                              Average Exam Score
                            </div>
                            <div className="performance-card-value">
                              {studentAnalytics.average_exam_score}
                            </div>
                          </div>

                          <div className="performance-card">
                            <div className="performance-card-label">
                              Risk Level
                            </div>
                            <div className="performance-card-value">
                              {studentAnalytics.risk_level}
                            </div>
                          </div>
                        </div>
                      )}

                    <div className="student-details-actions">
                      <button onClick={handleCloseDetails}>
                        Close Details
                      </button>
                    </div>
                  </div>
                </section>
              )}

              <hr />
              {/* ============================== */}
              {/* STUDENTS */}
              {/* ============================== */}

              <section className="students-list-section">
                <div className="dashboard-section-header">
                  <h2>Students</h2>
                  <p>
                    Manage student profiles and review academic information.
                  </p>
                </div>

                {loading && (
                  <p className="status-message">Loading students...</p>
                )}

                {error && <p className="error-message">{error}</p>}

                {loadingDetails && (
                  <p className="status-message">Loading student details...</p>
                )}

                {!loading && !error && students.length === 0 && (
                  <p className="status-message">No students found.</p>
                )}

                {!loading && !error && students.length > 0 && (
                  <div className="student-list">
                    {students.map((student) => (
                      <div className="student-card" key={student.id}>
                        {editingId === student.id ? (
                          <div className="student-edit-form">
                            <div className="student-card-header">
                              <div>
                                <h3>Edit Student</h3>
                                <p>
                                  Update the information for{" "}
                                  <strong>{student.name}</strong>.
                                </p>
                              </div>

                              <span className="student-record-id">
                                ID #{student.id}
                              </span>
                            </div>

                            <div className="form-grid">
                              <div className="form-field">
                                <label>Student ID</label>
                                <input
                                  type="text"
                                  value={editStudentId}
                                  onChange={(event) =>
                                    setEditStudentId(event.target.value)
                                  }
                                />
                              </div>

                              <div className="form-field">
                                <label>Name</label>
                                <input
                                  type="text"
                                  value={editName}
                                  onChange={(event) =>
                                    setEditName(event.target.value)
                                  }
                                />
                              </div>

                              <div className="form-field">
                                <label>Email</label>
                                <input
                                  type="email"
                                  value={editEmail}
                                  onChange={(event) =>
                                    setEditEmail(event.target.value)
                                  }
                                />
                              </div>

                              <div className="form-field">
                                <label>Department</label>
                                <input
                                  type="text"
                                  value={editDepartment}
                                  onChange={(event) =>
                                    setEditDepartment(event.target.value)
                                  }
                                />
                              </div>

                              <div className="form-field">
                                <label>Year</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="5"
                                  value={editYear}
                                  onChange={(event) =>
                                    setEditYear(event.target.value)
                                  }
                                />
                              </div>

                              <div className="form-field">
                                <label>Semester</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={editSemester}
                                  onChange={(event) =>
                                    setEditSemester(event.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <div className="student-actions">
                              <button
                                onClick={() => handleUpdateStudent(student.id)}
                                disabled={updating}
                              >
                                {updating ? "Saving..." : "Save Changes"}
                              </button>

                              <button
                                className="secondary-button"
                                onClick={handleCancelEdit}
                                disabled={updating}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="student-card-header">
                              <div>
                                <h3>{student.name}</h3>
                                <p>
                                  {student.student_id} · {student.department}
                                </p>
                              </div>

                              <span className="student-record-id">
                                ID #{student.id}
                              </span>
                            </div>

                            <div className="student-summary-grid">
                              <div>
                                <span>Email</span>
                                <strong>{student.email}</strong>
                              </div>

                              <div>
                                <span>Year</span>
                                <strong>{student.year}</strong>
                              </div>

                              <div>
                                <span>Semester</span>
                                <strong>{student.semester}</strong>
                              </div>
                            </div>

                            <div className="student-actions">
                              <button
                                onClick={() => handleViewDetails(student.id)}
                              >
                                View Details
                              </button>

                              <button
                                className="secondary-button"
                                onClick={() => handleEditStudent(student)}
                              >
                                Edit
                              </button>

                              <button
                                className="danger-button"
                                onClick={() => handleDeleteStudent(student.id)}
                                disabled={deletingId === student.id}
                              >
                                {deletingId === student.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {!loading && !error && total > 0 && (
                  <div className="pagination">
                    <button onClick={handlePreviousPage} disabled={page === 1}>
                      Previous
                    </button>

                    <span>
                      Page {page} of {totalPages}
                    </span>

                    <button
                      onClick={handleNextPage}
                      disabled={page === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </section>
            </>
          )}

          {activeSection === "recommendations" && (
            <section className="section-card">
              <div className="section-header">
                <div>
                  <h2>Academic Recommendations</h2>
                  <p>
                    Recommended interventions based on student risk factors.
                  </p>
                </div>
              </div>

              {recommendationsLoading && (
                <p className="status-message">Loading recommendations...</p>
              )}

              {recommendationsError && (
                <p className="error-message">{recommendationsError}</p>
              )}

              {!recommendationsLoading &&
                !recommendationsError &&
                recommendations.length === 0 && (
                  <p className="status-message">
                    No academic interventions are currently required.
                  </p>
                )}

              {!recommendationsLoading &&
                !recommendationsError &&
                recommendations.length > 0 && (
                  <div className="recommendations-list">
                    {recommendations.map((student) => (
                      <div
                        key={student.student_id}
                        className="recommendation-student-card"
                      >
                        <div className="recommendation-student-header">
                          <div>
                            <h3>{student.name}</h3>
                            <p>
                              <strong>Student Code:</strong>{" "}
                              {student.student_code}
                            </p>
                          </div>

                          <span
                            className={`risk-badge ${
                              student.risk_level === "High"
                                ? "risk-high"
                                : "risk-medium"
                            }`}
                          >
                            {student.risk_level} Risk
                          </span>
                        </div>

                        <div className="recommendation-probabilities">
                          <strong>ML Risk Probability</strong>

                          <div>
                            Low:{" "}
                            {(
                              (student.ml_risk_probabilities?.Low ?? 0) * 100
                            ).toFixed(1)}
                            %
                          </div>

                          <div>
                            Medium:{" "}
                            {(
                              (student.ml_risk_probabilities?.Medium ?? 0) * 100
                            ).toFixed(1)}
                            %
                          </div>

                          <div>
                            High:{" "}
                            {(
                              (student.ml_risk_probabilities?.High ?? 0) * 100
                            ).toFixed(1)}
                            %
                          </div>
                        </div>

                        <div className="recommendation-items">
                          {student.recommendations.map((recommendation) => (
                            <div
                              key={`${student.student_id}-${recommendation.factor}`}
                              className="recommendation-item"
                            >
                              <div className="recommendation-item-header">
                                <h4>{recommendation.action}</h4>

                                <span
                                  className={`priority-badge priority-${recommendation.priority.toLowerCase()}`}
                                >
                                  {recommendation.priority}
                                </span>
                              </div>

                              <p>
                                <strong>Factor:</strong> {recommendation.factor}
                              </p>

                              <p>
                                <strong>Current Value:</strong>{" "}
                                {recommendation.value}
                              </p>

                              <p>{recommendation.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </section>
          )}

          {activeSection === "interventions" && (
            <section className="section-card">
              <div className="section-header">
                <div>
                  <h2>Intervention Tracking</h2>
                  <p>
                    Track faculty actions taken to support at-risk students.
                  </p>
                </div>
              </div>

              {interventionsLoading && (
                <p className="status-message">Loading interventions...</p>
              )}

              {interventionsError && (
                <p className="error-message">{interventionsError}</p>
              )}

              {!interventionsLoading &&
                !interventionsError &&
                interventions.length === 0 && (
                  <p className="status-message">
                    No interventions have been created yet.
                  </p>
                )}

              {!interventionsLoading &&
                !interventionsError &&
                interventions.length > 0 && (
                  <div className="interventions-list">
                    {interventions.map((intervention) => (
                      <div key={intervention.id} className="intervention-card">
                        <div className="intervention-card-header">
                          <div>
                            <h3>{intervention.action}</h3>

                            <p>
                              <strong>{intervention.student_name}</strong> ·{" "}
                              {intervention.student_code}
                            </p>
                          </div>

                          <span
                            className={`priority-badge priority-${intervention.priority.toLowerCase()}`}
                          >
                            {intervention.priority}
                          </span>
                        </div>

                        <div className="intervention-details">
                          <p>
                            <strong>Risk Factor:</strong> {intervention.factor}
                          </p>

                          <p>
                            <strong>Description:</strong>{" "}
                            {intervention.description}
                          </p>
                        </div>

                        <div className="intervention-footer">
                          <div>
                            <strong>Status:</strong>{" "}
                            <span
                              className={`intervention-status status-${intervention.status
                                .toLowerCase()
                                .replace(" ", "-")}`}
                            >
                              {intervention.status}
                            </span>
                          </div>

                          <select
                            value={intervention.status}
                            disabled={
                              updatingInterventionId === intervention.id
                            }
                            onChange={(event) =>
                              handleInterventionStatusChange(
                                intervention.id,
                                event.target.value,
                              )
                            }
                          >
                            <option value="Pending">Pending</option>

                            <option value="In Progress">In Progress</option>

                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </section>
          )}

          {activeSection !== "dashboard" &&
            activeSection !== "students" &&
            activeSection !== "recommendations" &&
            activeSection !== "interventions" && (
              <section className="module-placeholder">
                <div className="module-placeholder-icon">✦</div>

                <h2>
                  {activeSection.charAt(0).toUpperCase() +
                    activeSection.slice(1)}
                </h2>

                <p>
                  This module is part of the EduPulse roadmap and will be
                  implemented in a future development phase.
                </p>

                <span className="module-placeholder-status">Coming soon</span>
              </section>
            )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
