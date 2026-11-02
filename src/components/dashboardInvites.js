import { useState } from "react";
import { apiDELETE, apiPOST, apiPUT } from "../apis/service";
import { Modal, useConfirm } from "./modal";
import { useToast } from "./toast";
import CopyButton from "./copyButton";
import { changedFields, formatDate, inviteUrl, isEmail, whatsappUrl } from "../utils/helpers";

const MAX_GUESTS = 20;

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "attending", label: "Attending" },
  { key: "declined", label: "Declined" },
];

const STATUS_LABELS = {
  pending: "Pending",
  attending: "Attending",
  declined: "Declined",
};

const EMPTY_INVITE = { name: "", email: "", phone: "", relation: "", guestsCount: 1, note: "" };

const toForm = (invite) => ({
  name: invite.name || "",
  email: invite.email || "",
  phone: invite.phone || "",
  relation: invite.relation || "",
  guestsCount: invite.guestsCount ?? 1,
  note: invite.note || "",
});

const validateInvite = (values) => {
  if (!values.name.trim()) return "Name is required";
  if (values.email.trim() && !isEmail(values.email.trim())) return "Email is not valid";
  const guests = Number(values.guestsCount);
  if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) {
    return `Number of guests must be between 1 and ${MAX_GUESTS}`;
  }
  return "";
};

const toPayload = (values) =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      key === "guestsCount" ? Number(value) : String(value).trim(),
    ])
  );

const range = (n) => Array.from({ length: n }, (_, i) => i + 1);

function InviteForm({ initial = EMPTY_INVITE, submitLabel, onSubmit, onCancel }) {
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

    const problem = validateInvite(values);
    if (problem) {
      setError(problem);
      return;
    }

    setSaving(true);
    try {
      const done = await onSubmit(values);
      if (done && !onCancel) setValues(EMPTY_INVITE);
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
        <span>Relation</span>
        <input
          name="relation"
          value={values.relation}
          onChange={handleChange}
          maxLength={50}
          placeholder="Friend, Cousin..."
        />
      </label>
      <label className="field">
        <span>Email</span>
        <input type="email" name="email" value={values.email} onChange={handleChange} />
      </label>
      <label className="field">
        <span>Phone</span>
        <input type="tel" name="phone" value={values.phone} onChange={handleChange} maxLength={30} />
      </label>
      <label className="field">
        <span>Number of guests</span>
        <input
          type="number"
          name="guestsCount"
          min="1"
          max={MAX_GUESTS}
          step="1"
          value={values.guestsCount}
          onChange={handleChange}
          required
        />
      </label>
      <label className="field field--wide">
        <span>Private note <small>(only you can see this)</small></span>
        <textarea name="note" value={values.note} onChange={handleChange} rows={2} maxLength={500} />
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

function RsvpForm({ invite, onSubmit, onCancel }) {
  const [status, setStatus] = useState(invite.rsvpStatus);
  const [count, setCount] = useState(invite.attendingCount || invite.guestsCount);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      await onSubmit({
        rsvpStatus: status,
        ...(status === "attending" ? { attendingCount: Number(count) } : {}),
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rsvp-form">
      <p className="muted">Record an answer {invite.name} gave you in person or by phone.</p>
      <div className="choice-group" role="radiogroup">
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <label key={key} className={`choice ${status === key ? "choice--active" : ""}`}>
            <input
              type="radio"
              name="rsvpStatus"
              value={key}
              checked={status === key}
              onChange={() => setStatus(key)}
            />
            {label}
          </label>
        ))}
      </div>

      {status === "attending" && (
        <label className="field">
          <span>Guests attending (of {invite.guestsCount})</span>
          <select value={count} onChange={(e) => setCount(e.target.value)}>
            {range(invite.guestsCount).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save RSVP"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        {error && <p className="form-status form-status--error">{error}</p>}
      </div>
    </form>
  );
}

function DashboardInvites({ invites, wedding, couple, stats, onChange }) {
  const showToast = useToast();
  const [confirm, confirmDialog] = useConfirm();
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [settingRsvp, setSettingRsvp] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const replaceInvite = (invite) =>
    onChange((prev) => prev.map((i) => (i._id === invite._id ? invite : i)));

  const inviteMessage = (invite) => {
    const date = formatDate(wedding.date);
    return (
      `Hi ${invite.name}! 💌 You're invited to ${wedding.title || `${couple.coupleName}'s wedding`}` +
      `${date ? ` on ${date}` : ""}${wedding.venue ? ` at ${wedding.venue}` : ""}.\n` +
      `Please let us know if you can make it: ${inviteUrl(invite.inviteCode)}\n` +
      `— ${couple.coupleName}`
    );
  };

  const mailtoUrl = (invite) =>
    `mailto:${invite.email}?subject=${encodeURIComponent(
      `You're invited: ${wedding.title || couple.coupleName}`
    )}&body=${encodeURIComponent(inviteMessage(invite))}`;

  const addInvite = async (values) => {
    const payload = toPayload(values);
    Object.keys(payload).forEach((key) => payload[key] === "" && delete payload[key]);

    const invite = await apiPOST("api/dashboard/invites", payload);
    onChange((prev) => [invite, ...prev]);
    showToast(`Invite created for ${invite.name}`);
    return true;
  };

  const saveEdit = async (values) => {
    const updates = changedFields(values, toForm(editing));
    if (Object.keys(updates).length === 0) {
      setEditing(null);
      return true;
    }
    replaceInvite(await apiPUT(`api/dashboard/invites/${editing._id}`, toPayload(updates)));
    setEditing(null);
    showToast("Invite updated");
    return true;
  };

  const saveRsvp = async (rsvp) => {
    replaceInvite(await apiPUT(`api/dashboard/invites/${settingRsvp._id}`, rsvp));
    setSettingRsvp(null);
    showToast("RSVP updated");
  };

  const deleteInvite = async (invite) => {
    const ok = await confirm({
      title: "Delete this invite?",
      message: `The invite for ${invite.name} will be removed and their link will stop working.`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;

    setBusyId(invite._id);
    try {
      await apiDELETE(`api/dashboard/invites/${invite._id}`);
      onChange((prev) => prev.filter((i) => i._id !== invite._id));
      showToast(`Deleted invite for ${invite.name}`);
    } catch (err) {
      showToast(err.message, "error");
      if (err.status === 404) onChange((prev) => prev.filter((i) => i._id !== invite._id));
    } finally {
      setBusyId(null);
    }
  };

  const visible = filter === "all" ? invites : invites.filter((i) => i.rsvpStatus === filter);

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h2>✉️ Invites</h2>
        <button className="btn btn-primary" onClick={() => setShowAdd((v) => !v)}>
          {showAdd ? "Close" : "+ Add invite"}
        </button>
      </div>

      {showAdd && (
        <div className="inline-panel">
          <InviteForm submitLabel="Create invite" onSubmit={addInvite} />
        </div>
      )}

      <p className="summary-line">
        <strong>{stats.guestsAttending}</strong> of <strong>{stats.guestsInvited}</strong> guests attending
        {stats.pending > 0 && <> · {stats.pending} {stats.pending === 1 ? "invite" : "invites"} awaiting a reply</>}
      </p>

      <div className="filter-chips">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`chip ${filter === f.key ? "chip--active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label} ({f.key === "all" ? stats.total : stats[f.key]})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="muted">
          {invites.length === 0
            ? "No invites yet. Add a guest above to get a personal RSVP link to share."
            : "No invites match this filter."}
        </p>
      ) : (
        <div className="table-scroll">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Relation</th>
                <th>Contact</th>
                <th>Guests</th>
                <th>RSVP</th>
                <th>Attending</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((invite) => {
                const busy = busyId === invite._id;
                return (
                  <tr key={invite._id}>
                    <td>
                      <strong>{invite.name}</strong>
                      {invite.note && <div className="cell-note">{invite.note}</div>}
                    </td>
                    <td>{invite.relation || "-"}</td>
                    <td className="cell-contact">
                      {invite.email && <div>{invite.email}</div>}
                      {invite.phone && <div>{invite.phone}</div>}
                      {!invite.email && !invite.phone && "-"}
                    </td>
                    <td>{invite.guestsCount}</td>
                    <td>
                      <span className={`badge badge--${invite.rsvpStatus}`}>
                        {STATUS_LABELS[invite.rsvpStatus] || invite.rsvpStatus}
                      </span>
                    </td>
                    <td>{invite.rsvpStatus === "attending" ? invite.attendingCount : "-"}</td>
                    <td>
                      <div className="row-actions">
                        <CopyButton
                          text={inviteUrl(invite.inviteCode)}
                          label="Copy link"
                          className="btn btn-sm btn-secondary"
                        />
                        <a
                          className="btn btn-sm btn-whatsapp"
                          href={whatsappUrl(inviteMessage(invite))}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          WhatsApp
                        </a>
                        {invite.email && (
                          <a className="btn btn-sm btn-secondary" href={mailtoUrl(invite)}>
                            Email
                          </a>
                        )}
                        <button className="btn btn-sm btn-secondary" onClick={() => setSettingRsvp(invite)} disabled={busy}>
                          Set RSVP
                        </button>
                        <button className="btn btn-sm btn-secondary" onClick={() => setEditing(invite)} disabled={busy}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger-outline" onClick={() => deleteInvite(invite)} disabled={busy}>
                          {busy ? "..." : "Delete"}
                        </button>
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
        <Modal title={`Edit invite for ${editing.name}`} onClose={() => setEditing(null)}>
          <InviteForm
            initial={toForm(editing)}
            submitLabel="Save changes"
            onSubmit={saveEdit}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}

      {settingRsvp && (
        <Modal title={`RSVP for ${settingRsvp.name}`} onClose={() => setSettingRsvp(null)}>
          <RsvpForm invite={settingRsvp} onSubmit={saveRsvp} onCancel={() => setSettingRsvp(null)} />
        </Modal>
      )}

      {confirmDialog}
    </div>
  );
}

export default DashboardInvites;
