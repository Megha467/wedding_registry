import { useState } from "react";
import { publicPOST } from "../apis/service";

const MAX_MESSAGE = 1000;
const EMPTY_FORM = { senderName: "", relation: "", message: "" };

function WishForm({ weddingId, onWishAdded }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus(null);
  };

  const submitWish = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!form.senderName.trim() || !form.message.trim()) {
      setStatus({ type: "error", message: "Please enter your name and a message" });
      return;
    }
    if (form.message.length > MAX_MESSAGE) {
      setStatus({ type: "error", message: `Message must be at most ${MAX_MESSAGE} characters` });
      return;
    }

    setLoading(true);
    try {
      const wish = await publicPOST(`api/wedding/${weddingId}/wishes`, {
        senderName: form.senderName.trim(),
        relation: form.relation.trim(),
        message: form.message.trim(),
      });
      onWishAdded(wish);
      setForm(EMPTY_FORM);
      setStatus({ type: "success", message: "Your wish has been sent ❤️" });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitWish} className="wish-form">
      <input
        name="senderName"
        placeholder="Your Name"
        value={form.senderName}
        onChange={handleChange}
        maxLength={100}
        required
      />

      <input
        name="relation"
        placeholder="Relation (Friend, Cousin, etc.)"
        value={form.relation}
        onChange={handleChange}
        maxLength={50}
      />

      <textarea
        name="message"
        placeholder="Write your wish..."
        value={form.message}
        onChange={handleChange}
        maxLength={MAX_MESSAGE}
        required
      />
      <small className="char-count">
        {form.message.length} / {MAX_MESSAGE}
      </small>

      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send Wish"}
      </button>
      {status && <p className={`form-status form-status--${status.type}`}>{status.message}</p>}
    </form>
  );
}

export default WishForm;
