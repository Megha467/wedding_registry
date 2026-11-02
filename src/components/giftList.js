import GiftItem from "./giftItem";

function GiftList({ weddingId, gifts, setGifts }) {
  const handleGiftChange = (updatedGift) => {
    setGifts((prev) =>
      prev.map((gift) => (gift._id === updatedGift._id ? updatedGift : gift))
    );
  };

  const handleGiftRemoved = (giftId) => {
    setGifts((prev) => prev.filter((gift) => gift._id !== giftId));
  };

  if (!gifts.length) return <p>No gifts available 🎁</p>;

  // Available gifts first.
  const sorted = [...gifts].sort((a, b) => Number(a.isBooked) - Number(b.isBooked));

  return (
    <div className="gift-grid">
      {sorted.map((gift) => (
        <GiftItem
          key={gift._id}
          weddingId={weddingId}
          gift={gift}
          onChange={handleGiftChange}
          onRemoved={handleGiftRemoved}
        />
      ))}
    </div>
  );
}

export default GiftList;
