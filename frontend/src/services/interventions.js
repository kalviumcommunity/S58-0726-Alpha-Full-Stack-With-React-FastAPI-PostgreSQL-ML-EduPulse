import api from "./api";

export const getInterventions = async () => {
  const response = await api.get("/dashboard/interventions");
  return response.data;
};

export const createIntervention = async (data) => {
  const response = await api.post("/dashboard/interventions", data);
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

export const updateInterventionOutcome = async (
  interventionId,
  outcome,
  outcomeNotes,
  outcomeDate,
) => {
  const response = await api.patch(
    `/dashboard/interventions/${interventionId}/outcome`,
    {
      outcome,
      outcome_notes: outcomeNotes,
      outcome_date: outcomeDate,
    },
  );

  return response.data;
};
