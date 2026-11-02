import { useState } from "react";
import { apiPUT, saveSession } from "../apis/service";
import { changedFields, isEmail } from "../utils/helpers";

const MIN_PASSWORD = 6;

function ProfileForm({ couple, onSaved }) {
  const original = { coupleName: couple.coupleName || "", email: couple.email || "" };
  const [form, setForm] = useState(original);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const values = { coupleName: form.coupleName.trim(), email: form.email.trim() };
    if (!values.coupleName) {
      setStatus({ type: "error", message: "Couple name is required" });
      return;
    }
    if (!isEmail(values.email)) {
      setStatus({ type: "error", message: "Please enter a valid email" });
      return;
    }

    const updates = changedFields(values, original);
    if (Object.keys(updates).length === 0) {
      setStatus({ type: "success", message: "Nothing to save, everything is up to date." });
      return;
    }

    setSaving(true);
    try {
      const res = await apiPUT("api/dashboard/profile", updates);
      saveSession({ user: res.user });
      onSaved(res.user);
      setForm({ coupleName: res.user.coupleName, email: res.user.email });
      setStatus({ type: "success", message: res.message || "Profile updated ✓" });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-card">
      <h2>👤 Profile</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="field">
          <span>Couple name</span>
          <input name="coupleName" value={form.coupleName} onChange={handleChange} maxLength={100} required />
        </label>
        <label className="field">
          <span>Email</span>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <div className="form-actions field--wide">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save profile"}
          </button>
          {status && <p className={`form-status form-status--${status.type}`}>{status.message}</p>}
        </div>
      </form>
    </div>
  );
}

const EMPTY_PASSWORDS = { currentPassword: "", newPassword: "", confirmPassword: "" };

function PasswordForm() {
  const [form, setForm] = useState(EMPTY_PASSWORDS);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (form.newPassword.length < MIN_PASSWORD) {
      setStatus({ type: "error", message: `New password must be at least ${MIN_PASSWORD} characters` });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setStatus({ type: "error", message: "New passwords don't match" });
      return;
    }

    setSaving(true);
    try {
      const res = await apiPUT("api/dashboard/password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setForm(EMPTY_PASSWORDS);
      setStatus({ type: "success", message: res.message || "Password changed ✓" });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-card">
      <h2>🔒 Change password</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="field field--wide">
          <span>Current password</span>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </label>
        <label className="field">
          <span>New password</span>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            minLength={MIN_PASSWORD}
            autoComplete="new-password"
            required
          />
        </label>
        <label className="field">
          <span>Confirm new password</span>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            minLength={MIN_PASSWORD}
            autoComplete="new-password"
            required
          />
        </label>
        <div className="form-actions field--wide">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Change password"}
          </button>
          {status && <p className={`form-status form-status--${status.type}`}>{status.message}</p>}
        </div>
      </form>
    </div>
  );
}

function DashboardAccount({ couple, onProfileSaved }) {
  return (
    <>
      <ProfileForm couple={couple} onSaved={onProfileSaved} />
      <PasswordForm />
    </>
  );
}

export default DashboardAccount;
