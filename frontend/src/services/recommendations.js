import api from "./api";

export const getRecommendations = async () => {
  const response = await api.get("/dashboard/recommendations");
  return response.data;
};
