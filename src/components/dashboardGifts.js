import { useState } from "react";
import { apiDELETE, apiPOST, apiPUT } from "../apis/service";
import { Modal, useConfirm } from "./modal";
import { useToast } from "./toast";
import { changedFields, formatDateTime, formatPrice, isHttpUrl } from "../utils/helpers";

const EMPTY_GIFT = { name: "", description: "", link: "", price: "" };

const toForm = (gift) => ({
  name: gift.name || "",
  description: gift.description || "",
  link: gift.link || "",
  price: gift.price ?? "",
});

const validateGift = (values) => {
  if (!values.name.trim()) return "Gift name is required";
  if (values.link.trim() && !isHttpUrl(values.link.trim())) {
    return "Link must start with http:// or https://";
  }
  if (values.price !== "" && !(Number(values.price) >= 0)) {
    return "Price must be a number of 0 or more";
  }
  return "";
};

// Empty strings clear optional fields; price is sent as a number.
const toPayload = (values) =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      key === "price" ? (value === "" ? "" : Number(value)) : String(value).trim(),
    ])
  );

function GiftForm({ initial = EMPTY_GIFT, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const problem = validateGift(values);
    if (problem) {
      setError(problem);
      return;
    }

    setSaving(true);
    try {
      const done = await onSubmit(values);
      if (done && !onCancel) setValues(EMPTY_GIFT);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label className="field">
        <span>Name *</span>
        <input name="name" value={values.name} onChange={handleChange} maxLength={100} required />
      </label>
      <label className="field">
        <span>Price</span>
        <input
          type="number"
          name="price"
          min="0"
          step="0.01"
          value={values.price}
          onChange={handleChange}
        />
      </label>
      <label className="field field--wide">
        <span>Link</span>
        <input
          type="url"
          name="link"
          value={values.link}
          onChange={handleChange}
          placeholder="https://..."
        />
      </label>
      <label className="field field--wide">
        <span>Description</span>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          rows={2}
          maxLength={500}
        />
      </label>
      <div className="form-actions field--wide">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        )}
        {error && <p className="form-status form-status--error">{error}</p>}
      </div>
    </form>
  );
}

function DashboardGifts({ gifts, onChange, onRefresh }) {
  const showToast = useToast();
  const [confirm, confirmDialog] = useConfirm();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const replaceGift = (gift) =>
    onChange((prev) => prev.map((g) => (g._id === gift._id ? gift : g)));

  const addGift = async (values) => {
    const payload = toPayload(values);
    // Leave out empty optional fields on create.
    Object.keys(payload).forEach((key) => payload[key] === "" && delete payload[key]);

    const gift = await apiPOST("api/dashboard/gifts", payload);
    onChange((prev) => [gift, ...prev]);
    showToast(`Added “${gift.name}”`);
    return true;
  };

  const saveEdit = async (values) => {
    const updates = changedFields(values, toForm(editing));
    if (Object.keys(updates).length === 0) {
      setEditing(null);
      return true;
    }
    const gift = await apiPUT(`api/dashboard/gifts/${editing._id}`, toPayload(updates));
    replaceGift(gift);
    setEditing(null);
    showToast("Gift updated");
    return true;
  };

  const releaseGift = async (gift) => {
    const ok = await confirm({
      title: "Release this gift?",
      message: `“${gift.name}” was booked by ${gift.bookedBy || "a guest"}. Releasing it makes it available for other guests again.`,
      confirmLabel: "Release",
    });
    if (!ok) return;

    setBusyId(gift._id);
    try {
      replaceGift(await apiPOST(`api/dashboard/gifts/${gift._id}/release`));
      showToast(`“${gift.name}” is available again`);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusyId(null);
    }
  };

  const deleteGift = async (gift) => {
    const ok = await confirm({
      title: "Delete this gift?",
      message: `“${gift.name}” will be removed from your registry.`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;

    setBusyId(gift._id);
    try {
      await apiDELETE(`api/dashboard/gifts/${gift._id}`);
      onChange((prev) => prev.filter((g) => g._id !== gift._id));
      showToast(`Deleted “${gift.name}”`);
    } catch (err) {
      showToast(err.message, "error");
      // 409: a guest booked it in the meantime; 404: already gone.
      if (err.status === 409 || err.status === 404) onRefresh();
    } finally {
      setBusyId(null);
    }
  };

  const bookedCount = gifts.filter((g) => g.isBooked).length;

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h2>🎁 Gift registry</h2>
        <button className="btn btn-primary" onClick={() => setShowAdd((v) => !v)}>
          {showAdd ? "Close" : "+ Add gift"}
        </button>
      </div>

      {showAdd && (
        <div className="inline-panel">
          <GiftForm submitLabel="Add gift" onSubmit={addGift} />
        </div>
      )}

      <p className="muted">
        {gifts.length === 0
          ? "No gifts yet. Add the first one above."
          : `${bookedCount} of ${gifts.length} gifts booked`}
      </p>

      {gifts.length > 0 && (
        <div className="table-scroll">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Gift</th>
                <th>Price</th>
                <th>Link</th>
                <th>Status</th>
                <th>Booked By</th>
                <th>Booked At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {gifts.map((gift) => {
                const busy = busyId === gift._id;
                return (
                  <tr key={gift._id}>
                    <td>
                      <strong>{gift.name}</strong>
                      {gift.description && <div className="cell-note">{gift.description}</div>}
                    </td>
                    <td>{formatPrice(gift.price)}</td>
                    <td>
                      {gift.link ? (
                        <a href={gift.link} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <span className={`badge ${gift.isBooked ? "badge--booked" : "badge--available"}`}>
                        {gift.isBooked ? "Booked" : "Available"}
                      </span>
                    </td>
                    <td>{gift.bookedBy || "-"}</td>
                    <td>{gift.isBooked ? formatDateTime(gift.bookedAt) : "-"}</td>
                    <td>
                      <div className="row-actions">
                        <button className="btn btn-sm btn-secondary" onClick={() => setEditing(gift)} disabled={busy}>
                          Edit
                        </button>
                        {gift.isBooked && (
                          <button className="btn btn-sm btn-secondary" onClick={() => releaseGift(gift)} disabled={busy}>
                            {busy ? "..." : "Release"}
                          </button>
                        )}
                        <span title={gift.isBooked ? "Release it first" : undefined}>
                          <button
                            className="btn btn-sm btn-danger-outline"
                            onClick={() => deleteGift(gift)}
                            disabled={busy || gift.isBooked}
                          >
                            Delete
                          </button>
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Modal title={`Edit “${editing.name}”`} onClose={() => setEditing(null)}>
          <GiftForm
            initial={toForm(editing)}
            submitLabel="Save changes"
            onSubmit={saveEdit}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}

      {confirmDialog}
    </div>
  );
}

export default DashboardGifts;
