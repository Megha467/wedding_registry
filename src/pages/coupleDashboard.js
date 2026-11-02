import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardOverview from "../components/dashboardOverview";
import DashboardWedding from "../components/dashboardWedding";
import DashboardGifts from "../components/dashboardGifts";
import DashboardInvites from "../components/dashboardInvites";
import DashboardWishes from "../components/dashboardWishes";
import DashboardAccount from "../components/dashboardAccount";
import { apiGET, clearSession } from "../apis/service";
import '../styles/coupleDashboard/styles.css';

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "wedding", label: "Wedding details" },
  { key: "gifts", label: "Gifts" },
  { key: "invites", label: "Invites" },
  { key: "wishes", label: "Wishes" },
  { key: "account", label: "Account" },
];

// Same counts the backend returns in `stats`, recomputed so they stay
// current after local edits without refetching.
const summarize = ({ gifts, wishes, invites }) => ({
  gifts: {
    total: gifts.length,
    booked: gifts.filter((g) => g.isBooked).length,
  },
  wishes: wishes.length,
  invites: {
    total: invites.length,
    pending: invites.filter((i) => i.rsvpStatus === "pending").length,
    attending: invites.filter((i) => i.rsvpStatus === "attending").length,
    declined: invites.filter((i) => i.rsvpStatus === "declined").length,
    guestsInvited: invites.reduce((sum, i) => sum + (i.guestsCount || 0), 0),
    guestsAttending: invites.reduce((sum, i) => sum + (i.attendingCount || 0), 0),
  },
});

function CoupleDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tab = TABS.some((t) => t.key === searchParams.get("tab"))
    ? searchParams.get("tab")
    : "overview";

  const logout = () => {
    clearSession();
    navigate("/login");
  };

  const fetchDashboard = useCallback(async () => {
    try {
      const data = await apiGET("api/dashboard");
      setDashboard(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Pick up RSVPs, bookings and wishes made by guests while the tab was in the background.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") fetchDashboard();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [fetchDashboard]);

  // update("gifts", (gifts) => newGifts) or update("wedding", newWedding)
  const update = useCallback((key, next) => {
    setDashboard((prev) => ({
      ...prev,
      [key]: typeof next === "function" ? next(prev[key]) : next,
    }));
  }, []);

  const stats = useMemo(() => (dashboard ? summarize(dashboard) : null), [dashboard]);

  if (loading) return <p className="page-status">Loading dashboard...</p>;
  if (!dashboard) {
    return (
      <div className="page-status">
        <p>{error || "No dashboard data"}</p>
        <button className="btn btn-primary" onClick={fetchDashboard}>
          Try again
        </button>
      </div>
    );
  }

  const { couple, wedding, gifts, wishes, invites } = dashboard;

  return (
    <div className="container dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>💍 {couple.coupleName}</h1>
          <p className="dashboard-subtitle">Couple Dashboard</p>
        </div>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <nav className="dashboard-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            className={`dashboard-tab ${tab === t.key ? "dashboard-tab--active" : ""}`}
            onClick={() => setSearchParams(t.key === "overview" ? {} : { tab: t.key })}
          >
            {t.label}
            {t.key === "invites" && stats.invites.pending > 0 && (
              <span className="tab-count">{stats.invites.pending}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="dashboard-panel" role="tabpanel">
        {tab === "overview" && (
          <DashboardOverview wedding={wedding} couple={couple} stats={stats} />
        )}

        {tab === "wedding" && (
          <DashboardWedding
            wedding={wedding}
            onSaved={(next) => update("wedding", next)}
          />
        )}

        {tab === "gifts" && (
          <DashboardGifts
            gifts={gifts}
            onChange={(next) => update("gifts", next)}
            onRefresh={fetchDashboard}
          />
        )}

        {tab === "invites" && (
          <DashboardInvites
            invites={invites}
            wedding={wedding}
            couple={couple}
            stats={stats.invites}
            onChange={(next) => update("invites", next)}
          />
        )}

        {tab === "wishes" && (
          <div className="dashboard-card">
            <h2>💌 Wishes Received</h2>
            <DashboardWishes wishes={wishes} />
          </div>
        )}

        {tab === "account" && (
          <DashboardAccount
            couple={couple}
            onProfileSaved={(user) => update("couple", (prev) => ({ ...prev, ...user }))}
          />
        )}
      </div>
    </div>
  );
}

export default CoupleDashboard;
