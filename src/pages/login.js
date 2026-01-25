import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPOST } from "../apis/service";
import '../styles/login/auth.css';
function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
try {
    const res = await apiPOST("api/auth/login", form);
    if (res?.token) {
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    localStorage.setItem("coupleAuth", "true");
    navigate(`/dashboard`);
  } else {
    setError(res?.message || "Login failed");
  }
}
catch (err) {
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Couple Login</h2>

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

        <button type="submit">Login</button>
        {error && <p className="error-text">{error}</p>}

        <p>
          Don’t have an account?{" "}
          <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
