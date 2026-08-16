import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../services/student";


function Dashboard({ onLogout }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // SEARCH
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // SORT
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("asc");

  // PAGINATION
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  // CREATE
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  const [creating, setCreating] = useState(false);
  const [createMessage, setCreateMessage] = useState("");

  // EDIT
  const [editingId, setEditingId] = useState(null);

  const [editStudentId, setEditStudentId] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [editYear, setEditYear] = useState("");
  const [editSemester, setEditSemester] = useState("");

  const [updating, setUpdating] = useState(false);

  // DETAILS
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // DELETE
  const [deletingId, setDeletingId] = useState(null);


  // ==============================
  // LOAD STUDENTS
  // ==============================

  const loadStudents = useCallback(async (
    pageValue,
    searchValue,
    sortValue,
    orderValue
  ) => {
    setLoading(true);

    try {
      const data = await getStudents(
        pageValue,
        limit,
        searchValue,
        sortValue,
        orderValue
      );

      setStudents(data.data);
      setTotal(data.total);
      setError("");

    } catch (error) {
      console.error(
        "Students error:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Unable to load students"
      );

    } finally {
      setLoading(false);
    }
  }, [limit]);


  // ==============================
  // INITIAL LOAD
  // ==============================

  useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  loadStudents(1, "", "id", "asc");
}, [loadStudents]);


  // ==============================
  // SEARCH
  // ==============================

  const handleSearch = (e) => {
    e.preventDefault();

    const newSearch = searchInput;

    setSearch(newSearch);
    setPage(1);

    loadStudents(
      1,
      newSearch,
      sortBy,
      order
    );
  };


  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);

    loadStudents(
      1,
      "",
      sortBy,
      order
    );
  };


  // ==============================
  // SORT
  // ==============================

  const handleSort = () => {
    setPage(1);

    loadStudents(
      1,
      search,
      sortBy,
      order
    );
  };


  // ==============================
  // PAGINATION
  // ==============================

  const totalPages = Math.ceil(
    total / limit
  );


  const handlePreviousPage = () => {
    if (page <= 1) {
      return;
    }

    const newPage = page - 1;

    setPage(newPage);

    loadStudents(
      newPage,
      search,
      sortBy,
      order
    );
  };


  const handleNextPage = () => {
    if (page >= totalPages) {
      return;
    }

    const newPage = page + 1;

    setPage(newPage);

    loadStudents(
      newPage,
      search,
      sortBy,
      order
    );
  };


  // ==============================
  // CREATE
  // ==============================

  const handleCreateStudent = async (e) => {
    e.preventDefault();

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

      setCreateMessage(
        "Student created successfully!"
      );

      await loadStudents(
        page,
        search,
        sortBy,
        order
      );

    } catch (error) {
      console.error(
        "Create student error:",
        error
      );

      setCreateMessage(
        error.response?.data?.detail ||
        "Failed to create student"
      );

    } finally {
      setCreating(false);
    }
  };


  // ==============================
  // VIEW DETAILS
  // ==============================

  const handleViewDetails = async (
    studentIdValue
  ) => {
    setLoadingDetails(true);

    try {
      const student =
        await getStudentById(studentIdValue);

      setSelectedStudent(student);

    } catch (error) {
      console.error(
        "Student details error:",
        error
      );

      alert(
        error.response?.data?.detail ||
        "Unable to load student details"
      );

    } finally {
      setLoadingDetails(false);
    }
  };


  // ==============================
  // CLOSE DETAILS
  // ==============================

  const handleCloseDetails = () => {
    setSelectedStudent(null);
  };


  // ==============================
  // EDIT
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
  // UPDATE
  // ==============================

  const handleUpdateStudent = async (
    studentIdValue
  ) => {
    setUpdating(true);

    try {
      const updatedStudent =
        await updateStudent(
          studentIdValue,
          {
            student_id: editStudentId,
            name: editName,
            email: editEmail,
            department: editDepartment,
            year: Number(editYear),
            semester: Number(editSemester),
          }
        );

      if (
        selectedStudent &&
        selectedStudent.id === studentIdValue
      ) {
        setSelectedStudent(
          updatedStudent
        );
      }

      handleCancelEdit();

      await loadStudents(
        page,
        search,
        sortBy,
        order
      );

    } catch (error) {
      console.error(
        "Update student error:",
        error
      );

      alert(
        error.response?.data?.detail ||
        "Failed to update student"
      );

    } finally {
      setUpdating(false);
    }
  };


  // ==============================
  // DELETE
  // ==============================

  const handleDeleteStudent = async (
    studentIdValue
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this student?"
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(studentIdValue);

    try {
      await deleteStudent(studentIdValue);

      if (
        selectedStudent &&
        selectedStudent.id === studentIdValue
      ) {
        setSelectedStudent(null);
      }

      await loadStudents(
        page,
        search,
        sortBy,
        order
      );

    } catch (error) {
      console.error(
        "Delete student error:",
        error
      );

      alert(
        error.response?.data?.detail ||
        "Failed to delete student"
      );

    } finally {
      setDeletingId(null);
    }
  };


  return (
    <div>

      <h1>EduPulse Dashboard</h1>

      <button onClick={onLogout}>
        Logout
      </button>

      <hr />

      <h2>Create Student</h2>

      <form onSubmit={handleCreateStudent}>

        <div>
          <label>Student ID</label>
          <br />

          <input
            type="text"
            placeholder="Example: STU007"
            value={studentId}
            onChange={(e) =>
              setStudentId(e.target.value)
            }
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
            onChange={(e) =>
              setName(e.target.value)
            }
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
            onChange={(e) =>
              setEmail(e.target.value)
            }
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
            onChange={(e) =>
              setDepartment(e.target.value)
            }
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
            onChange={(e) =>
              setYear(e.target.value)
            }
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
            onChange={(e) =>
              setSemester(e.target.value)
            }
            required
          />
        </div>

        <br />

        <button
          type="submit"
          disabled={creating}
        >
          {creating
            ? "Creating..."
            : "Create Student"}
        </button>

      </form>

      {createMessage && (
        <p>{createMessage}</p>
      )}

      <hr />

      <h2>Search Students</h2>

      <form onSubmit={handleSearch}>

        <input
          type="text"
          placeholder="Search by name"
          value={searchInput}
          onChange={(e) =>
            setSearchInput(e.target.value)
          }
        />

        {" "}

        <button type="submit">
          Search
        </button>

        {" "}

        <button
          type="button"
          onClick={handleClearSearch}
        >
          Clear
        </button>

      </form>

      {search && (
        <p>
          Showing results for:{" "}
          <strong>{search}</strong>
        </p>
      )}

      <br />

      <h2>Sort Students</h2>

      <label>
        Sort by:{" "}
      </label>

      <select
        value={sortBy}
        onChange={(e) =>
          setSortBy(e.target.value)
        }
      >
        <option value="id">
          ID
        </option>

        <option value="student_id">
          Student ID
        </option>

        <option value="name">
          Name
        </option>

        <option value="email">
          Email
        </option>

        <option value="department">
          Department
        </option>

        <option value="year">
          Year
        </option>

        <option value="semester">
          Semester
        </option>
      </select>

      {" "}

      <select
        value={order}
        onChange={(e) =>
          setOrder(e.target.value)
        }
      >
        <option value="asc">
          Ascending
        </option>

        <option value="desc">
          Descending
        </option>
      </select>

      {" "}

      <button onClick={handleSort}>
        Apply Sort
      </button>

      <hr />

      {selectedStudent && (
        <div>

          <h2>Student Details</h2>

          <p>
            <strong>ID:</strong>{" "}
            {selectedStudent.id}
          </p>

          <p>
            <strong>Student ID:</strong>{" "}
            {selectedStudent.student_id}
          </p>

          <p>
            <strong>Name:</strong>{" "}
            {selectedStudent.name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {selectedStudent.email}
          </p>

          <p>
            <strong>Department:</strong>{" "}
            {selectedStudent.department}
          </p>

          <p>
            <strong>Year:</strong>{" "}
            {selectedStudent.year}
          </p>

          <p>
            <strong>Semester:</strong>{" "}
            {selectedStudent.semester}
          </p>

          <button
            onClick={handleCloseDetails}
          >
            Close Details
          </button>

          <hr />

        </div>
      )}

      <h2>Students</h2>

      {loading && (
        <p>Loading students...</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {loadingDetails && (
        <p>
          Loading student details...
        </p>
      )}

      {!loading &&
        !error &&
        students.length === 0 && (
          <p>
            No students found.
          </p>
        )}

      {!loading &&
        !error &&
        students.map((student) => (

          <div key={student.id}>

            {editingId === student.id ? (

              <div>

                <p>
                  <strong>ID:</strong>{" "}
                  {student.id}
                </p>

                <label>
                  Student ID
                </label>

                <br />

                <input
                  type="text"
                  value={editStudentId}
                  onChange={(e) =>
                    setEditStudentId(
                      e.target.value
                    )
                  }
                />

                <br />
                <br />

                <label>
                  Name
                </label>

                <br />

                <input
                  type="text"
                  value={editName}
                  onChange={(e) =>
                    setEditName(
                      e.target.value
                    )
                  }
                />

                <br />
                <br />

                <label>
                  Email
                </label>

                <br />

                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) =>
                    setEditEmail(
                      e.target.value
                    )
                  }
                />

                <br />
                <br />

                <label>
                  Department
                </label>

                <br />

                <input
                  type="text"
                  value={editDepartment}
                  onChange={(e) =>
                    setEditDepartment(
                      e.target.value
                    )
                  }
                />

                <br />
                <br />

                <label>
                  Year
                </label>

                <br />

                <input
                  type="number"
                  min="1"
                  max="5"
                  value={editYear}
                  onChange={(e) =>
                    setEditYear(
                      e.target.value
                    )
                  }
                />

                <br />
                <br />

                <label>
                  Semester
                </label>

                <br />

                <input
                  type="number"
                  min="1"
                  max="10"
                  value={editSemester}
                  onChange={(e) =>
                    setEditSemester(
                      e.target.value
                    )
                  }
                />

                <br />
                <br />

                <button
                  onClick={() =>
                    handleUpdateStudent(
                      student.id
                    )
                  }
                  disabled={updating}
                >
                  {updating
                    ? "Saving..."
                    : "Save"}
                </button>

                {" "}

                <button
                  onClick={handleCancelEdit}
                  disabled={updating}
                >
                  Cancel
                </button>

              </div>

            ) : (

              <div>

                <p>
                  <strong>ID:</strong>{" "}
                  {student.id}
                </p>

                <p>
                  <strong>Student ID:</strong>{" "}
                  {student.student_id}
                </p>

                <p>
                  <strong>Name:</strong>{" "}
                  {student.name}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {student.email}
                </p>

                <p>
                  <strong>Department:</strong>{" "}
                  {student.department}
                </p>

                <p>
                  <strong>Year:</strong>{" "}
                  {student.year}
                </p>

                <p>
                  <strong>Semester:</strong>{" "}
                  {student.semester}
                </p>

                <button
                  onClick={() =>
                    handleViewDetails(
                      student.id
                    )
                  }
                >
                  View Details
                </button>

                {" "}

                <button
                  onClick={() =>
                    handleEditStudent(
                      student
                    )
                  }
                >
                  Edit
                </button>

                {" "}

                <button
                  onClick={() =>
                    handleDeleteStudent(
                      student.id
                    )
                  }
                  disabled={
                    deletingId ===
                    student.id
                  }
                >
                  {deletingId ===
                  student.id
                    ? "Deleting..."
                    : "Delete"}
                </button>

              </div>

            )}

            <hr />

          </div>

        ))}

      {!loading &&
        !error &&
        total > 0 && (

          <div>

            <p>
              Page {page} of{" "}
              {totalPages}
            </p>

            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
            >
              Previous
            </button>

            {" "}

            <button
              onClick={handleNextPage}
              disabled={
                page === totalPages
              }
            >
              Next
            </button>

          </div>

        )}

    </div>
  );
}


export default Dashboard;