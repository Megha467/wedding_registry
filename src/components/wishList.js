import { useEffect, useState } from "react";

function WishList({ wishes, loading }) {
 
  if (loading) return <p>Loading wishes...</p>;

  if (!wishes.length)
    return <p>No wishes available 💌</p>;

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
