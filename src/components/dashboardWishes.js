function DashboardWishes({ wishes }) {
  if (!wishes || wishes.length === 0) {
    return <p>No wishes available</p>;
  }
  return (
    <ul className="dashboard-wishes">
      {wishes.map((wish) => (
        <li key={wish._id}>
          <p className="wish-message">"{wish.message}"</p>
          <p className="wish-meta">
            <strong>From:</strong> {wish.senderName} <br />
            <strong>Relation:</strong> {wish.relation} <br />
            <strong>Time:</strong>{" "}
            {new Date(wish.createdAt).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default DashboardWishes;
