import api from "./axios";

// ✅ Create Account
export const createAccount = async (data, orgId) => {
  return api.post("/accounts", data, {
    headers: {
      "x-org-id": orgId,
    },
  });
};

// ✅ Get All Accounts
export const getAccounts = async (orgId) => {
  const res = await api.get("/accounts", {
    headers: {
      "x-org-id": orgId,
    },
  });
  return res.data.data;
};

// ✅ Get Single Account
export const getAccountById = async (id, orgId) => {
  return api.get(`/accounts/${id}`, {
    headers: {
      "x-org-id": orgId,
    },
  });
};

// ✅ Update Account
export const updateAccount = async (id, data, orgId) => {
  return api.put(`/accounts/${id}`, data, {
    headers: {
      "x-org-id": orgId,
    },
  });
};