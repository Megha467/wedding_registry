import { useParams } from "react-router-dom";
import DashboardGifts from "../components/dashboardGifts";
import DashboardWishes from "../components/dashboardWishes";
import { useNavigate } from "react-router-dom";
import '../styles/coupleDashboard/styles.css';
function CoupleDashboard() {
  const { weddingId } = useParams();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("coupleAuth");
    navigate("/login");
  };

  return (
    <div className="container">
    <button onClick={logout} style={{ float: "right" }}>
        Logout
    </button>
    
      <h1>💍 Couple Dashboard</h1>

      <section>
        <h2>🎁 Gift Details</h2>
        <DashboardGifts weddingId={weddingId} />
      </section>

      <section>
        <h2>💌 Wishes Received</h2>
        <DashboardWishes weddingId={weddingId} />
      </section>
    </div>
  );
}

export default CoupleDashboard;
