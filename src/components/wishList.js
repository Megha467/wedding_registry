function WishList({ wishes }) {
  if (!wishes.length)
    return <p>No wishes yet. Be the first to send one 💌</p>;

  return (
    <ul className="wish-list">
      {wishes.map((wish) => (
        <li key={wish._id}>
          <p>{wish.message}</p>
          <small>
            — {wish.senderName}
            {wish.relation && ` (${wish.relation})`}
          </small>
        </li>
      ))}
    </ul>
  );
}

export default WishList;
