import api from "./api";

export const getInterventions = async () => {
  const response = await api.get("/dashboard/interventions");
  return response.data;
};

export const updateInterventionStatus = async (
  interventionId,
  status,
) => {
  const response = await api.patch(
    `/dashboard/interventions/${interventionId}/status`,
    { status },
  );

  return response.data;
};
