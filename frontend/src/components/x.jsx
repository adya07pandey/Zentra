import { useState } from "react";
import axios from "axios";
import "./transactions.css";

export default function Transactions() {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    description: "",
    entries: [
      { accountId: "", type: "DEBIT", amount: "" },
      { accountId: "", type: "CREDIT", amount: "" },
    ],
  });

  // totals
  const totalDebit = form.entries
    .filter((e) => e.type === "DEBIT")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const totalCredit = form.entries
    .filter((e) => e.type === "CREDIT")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const addRow = () => {
    setForm({
      ...form,
      entries: [...form.entries, { accountId: "", type: "DEBIT", amount: "" }],
    });
  };

  const removeRow = (index) => {
    const updated = form.entries.filter((_, i) => i !== index);
    setForm({ ...form, entries: updated });
  };

  const handleChange = (index, field, value) => {
    const updated = [...form.entries];
    updated[index][field] = value;
    setForm({ ...form, entries: updated });
  };

  const handleSubmit = async () => {
    if (!isBalanced) {
      alert("Transaction must be balanced");
      return;
    }

    try {
      await axios.post("/api/transactions", form);
      alert("Transaction created");
      setOpen(false);

      setForm({
        description: "",
        entries: [
          { accountId: "", type: "DEBIT", amount: "" },
          { accountId: "", type: "CREDIT", amount: "" },
        ],
      });
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="transactions-page">
      {/* HEADER */}
      <div className="transactions-header">
        <h2>Transactions</h2>
        <button
          className="btn-primary"
          onClick={() => setOpen(true)}
        >
          + Transaction
        </button>
      </div>

      {/* TABLE */}
      <div className="transactions-table">
        <p className="empty-text">No transactions yet</p>
      </div>

      {/* MODAL */}
      {open && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Transaction</h3>

            {/* Description */}
            <input
              type="text"
              placeholder="Description"
              className="input"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            {/* Entries */}
            <div className="entries">
              {form.entries.map((entry, index) => (
                <div className="entry-row" key={index}>
                  <input
                    className="input"
                    placeholder="Account ID"
                    value={entry.accountId}
                    onChange={(e) =>
                      handleChange(index, "accountId", e.target.value)
                    }
                  />

                  <select
                    className="input"
                    value={entry.type}
                    onChange={(e) =>
                      handleChange(index, "type", e.target.value)
                    }
                  >
                    <option value="DEBIT">Debit</option>
                    <option value="CREDIT">Credit</option>
                  </select>

                  <input
                    type="number"
                    className="input"
                    placeholder="Amount"
                    value={entry.amount}
                    onChange={(e) =>
                      handleChange(index, "amount", e.target.value)
                    }
                  />

                  <button
                    className="btn-danger"
                    onClick={() => removeRow(index)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            {/* Add row */}
            <button className="link-btn" onClick={addRow}>
              + Add Entry
            </button>

            {/* Totals */}
            <div className="totals">
              <p>Debit: {totalDebit}</p>
              <p>Credit: {totalCredit}</p>
              <p className={isBalanced ? "balanced" : "not-balanced"}>
                {isBalanced ? "Balanced ✅" : "Not Balanced ❌"}
              </p>
            </div>

            {/* Actions */}
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setOpen(false)}
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
    </div>
  );
}