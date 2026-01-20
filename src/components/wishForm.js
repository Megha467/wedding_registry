import { useState } from "react";
import { apiPOST } from "../apis/service";
function WishForm({ weddingId, onWishAdded }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    senderName: "",
    relation: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitWish = async(e) => {
    e.preventDefault();

    if (!form.senderName || !form.message) return;

    try {
      setLoading(true);

      const res = await apiPOST(
        `api/wedding/${weddingId}/wishes`,
        form
      );

      if (res?.message) {
        
        alert("Your wish has been sent ❤️");
        onWishAdded(res);
        setForm({
          senderName: "",
          relation: "",
          message: "",
        });
      } else {
        alert("Failed to send wish");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
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
        required
      />

      <input
        name="relation"
        placeholder="Relation (Friend, Cousin, etc.)"
        value={form.relation}
        onChange={handleChange}
      />

      <textarea
        name="message"
        placeholder="Write your wish..."
        value={form.message}
        onChange={handleChange}
        required
      />

       <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send Wish"}
      </button>
    </form>
  );
}

export default WishForm;
