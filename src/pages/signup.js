import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { publicPOST, saveSession } from "../apis/service";
import '../styles/login/auth.css';

const MIN_PASSWORD = 6;

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    coupleName: "",
    email: "",
    password: "",
    weddingDate: "",
  });

  const [giftInput, setGiftInput] = useState("");
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addGift = () => {
    if (!giftInput.trim()) return;

    setGifts([...gifts, { id: Date.now(), name: giftInput.trim() }]);
    setGiftInput("");
  };

  const removeGift = (id) => {
    setGifts(gifts.filter((g) => g.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    if (form.password.length < MIN_PASSWORD) {
      setError(`Password must be at least ${MIN_PASSWORD} characters`);
      return;
    }

    const payload = {
      coupleName: form.coupleName.trim(),
      email: form.email.trim(),
      password: form.password,
      weddingTitle: `${form.coupleName.trim()} ❤️ Wedding`,
      gifts: gifts.map((g) => g.name),
      ...(form.weddingDate ? { weddingDate: form.weddingDate } : {}),
    };

    setLoading(true);
    try {
      const res = await publicPOST("api/auth/signup", payload);
      if (res?.token) {
        saveSession(res);
        navigate("/dashboard");
      } else {
        setError(res?.message || "Signup failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Couple Signup</h2>

        <input
          name="coupleName"
          placeholder="Couple Name"
          value={form.coupleName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder={`Password (at least ${MIN_PASSWORD} characters)`}
          value={form.password}
          onChange={handleChange}
          minLength={MIN_PASSWORD}
          required
        />

        <label className="auth-label">
          Wedding date <span>(optional)</span>
          <input
            type="date"
            name="weddingDate"
            value={form.weddingDate}
            onChange={handleChange}
          />
        </label>

        <h4>🎁 Gift List <span className="auth-hint">(optional, you can add more later)</span></h4>

        <div className="gift-input-row">
          <input
            placeholder="Add gift (e.g. Dinner Set)"
            value={giftInput}
            onChange={(e) => setGiftInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addGift();
              }
            }}
          />
          <button type="button" onClick={addGift}>
            Add
          </button>
        </div>

        {gifts.length > 0 && (
          <ul className="gift-preview">
            {gifts.map((gift) => (
              <li key={gift.id}>
                {gift.name}
                <span
                  role="button"
                  aria-label={`Remove ${gift.name}`}
                  onClick={() => removeGift(gift.id)}
                >
                  ✕
                </span>
              </li>
            ))}
          </ul>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
        {error && <p className="error-text">{error}</p>}

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
