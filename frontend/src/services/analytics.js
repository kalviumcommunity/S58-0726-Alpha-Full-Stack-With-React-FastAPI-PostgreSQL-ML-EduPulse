import api from "./api";


// ==============================
// DASHBOARD ANALYTICS
// ==============================

export const getDashboardAnalytics = async () => {
  const response = await api.get(
    "/dashboard/analytics"
  );

  return response.data;
};


// ==============================
// RISK STUDENTS
// ==============================

export const getRiskStudents = async () => {
  const response = await api.get(
    "/dashboard/risk-students"
  );

  return response.data;
};


// ==============================
// STUDENT ANALYTICS
// ==============================

export const getStudentAnalytics = async (
  studentId
) => {
  const response = await api.get(
    `/students/${studentId}/analytics`
  );

  return response.data;
};


// ==============================
// SUBJECT ANALYTICS
// ==============================

export const getSubjectAnalytics = async (
  studentId
) => {
  const response = await api.get(
    `/students/${studentId}/subject-analytics`
  );

  return response.data;
};


// ==============================
// PERFORMANCE TRENDS
// ==============================

export const getPerformanceTrends = async (
  studentId
) => {
  const response = await api.get(
    `/students/${studentId}/performance-trends`
  );

  return response.data;
};


