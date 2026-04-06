import api from "./axios";

export const getDashboard = async (orgId) => {
  const res = await api.get("/dashboard", {
    headers: {
      "x-org-id": orgId,
    },
  });
  return res.data;
};