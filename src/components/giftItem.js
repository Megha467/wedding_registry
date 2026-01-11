//import { bookGift } from "../api/api";

function GiftItem({ gift }) {
  const handleBook = async () => {
    //await bookGift(gift.id);
    alert("Gift booked successfully!");
    window.location.reload();
  };

  return (
    <div className="gift-card">
      <h3>{gift.name}</h3>
      <p>{gift.description}</p>

      {gift.booked ? (
        <span className="booked">Booked</span>
      ) : (
        <button onClick={handleBook}>Book Gift</button>
      )}
    </div>
  );
}

export default GiftItem;
