import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardGifts from "../components/dashboardGifts";
import DashboardWishes from "../components/dashboardWishes";
import { useNavigate } from "react-router-dom";
import { apiGET } from "../apis/service";
import '../styles/coupleDashboard/styles.css';
function CoupleDashboard() {
  
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await apiGET("api/dashboard");
        console.log('data of the dash', data);
        setDashboard(data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
        if (err.message === "Invalid token") {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;
  if (!dashboard) return <p>No dashboard data</p>;

  return (
    <div className="container">
    <button onClick={logout} style={{ float: "right" }}>
        Logout
    </button>
    
      <h1>💍 Couple Dashboard</h1>

      <section>
        <h2>🎁 Gift Details</h2>
        <DashboardGifts  gifts={dashboard.gifts}/>
      </section>

      <section>
        <h2>💌 Wishes Received</h2>
        <DashboardWishes wishes={dashboard.wishes} />
      </section>
    </div>
  );
}

export default CoupleDashboard;
