// import { useState } from "react";
// //import { sendWish } from "../api/api";

// function WishForm({ weddingId }) {
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const submitWish = async () => {
//     if (!message.trim()) return;

//     setLoading(true);
//     // await sendWish(weddingId, message);
//     setMessage("");
//     setLoading(false);
//     alert("Wish sent successfully!");
//   };

//   return (
//     <div>
//       <textarea
//         placeholder="Write your wishes here..."
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />
//       <button onClick={submitWish} disabled={loading}>
//         {loading ? "Sending..." : "Send Wish"}
//       </button>
//     </div>
//   );
// }

// export default WishForm;
import { useState } from "react";

function WishForm({ weddingId }) {
  const [form, setForm] = useState({
    senderName: "",
    relation: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitWish = (e) => {
    e.preventDefault();

    if (!form.senderName || !form.message) return;

    const weddingData =
      JSON.parse(localStorage.getItem("weddingData")) || {};

    const newWish = {
      id: Date.now(),
      senderName: form.senderName,
      relation: form.relation,
      message: form.message,
      createdAt: new Date().toISOString(),
    };

    weddingData.wishes = [
      ...(weddingData.wishes || []),
      newWish,
    ];

    localStorage.setItem(
      "weddingData",
      JSON.stringify(weddingData)
    );

    setForm({
      senderName: "",
      relation: "",
      message: "",
    });

    alert("Your wish has been sent ❤️");
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

      <button type="submit">Send Wish</button>
    </form>
  );
}

export default WishForm;
