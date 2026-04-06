import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { acceptInvite } from "../api/users";

export default function AcceptInvite() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [form, setForm] = useState({
    name: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Invalid invite link.");
      return;
    }

    if (!form.name || !form.password) {
      alert("All fields are required");
      return;
    }

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // ✅ Call the backend API
      await acceptInvite({ token, name: form.name, password: form.password });
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || "Error accepting invite");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SUCCESS STATE
  if (success) {
    return (
      <div className="acceptInvitepage">
        <div className="invite-box">
          <h2>✅ Account Created</h2>
          <p>You can now login with your credentials.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="acceptInvitepage">
      <div className="invite-box">
        <h2>Accept Invite</h2>

        {!token ? (
          <p className="error-text">Invalid or expired invite link</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}