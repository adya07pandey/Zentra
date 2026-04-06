import api from "./axios";

// ✅ Create Transaction
export const createTransaction = async (data, orgId) => {
  const res = await api.post("/transactions", data, {
    headers: {
      "x-org-id": orgId,
    },
  });
  return res.data;
};

// ✅ Get All Transactions
export const getAllTransactions = async (orgId, page) => {
  console.log(page)
  const res = await api.get(`/transactions?page=${page}&limit=10`, {
    headers: {
      "x-org-id": orgId,
    },
  });
  console.log(res.data.data)
  return res.data;
};

// ✅ Get Transaction by ID
export const getTransaction = async (id, orgId) => {
  const res = await api.get(`/transactions/${id}`, {
    headers: {
      "x-org-id": orgId,
    },
  });
  return res.data;
};

// ✅ Reverse Transaction
export const reverseTransaction = async (id, orgId) => {
  const res = await api.post(
    `/transactions/${id}/reverse`,
    {},
    {
      headers: {
        "x-org-id": orgId,
      },
    }
  );
  return res.data;
};