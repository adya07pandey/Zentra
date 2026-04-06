import { useEffect, useState } from "react";
import { createAccount, getAccountById, getAccounts, updateAccount } from "../api/accounts";

export default function Accounts({ org }) {
  const [newAccount, setNewAccount] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    type: "ASSET",
  });

  useEffect(() => {
    if (org) {
      console.log("Selected Org:", org.orgId, org.orgName);
      fetchAccounts();
    }
  }, [org]);

  if (!org) return <div>Please select an organization</div>;

  // 📥 Fetch accounts
  const fetchAccounts = async () => {
    try {
      const res = await getAccounts(org.orgId);
      setAccounts(res);
    } catch (err) {
      alert("Error fetching accounts");
    }
  };

  // ➕ Create account
  const handleSubmit = async () => {
    if (!form.name) {
      alert("Account name required");
      return;
    }

    try {
      if (editId) {
        // ✏️ UPDATE
        await updateAccount(editId, form, org.orgId);
        alert("Account updated");
      } else {
        // ➕ CREATE
        await createAccount(form, org.orgId);
        alert("Account created");
      }

      setNewAccount(false);
      setEditId(null);
      setForm({ name: "", type: "ASSET" });

      fetchAccounts();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };
  const handleEdit = async (id) => {
    try {
      const res = await getAccountById(id, org.orgId);

      setForm({
        name: res.data.name,
        type: res.data.type,
      });

      setEditId(id);
      setNewAccount(true);
    } catch (err) {
      alert("Error loading account");
    }
  };
  return (
    <>
      {/* HEADER */}
      <div className="header">
        <h2>Accounts</h2>
        <button onClick={() => setNewAccount(true)}>+ Account</button>
      </div>

      {/* MODAL */}
      {newAccount && (
        <div className="overlay">
          <div className="accountsBox">
            <h2>{editId ? "Edit Account" : "Add Account"}</h2>
            <div className="a">
              <label>Name</label>
              <input
                className="accounts-input"
                placeholder="Cash / Revenue / Food"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

            </div>
            <div className="a">

              <label>Type</label>
              <select
                className="accounts-input"
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
              >
                <option value="ASSET">Asset</option>
                <option value="LIABILITY">Liability</option>
                <option value="REVENUE">Revenue</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setNewAccount(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length > 0 ? (
              accounts.map((acc) => (
                <tr key={acc.id}>
                  <td>{acc.name}</td>
                  <td>{acc.type}</td>
                  <td>{new Date(acc.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleEdit(acc.id)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No accounts yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}