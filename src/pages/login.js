import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPOST } from "../apis/service";
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

    const res = await apiPOST("api/auth/login", form);
    // MOCK LOGIN
     setLoading(false);
      if (res?.token) {
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    localStorage.setItem("coupleAuth", "true");

    navigate(`/dashboard/${res.user.id}`);
  } else {
    setError(res?.message || "Login failed");
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

        <p>
          Don’t have an account?{" "}
          <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
