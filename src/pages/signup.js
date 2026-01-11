import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    coupleName: "",
    email: "",
    password: "",
  });

  const [giftInput, setGiftInput] = useState("");
  const [gifts, setGifts] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addGift = () => {
    if (!giftInput.trim()) return;

    setGifts([
      ...gifts,
      {
        id: Date.now(),
        name: giftInput,
        isBooked: false,
      },
    ]);
    setGiftInput("");
  };

  const removeGift = (id) => {
    setGifts(gifts.filter((g) => g.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const weddingData = {
      weddingId: "1",
      coupleName: form.coupleName,
      email: form.email,
      gifts,
      wishes: [],
    };

    // MOCK SAVE
    localStorage.setItem("coupleAuth", "true");
    localStorage.setItem("weddingData", JSON.stringify(weddingData));

    navigate("/dashboard/1");
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Couple Signup</h2>

        <input
          name="coupleName"
          placeholder="Couple Name"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        {/* Gift List Section */}
        <h4>🎁 Gift List</h4>

        <div className="gift-input-row">
          <input
            placeholder="Add gift (e.g. Dinner Set)"
            value={giftInput}
            onChange={(e) => setGiftInput(e.target.value)}
          />
          <button type="button" onClick={addGift}>
            Add
          </button>
        </div>

        <ul className="gift-preview">
          {gifts.map((gift) => (
            <li key={gift.id}>
              {gift.name}
              <span onClick={() => removeGift(gift.id)}>✕</span>
            </li>
          ))}
        </ul>

        <button type="submit">Create Account</button>

        <p>
          Already have an account?{" "}
          <a href="/login">Login</a>
        </p>
        
      </form>
    </div>
  );
}

export default Signup;
