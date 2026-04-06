import api from "./axios";

export const getLedger = async (accountId, orgId) => {
    
  const res = await api.get(`/ledger/accounts/${accountId}`, {
    headers: {
      "x-org-id": orgId,
    },
  });
  
  return res.data.data;
};

