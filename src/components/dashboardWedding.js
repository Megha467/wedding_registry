import { useState } from "react";
import { apiPUT } from "../apis/service";
import { changedFields, toDateInput } from "../utils/helpers";

const toForm = (wedding) => ({
  title: wedding.title || "",
  date: toDateInput(wedding.date),
  venue: wedding.venue || "",
  description: wedding.description || "",
});

function DashboardWedding({ wedding, onSaved }) {
  const [form, setForm] = useState(() => toForm(wedding));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // { type, message }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (!form.title.trim()) {
      setStatus({ type: "error", message: "Title is required" });
      return;
    }

    const updates = changedFields(form, toForm(wedding));
    if (Object.keys(updates).length === 0) {
      setStatus({ type: "success", message: "Nothing to save, everything is up to date." });
      return;
    }

    setSaving(true);
    try {
      const saved = await apiPUT("api/dashboard/wedding", updates);
      onSaved(saved);
      setForm(toForm(saved));
      setStatus({ type: "success", message: "Wedding details saved ✓" });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-card">
      <h2>💒 Wedding details</h2>
      <p className="muted">These details appear on your public wedding page and on invites.</p>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="field field--wide">
          <span>Title *</span>
          <input name="title" value={form.title} onChange={handleChange} maxLength={150} required />
        </label>

        <label className="field">
          <span>Date</span>
          <input type="date" name="date" value={form.date} onChange={handleChange} />
        </label>

        <label className="field">
          <span>Venue</span>
          <input
            name="venue"
            value={form.venue}
            onChange={handleChange}
            placeholder="e.g. The Grand Palace, Jaipur"
          />
        </label>

        <label className="field field--wide">
          <span>Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="A note for your guests: schedule, dress code, directions..."
          />
        </label>

        <div className="form-actions field--wide">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save details"}
          </button>
          {status && <p className={`form-status form-status--${status.type}`}>{status.message}</p>}
        </div>
      </form>
    </div>
  );
}

export default DashboardWedding;
