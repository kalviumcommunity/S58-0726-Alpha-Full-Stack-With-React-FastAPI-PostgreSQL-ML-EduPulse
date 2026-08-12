import api from "./api";

export const getStudents = async (
  page = 1,
  limit = 5,
  search = "",
  sortBy = "id",
  order = "asc"
) => {
  const response = await api.get("/students", {
    params: {
      page,
      limit,
      search: search || undefined,
      sort_by: sortBy,
      order,
    },
  });

  return response.data;
};

export const getStudentById = async (studentId) => {
  const response = await api.get(`/students/${studentId}`);
  return response.data;
};

export const createStudent = async (student) => {
  const response = await api.post("/students", student);
  return response.data;
};

export const updateStudent = async (studentId, student) => {
  const response = await api.put(
    `/students/${studentId}`,
    student
  );

  return response.data;
};

export const deleteStudent = async (studentId) => {
  const response = await api.delete(
    `/students/${studentId}`
  );

  return response.data;
};