import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NotFound from "../components/notFound";
import { publicGET, publicPOST } from "../apis/service";
import { formatDate } from "../utils/helpers";
import "../styles/publicDashboard/WeddingPage.css";
import "../styles/invite/invitePage.css";

const range = (n) => Array.from({ length: n }, (_, i) => i + 1);

function RsvpSummary({ invite, justResponded, onChange }) {
  const attending = invite.rsvpStatus === "attending";
  return (
    <div className={`rsvp-summary rsvp-summary--${invite.rsvpStatus}`}>
      {justResponded && (
        <h3>
          {attending
            ? "Thank you! We can't wait to celebrate with you 🎉"
            : "Thank you for letting us know. You'll be missed 💐"}
        </h3>
      )}
      <p>
        Your answer:{" "}
        <strong>
          {attending
            ? `Attending${invite.guestsCount > 1 ? ` (${invite.attendingCount} of ${invite.guestsCount} guests)` : ""}`
            : "Can't make it"}
        </strong>
      </p>
      <button type="button" className="btn-link" onClick={onChange}>
        Change my answer
      </button>
    </div>
  );
}

function RsvpChoices({ invite, submitting, onSubmit, onCancel }) {
  const [count, setCount] = useState(invite.attendingCount || invite.guestsCount);

  return (
    <div className="rsvp-choices">
      <p className="rsvp-question">Will you be joining us?</p>

      {invite.guestsCount > 1 && (
        <label className="rsvp-count">
          How many of you will come? (up to {invite.guestsCount})
          <select value={count} onChange={(e) => setCount(Number(e.target.value))} disabled={!!submitting}>
            {range(invite.guestsCount).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      )}

      <div className="rsvp-buttons">
        <button
          className="rsvp-btn rsvp-btn--yes"
          disabled={!!submitting}
          onClick={() => onSubmit({ status: "attending", attendingCount: count })}
        >
          {submitting === "attending" ? "Saving..." : "🎉 Attending"}
        </button>
        <button
          className="rsvp-btn rsvp-btn--no"
          disabled={!!submitting}
          onClick={() => onSubmit({ status: "declined" })}
        >
          {submitting === "declined" ? "Saving..." : "Can't make it"}
        </button>
      </div>

      {onCancel && (
        <button type="button" className="btn-link" onClick={onCancel} disabled={!!submitting}>
          Keep my previous answer
        </button>
      )}
    </div>
  );
}

function InvitePage() {
  const { inviteCode } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(null); // "attending" | "declined" | null
  const [submitError, setSubmitError] = useState("");
  const [justResponded, setJustResponded] = useState(false);

  const fetchInvite = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await publicGET(`api/invites/${encodeURIComponent(inviteCode)}`));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [inviteCode]);

  useEffect(() => {
    fetchInvite();
  }, [fetchInvite]);

  const submitRsvp = async (body) => {
    if (submitting) return;
    setSubmitting(body.status);
    setSubmitError("");
    try {
      const res = await publicPOST(`api/invites/${encodeURIComponent(inviteCode)}/rsvp`, body);
      setData((prev) => ({ ...prev, invite: res.invite }));
      setEditing(false);
      setJustResponded(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) return <p className="page-status">Loading your invite...</p>;

  if (error?.status === 404 || error?.status === 400) {
    return (
      <NotFound
        title="Invite not found"
        message="This invite link is not valid. Please check it with the couple."
      />
    );
  }

  if (error) {
    return (
      <div className="page-status">
        <p>{error.message}</p>
        <button className="btn btn-primary" onClick={fetchInvite}>Try again</button>
      </div>
    );
  }

  const { invite, wedding } = data;
  const date = formatDate(wedding.date);
  const responded = invite.rsvpStatus !== "pending";

  return (
    <div className="container">
      <div className="hero invite-hero">
        <p className="hero-eyebrow">Hi {invite.name}, you're invited! 💌</p>
        <h1>{wedding.coupleName || wedding.title}</h1>
        {wedding.coupleName && wedding.title && <p className="hero-title">{wedding.title}</p>}
        {date && <p className="hero-date">📅 {date}</p>}
        {wedding.venue && <p className="hero-date">📍 {wedding.venue}</p>}
        {wedding.description && <p className="hero-description">{wedding.description}</p>}
      </div>

      <section className="rsvp-card">
        <h2>RSVP</h2>

        {responded && !editing ? (
          <RsvpSummary
            invite={invite}
            justResponded={justResponded}
            onChange={() => {
              setEditing(true);
              setJustResponded(false);
            }}
          />
        ) : (
          <RsvpChoices
            invite={invite}
            submitting={submitting}
            onSubmit={submitRsvp}
            onCancel={responded ? () => setEditing(false) : null}
          />
        )}

        {submitError && <p className="form-status form-status--error">{submitError}</p>}
      </section>

      <section className="invite-links">
        <h2>Celebrate with us 💝</h2>
        <p>Leave the couple a wish or pick a gift from their registry.</p>
        <Link className="btn btn-primary" to={`/wedding/${wedding._id}`}>
          Visit the wedding page
        </Link>
      </section>
    </div>
  );
}

export default InvitePage;
