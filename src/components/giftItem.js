import { useState } from "react";
import { publicPOST } from "../apis/service";
import { formatPrice } from "../utils/helpers";
import { useToast } from "./toast";

function GiftItem({ weddingId, gift, onChange, onRemoved }) {
  const showToast = useToast();
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [bookedBy, setBookedBy] = useState("");
  const [error, setError] = useState("");

  const handleBook = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!bookedBy.trim()) {
      setError("Please enter your name");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const updatedGift = await publicPOST(
        `api/wedding/${weddingId}/gifts/${gift._id}/book`,
        { bookedBy: bookedBy.trim() }
      );
      onChange(updatedGift);
      setShowInput(false);
      setBookedBy("");
      showToast(`Thank you! “${gift.name}” is booked for you 🎁`);
    } catch (err) {
      if (err.status === 409) {
        // Someone else got it first.
        setError(err.message);
        setShowInput(false);
        onChange({ ...gift, isBooked: true });
      } else if (err.status === 404) {
        showToast("Sorry, this gift is no longer on the registry.", "error");
        onRemoved(gift._id);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`gift-card ${gift.isBooked ? "gift-card--booked" : ""}`}>
      <h3>{gift.name}</h3>
      {gift.description && <p className="gift-card__desc">{gift.description}</p>}
      {(gift.price != null || gift.link) && (
        <p className="gift-card__meta">
          {gift.price != null && <span>{formatPrice(gift.price)}</span>}
          {gift.link && (
            <a href={gift.link} target="_blank" rel="noopener noreferrer">
              View item ↗
            </a>
          )}
        </p>
      )}

      {gift.isBooked ? (
        <span className="booked">Booked</span>
      ) : !showInput ? (
        <button onClick={() => setShowInput(true)}>Book Gift</button>
      ) : (
        <form onSubmit={handleBook} className="gift-card__form">
          <input
            type="text"
            placeholder="Your name"
            value={bookedBy}
            onChange={(e) => setBookedBy(e.target.value)}
            maxLength={100}
            autoFocus
          />
          <div className="gift-card__actions">
            <button type="submit" disabled={loading}>
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setShowInput(false);
                setBookedBy("");
                setError("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {error && <p className="gift-card__error">{error}</p>}
    </div>
  );
}

export default GiftItem;
