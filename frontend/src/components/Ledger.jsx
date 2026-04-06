import { useEffect, useState } from "react";
import { getAccounts } from "../api/accounts";
import { getLedger } from "../api/ledger";

export default function Ledger({ org }) {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [ledger, setLedger] = useState([]);

  useEffect(() => {
    if (org) {
      fetchAccounts();
    }
  }, [org]);

  const fetchAccounts = async () => {
    try {
      const res = await getAccounts(org.orgId);
      setAccounts(res);
    } catch (err) {
      alert("Error fetching accounts");
    }
  };

  const fetchLedger = async (accountId) => {
    try {
      const data = await getLedger(accountId, org.orgId);
      setLedger(data);
    } catch (err) {
      alert("Error fetching ledger");
    }
  };

  const handleSelect = (e) => {
    const id = e.target.value;
    setSelectedAccount(id);

    if (id) {
      fetchLedger(id);
    }
  };

  if (!org) return <div>Please select an organization</div>;

  return (
    <>
      {/* HEADER */}
      <div className="header">
        <h2>Ledger</h2>
      </div>

      {/* ACCOUNT SELECT */}
      <div className="ledger-filter">
        <label>Select Account</label>
        <select
          className="input"
          value={selectedAccount}
          onChange={handleSelect}
        >
          <option value="">-- Select Account --</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name} ({acc.type})
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="table">
        {selectedAccount ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {ledger.length > 0 ? (
                ledger.map((row, i) => (
                  <tr key={i}>
                    <td>
                      {new Date(row.date).toLocaleDateString()}
                    </td>
                    <td>{row.description}</td>
                    <td>{row.debit || "—"}</td>
                    <td>{row.credit || "—"}</td>
                    <td>{row.balance}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No entries yet</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <p>Select an account to view ledger</p>
        )}
      </div>
    </>
  );
}