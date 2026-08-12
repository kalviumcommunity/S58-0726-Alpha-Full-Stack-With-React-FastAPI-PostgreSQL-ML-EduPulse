import { useEffect, useState } from "react";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [creating, setCreating] = useState(false);
  const [createMessage, setCreateMessage] = useState("");

  // EDIT
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [updating, setUpdating] = useState(false);

  // DETAILS
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // DELETE
  const [deletingId, setDeletingId] = useState(null);


  // ==============================
  // LOAD STUDENTS
  // ==============================

  const loadStudents = async (
    pageValue = page,
    searchValue = search,
    sortValue = sortBy,
    orderValue = order
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
  };


  // ==============================
  // INITIAL LOAD
  // ==============================

  useEffect(() => {
    loadStudents(1, "", "id", "asc");
  }, []);


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
        name,
        email,
      });

      setName("");
      setEmail("");

      setCreateMessage(
        "Student created successfully!"
      );

      // Reload current page from backend
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
    studentId
  ) => {
    setLoadingDetails(true);

    try {
      const student =
        await getStudentById(studentId);

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
    setEditName(student.name);
    setEditEmail(student.email);
  };


  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
  };


  // ==============================
  // UPDATE
  // ==============================

  const handleUpdateStudent = async (
    studentId
  ) => {
    setUpdating(true);

    try {
      const updatedStudent =
        await updateStudent(
          studentId,
          {
            name: editName,
            email: editEmail,
          }
        );

      if (
        selectedStudent &&
        selectedStudent.id === studentId
      ) {
        setSelectedStudent(
          updatedStudent
        );
      }

      handleCancelEdit();

      // Reload current page
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
    studentId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this student?"
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(studentId);

    try {
      await deleteStudent(studentId);

      if (
        selectedStudent &&
        selectedStudent.id === studentId
      ) {
        setSelectedStudent(null);
      }

      // Reload current page
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


      {/* ==========================
          CREATE STUDENT
      =========================== */}

      <h2>Create Student</h2>

      <form
        onSubmit={handleCreateStudent}
      >

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


      {/* ==========================
          SEARCH
      =========================== */}

      <h2>Search Students</h2>

      <form onSubmit={handleSearch}>

        <input
          type="text"
          placeholder="Search by name"
          value={searchInput}
          onChange={(e) =>
            setSearchInput(
              e.target.value
            )
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


      {/* ==========================
          SORT
      =========================== */}

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

        <option value="name">
          Name
        </option>

        <option value="email">
          Email
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


      {/* ==========================
          STUDENT DETAILS
      =========================== */}

      {selectedStudent && (
        <div>

          <h2>Student Details</h2>

          <p>
            <strong>ID:</strong>{" "}
            {selectedStudent.id}
          </p>

          <p>
            <strong>Name:</strong>{" "}
            {selectedStudent.name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {selectedStudent.email}
          </p>

          <button
            onClick={handleCloseDetails}
          >
            Close Details
          </button>

          <hr />

        </div>
      )}


      {/* ==========================
          STUDENTS
      =========================== */}

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

              /* EDIT MODE */

              <div>

                <p>
                  <strong>ID:</strong>{" "}
                  {student.id}
                </p>

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
                  onClick={
                    handleCancelEdit
                  }
                  disabled={updating}
                >
                  Cancel
                </button>

              </div>

            ) : (

              /* NORMAL MODE */

              <div>

                <p>
                  <strong>ID:</strong>{" "}
                  {student.id}
                </p>

                <p>
                  <strong>Name:</strong>{" "}
                  {student.name}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {student.email}
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


      {/* ==========================
          PAGINATION
      =========================== */}

      {!loading &&
        !error &&
        total > 0 && (

          <div>

            <p>
              Page {page} of{" "}
              {totalPages}
            </p>

            <button
              onClick={
                handlePreviousPage
              }
              disabled={page === 1}
            >
              Previous
            </button>

            {" "}

            <button
              onClick={
                handleNextPage
              }
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