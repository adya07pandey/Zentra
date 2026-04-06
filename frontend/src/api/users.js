import api from "./axios";

// ✅ Get Users
export const getUsers = async (orgId) => {
  const res = await api.get("/users", {
    headers: {
      "x-org-id": orgId,
    },
  });
  return res.data;
};

// ✅ Invite User
export const inviteUser = async (data, orgId) => {
  const res = await api.post("/users/invite", data, {
    headers: {
      "x-org-id": orgId,
    },
  });
  return res.data;
};

export const acceptInvite = async (data) => {
  // data should include: { token, password, name }
  const res = await api.post("/users/accept-invite", data);
  return res.data;
};
