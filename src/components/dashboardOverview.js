import CopyButton from "./copyButton";
import { formatDate, weddingUrl, whatsappUrl } from "../utils/helpers";

function StatCard({ label, value, detail }) {
  return (
    <div className="stat-card">
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
      {detail && <span className="stat-card__detail">{detail}</span>}
    </div>
  );
}

function DashboardOverview({ wedding, couple, stats }) {
  const link = weddingUrl(wedding._id);
  const date = formatDate(wedding.date);
  const shareText =
    `${wedding.title || `${couple.coupleName}'s wedding`}${date ? ` on ${date}` : ""}! 💍\n` +
    `Send us your wishes and see our gift registry here: ${link}`;

  return (
    <>
      <div className="stat-grid">
        <StatCard
          label="Gifts booked"
          value={`${stats.gifts.booked} / ${stats.gifts.total}`}
        />
        <StatCard label="Wishes received" value={stats.wishes} />
        <StatCard
          label="Invites sent"
          value={stats.invites.total}
          detail={
            <>
              <span className="badge badge--attending">{stats.invites.attending} attending</span>
              <span className="badge badge--pending">{stats.invites.pending} pending</span>
              <span className="badge badge--declined">{stats.invites.declined} declined</span>
            </>
          }
        />
        <StatCard
          label="Guests attending"
          value={`${stats.invites.guestsAttending} / ${stats.invites.guestsInvited}`}
        />
      </div>

      <div className="dashboard-card">
        <h2>🔗 Share your wedding page</h2>
        <p className="muted">
          Guests can send wishes and book gifts from this page.
        </p>
        <div className="share-row">
          <input
            className="share-row__url"
            value={link}
            readOnly
            onFocus={(e) => e.target.select()}
            aria-label="Wedding page link"
          />
          <CopyButton text={link} label="Copy link" className="btn btn-primary" />
          <a
            className="btn btn-whatsapp"
            href={whatsappUrl(shareText)}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
          <a className="btn btn-secondary" href={link} target="_blank" rel="noopener noreferrer">
            Open
          </a>
        </div>
      </div>
    </>
  );
}

export default DashboardOverview;
