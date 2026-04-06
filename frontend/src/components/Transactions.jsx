import { useEffect, useState } from "react";
import { createTransaction, getAllTransactions, getTransaction, reverseTransaction } from "../api/transactions";
import { getAccounts } from "../api/accounts";

export default function Transactions({ org }) {
    const [newTransaction, setNewTransaction] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [form, setForm] = useState({
        description: "",
        entries: [
            { accountId: "", type: "DEBIT", amount: "" },
            { accountId: "", type: "CREDIT", amount: "" },
        ],
    });
    useEffect(() => {
        if (org) {
            fetchAccounts();
            fetchTransactions(page);
        }
    }, [org,page]);
    const handleRowClick = async (id) => {
        try {
            const data = await getTransaction(id, org.orgId);
            setSelectedTransaction(data);
        } catch (err) {
            alert("Error loading transaction");
        }
    };
    const handleReverse = async () => {
        try {
            await reverseTransaction(selectedTransaction.id, org.orgId);
            alert("Transaction reversed");

            setSelectedTransaction(null);
            fetchTransactions(); // refresh table
        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };
    const fetchTransactions = async (p) => {
        console.log(p)
        const res = await getAllTransactions(org.orgId, p);

        setTransactions(res.data);
        setTotalPages(res.pagination.totalPages);
    };

    const fetchAccounts = async () => {
        try {
            const res = await getAccounts(org.orgId);
            setAccounts(res);
        } catch (err) {
            alert("Error fetching accounts");
        }
    };

    if (!org) return <div>Please select an organization</div>;
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

        if (!org) {
            alert("No organization selected");
            return;
        }

        try {
            // Include orgId in the transaction payload

            console.log(org)
            await createTransaction(form, org.orgId); // <-- pass orgId as 2nd argument
            setNewTransaction(false);
            fetchTransactions();
            alert("Transaction created");

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
        <>
            <div className="header">
                <h2>Transactions</h2>
                <button onClick={() => { setNewTransaction(true) }} >+ Transactions</button>
            </div>

            {newTransaction &&
                <>
                    <div className="overlay">
                        <div className="transactionBox">
                            <h2>Add Transaction</h2>
                            <label htmlFor="">Description</label>
                            <input
                                type="text"
                                placeholder="Office Rent..."
                                className="description-input"
                                value={form.description}
                                onChange={(e) =>
                                    setForm({ ...form, description: e.target.value })
                                }
                            />

                            {/* Entries */}
                            <div className="entries">
                                <label htmlFor="">Entries</label>
                                {form.entries.map((entry, index) => (
                                    <div className="entry-row" key={index}>
                                        <select
                                            className="input"
                                            value={entry.accountId}
                                            onChange={(e) =>
                                                handleChange(index, "accountId", e.target.value)
                                            }
                                        >
                                            <option value="">Select Account</option>

                                            {accounts.map((acc) => (
                                                <option key={acc.id} value={acc.id}>
                                                    {acc.name} ({acc.type})
                                                </option>
                                            ))}
                                        </select>

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
                                    onClick={() => setNewTransaction(false)}
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
                </>
            }
            {selectedTransaction ? (
                <div className="transaction-detail">

                    <button
                        className="btn-secondary"
                        onClick={() => setSelectedTransaction(null)}
                    >
                        ← Back
                    </button>

                    <h2>{selectedTransaction.description}</h2>

                    <div className="detail-meta">
                        <p><b>Status:</b> {selectedTransaction.status}</p>
                        <p><b>Date:</b> {new Date(selectedTransaction.createdAt).toLocaleDateString()}</p>
                        <p><b>Created By:</b> {selectedTransaction.createdBy.name}</p>
                    </div>

                    {/* ENTRIES TABLE */}
                    <table>
                        <thead>
                            <tr>
                                <th>Account</th>
                                <th>Type</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedTransaction.entries.map((e, i) => (
                                <tr key={i}>
                                    <td>{e.accountName}</td>
                                    <td>{e.type}</td>
                                    <td>{e.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* REVERSE BUTTON */}
                    {!selectedTransaction.isReversed && (
                        <button className="btn-danger" onClick={handleReverse}>
                            Reverse Transaction
                        </button>
                    )}

                </div>
            ) : (
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Created By</th>
                                <th>Date</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((t) => (
                                <tr key={t.id} onClick={() => handleRowClick(t.id)}>
                                    <td>{t.id.slice(0, 3)}...</td>
                                    <td>{t.description}</td>
                                    <td>{t.status}</td>
                                    <td>{t.createdBy}</td>
                                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                                    <td>{t.debit > 0 ? t.debit : t.credit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
  <button
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
  >
    Prev
  </button>

  <span>Page {page} of {totalPages}</span>

  <button
    disabled={page === totalPages}
    onClick={() => setPage(page + 1)}
  >
    Next
  </button>
</div>
                </div>
                
            )}
        </>
    )
}