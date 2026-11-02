import "../styles/publicDashboard/WeddingPage.css";

function NotFound({ title, message, children }) {
  return (
    <div className="container">
      <div className="hero not-found">
        <h1>{title}</h1>
        <p className="hero-date">{message}</p>
        {children}
      </div>
    </div>
  );
}

export default NotFound;
