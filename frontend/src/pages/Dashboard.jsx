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

function Dashboard({ onLogout }) {
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
  // STUDENT ANALYTICS
  // ==============================

  const [studentAnalytics, setStudentAnalytics] = useState(null);

  const [studentAnalyticsLoading, setStudentAnalyticsLoading] = useState(false);

  const [studentAnalyticsError, setStudentAnalyticsError] = useState("");

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
          <button className="sidebar-item active">
            <span>▦</span>
            Dashboard
          </button>

          <button className="sidebar-item">
            <span>◉</span>
            Students
          </button>

          <button className="sidebar-item">
            <span>✓</span>
            Attendance
          </button>

          <button className="sidebar-item">
            <span>▤</span>
            Assignments
          </button>

          <button className="sidebar-item">
            <span>▣</span>
            Exams
          </button>

          <button className="sidebar-item">
            <span>◫</span>
            Analytics
          </button>

          <button className="sidebar-item">
            <span>▥</span>
            Reports
          </button>

          <button className="sidebar-item">
            <span>✦</span>
            Recommendations
          </button>

          <button className="sidebar-item">
            <span>✉</span>
            Messages
          </button>

          <button className="sidebar-item">
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
                  <div className="analytics-card-label">Students enrolled</div>
                </div>

                <div className="analytics-card">
                  <h3>Average Attendance</h3>
                  <div className="analytics-card-value">
                    {analytics.average_attendance}%
                  </div>
                  <div className="analytics-card-label">Overall attendance</div>
                </div>

                <div className="analytics-card">
                  <h3>Assignment Completion</h3>
                  <div className="analytics-card-value">
                    {analytics.average_assignment_completion}%
                  </div>
                  <div className="analytics-card-label">Average completion</div>
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
                  <div className="analytics-card-label">Need monitoring</div>
                </div>

                <div className="analytics-card">
                  <h3>Low Risk Students</h3>
                  <div className="analytics-card-value">
                    {analytics.low_risk_students}
                  </div>
                  <div className="analytics-card-label">Performing well</div>
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
                        <strong>Student Code:</strong> {student.student_code}
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
                    </div>
                  );
                })}
              </div>
            )}
          </section>
          <hr />
          <hr />
          {/* ============================== */}
          {/* CREATE STUDENT */}
          {/* ============================== */}
          <h2>Create Student</h2>
          <form onSubmit={handleCreateStudent}>
            <div>
              <label>Student ID</label>

              <br />

              <input
                type="text"
                placeholder="Example: STU007"
                value={studentId}
                onChange={(event) => setStudentId(event.target.value)}
                required
              />
            </div>

            <br />

            <div>
              <label>Name</label>

              <br />

              <input
                type="text"
                placeholder="Enter student name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <br />

            <div>
              <label>Email</label>

              <br />

              <input
                type="email"
                placeholder="Enter student email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <br />

            <div>
              <label>Department</label>

              <br />

              <input
                type="text"
                placeholder="Example: Computer Science"
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                required
              />
            </div>

            <br />

            <div>
              <label>Year</label>

              <br />

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

            <br />

            <div>
              <label>Semester</label>

              <br />

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

            <br />

            <button type="submit" disabled={creating}>
              {creating ? "Creating..." : "Create Student"}
            </button>
          </form>
          {createMessage && <p>{createMessage}</p>}
          <hr />
          {/* ============================== */}
          {/* SEARCH */}
          {/* ============================== */}
          <h2>Search Students</h2>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by name"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />{" "}
            <button type="submit">Search</button>{" "}
            <button type="button" onClick={handleClearSearch}>
              Clear
            </button>
          </form>
          {search && (
            <p>
              Showing results for: <strong>{search}</strong>
            </p>
          )}
          <br />
          {/* ============================== */}
          {/* SORT */}
          {/* ============================== */}
          <h2>Sort Students</h2>
          <label>Sort by: </label>
          <select
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
          </select>{" "}
          <select
            value={order}
            onChange={(event) => setOrder(event.target.value)}
          >
            <option value="asc">Ascending</option>

            <option value="desc">Descending</option>
          </select>{" "}
          <button onClick={handleSort}>Apply Sort</button>
          <hr />
          {/* ============================== */}
          {/* STUDENT DETAILS */}
          {/* ============================== */}
          {selectedStudent && (
            <div>
              <h2>Student Details</h2>

              <p>
                <strong>ID:</strong> {selectedStudent.id}
              </p>

              <p>
                <strong>Student ID:</strong> {selectedStudent.student_id}
              </p>

              <p>
                <strong>Name:</strong> {selectedStudent.name}
              </p>

              <p>
                <strong>Email:</strong> {selectedStudent.email}
              </p>

              <p>
                <strong>Department:</strong> {selectedStudent.department}
              </p>

              <p>
                <strong>Year:</strong> {selectedStudent.year}
              </p>

              <p>
                <strong>Semester:</strong> {selectedStudent.semester}
              </p>

              <hr />

              <h3>Academic Performance</h3>

              {studentAnalyticsLoading && <p>Loading academic analytics...</p>}

              {studentAnalyticsError && <p>{studentAnalyticsError}</p>}

              {!studentAnalyticsLoading &&
                !studentAnalyticsError &&
                studentAnalytics && (
                  <div>
                    <p>
                      <strong>Attendance:</strong>{" "}
                      {studentAnalytics.attendance_percentage}%
                    </p>

                    <p>
                      <strong>Assignment Completion:</strong>{" "}
                      {studentAnalytics.assignment_completion_rate}%
                    </p>

                    <p>
                      <strong>Average Exam Score:</strong>{" "}
                      {studentAnalytics.average_exam_score}
                    </p>

                    <p>
                      <strong>Risk Level:</strong> {studentAnalytics.risk_level}
                    </p>
                  </div>
                )}

              <br />

              <button onClick={handleCloseDetails}>Close Details</button>
            </div>
          )}
          <hr />
          {/* ============================== */}
          {/* STUDENTS */}
          {/* ============================== */}
          <h2>Students</h2>
          {loading && <p>Loading students...</p>}
          {error && <p>{error}</p>}
          {loadingDetails && <p>Loading student details...</p>}
          {!loading && !error && students.length === 0 && (
            <p>No students found.</p>
          )}
          {!loading &&
            !error &&
            students.map((student) => (
              <div key={student.id}>
                {editingId === student.id ? (
                  <div>
                    <p>
                      <strong></strong> {student.id}
                    </p>
                    <label>Student ID</label>
                    <br />
                    <input
                      type="text"
                      value={editStudentId}
                      onChange={(event) => setEditStudentId(event.target.value)}
                    />
                    <br />
                    <br />
                    <label>Name</label>
                    <br />
                    <input
                      type="text"
                      value={editName}
                      onChange={(event) => setEditName(event.target.value)}
                    />
                    <br />
                    <br />
                    <label>Email</label>
                    <br />
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(event) => setEditEmail(event.target.value)}
                    />
                    <br />
                    <br />
                    <label>Department</label>
                    <br />
                    <input
                      type="text"
                      value={editDepartment}
                      onChange={(event) =>
                        setEditDepartment(event.target.value)
                      }
                    />
                    <br />
                    <br />
                    <label>Year</label>
                    <br />
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={editYear}
                      onChange={(event) => setEditYear(event.target.value)}
                    />
                    <br />
                    <br />
                    <label>Semester</label>
                    <br />
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={editSemester}
                      onChange={(event) => setEditSemester(event.target.value)}
                    />
                    <br />
                    <br />
                    <button
                      onClick={() => handleUpdateStudent(student.id)}
                      disabled={updating}
                    >
                      {updating ? "Saving..." : "Save"}
                    </button>{" "}
                    <button onClick={handleCancelEdit} disabled={updating}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <p>
                      <strong>ID:</strong> {student.id}
                    </p>
                    <p>
                      <strong>Student ID:</strong> {student.student_id}
                    </p>
                    <p>
                      <strong>Name:</strong> {student.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {student.email}
                    </p>
                    <p>
                      <strong>Department:</strong> {student.department}
                    </p>
                    <p>
                      <strong>Year:</strong> {student.year}
                    </p>
                    <p>
                      <strong>Semester:</strong> {student.semester}
                    </p>
                    <button onClick={() => handleViewDetails(student.id)}>
                      View Details
                    </button>{" "}
                    <button onClick={() => handleEditStudent(student)}>
                      Edit
                    </button>{" "}
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      disabled={deletingId === student.id}
                    >
                      {deletingId === student.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                )}

                <hr />
              </div>
            ))}
          {/* ============================== */}
          {/* PAGINATION */}
          {/* ============================== */}
          {!loading && !error && total > 0 && (
            <div>
              <p>
                Page {page} of {totalPages}
              </p>
              <button onClick={handlePreviousPage} disabled={page === 1}>
                Previous
              </button>{" "}
              <button onClick={handleNextPage} disabled={page === totalPages}>
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
