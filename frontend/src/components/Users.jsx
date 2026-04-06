import { useEffect, useState } from "react";
import { getUsers, inviteUser } from "../api/users";

export default function Users({ org }) {
    const [users, setUsers] = useState([]);
    const [invite, setInvite] = useState(false);

    const [form, setForm] = useState({
        email: "",
        role: "ANALYST",
    });

    useEffect(() => {
        if (org) {
            fetchUsers();
        }
    }, [org]);

    const fetchUsers = async () => {
        try {
            const res = await getUsers(org.orgId);
            setUsers(res.data);
        } catch (err) {
            alert("Error fetching Users");
        }
    };

    // ➕ Invite user
    const handleInvite = async () => {
        if (!form.email) {
            alert("Email required");
            return;
        }

        try {
              await inviteUser(form, org.orgId);
            alert("Invitation sent");

            setInvite(false);
            setForm({ email: "", role: "ANALYST" });

            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };

    if (!org) return <div>Please select an organization</div>;

    return (
        <>
            {/* HEADER */}
            <div className="header">
                <h2>Users</h2>
                <button onClick={() => setInvite(true)}>Invite User</button>
            </div>

            {/* INVITE MODAL */}
            {invite && (
                <div className="overlay">
                    <div className="accountsBox">
                        <h2>Invite User</h2>

                        <div className="a">
                            <label>Email</label>
                            <input
                                className="accounts-input"
                                placeholder="user@mail.com"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                            />
                        </div>

                        <div className="a">
                            <label>Role</label>
                            <select
                                className="accounts-input"
                                value={form.role}
                                onChange={(e) =>
                                    setForm({ ...form, role: e.target.value })
                                }
                            >
                                <option value="OWNER">Owner</option>
                                <option value="ADMIN">Admin</option>
                                <option value="ANALYST">Analyst</option>
                                <option value="VIEWER">Viewer</option>
                            </select>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="btn-secondary"
                                onClick={() => setInvite(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleInvite}
                            >
                                Send Invite
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
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((u, i) => (
                                <tr key={i}>
                                    <td>{u.user?.name || "—"}</td>
                                    <td>{u.user?.email || "—"}</td>
                                    <td>{u.role}</td>
                                    <td>
                                        {u.user.status ? "Active" : "Inactive"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}