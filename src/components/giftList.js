import { useEffect, useState } from "react";
//import { getGifts } from "../api/api";
import GiftItem from "./giftItem";

function GiftList({ weddingId }) {
  const [gifts, setGifts] = useState([{id:'1', name: 'Watch', description: 'Blue color', booked: false},
    {id:'2', name: 'Overcoat', description: 'Blue color', booked: false}, {id:'3', name: 'Dress', description: 'Blue color', booked: false},
    {id:'4', name: 'Bag', description: 'Blue color', booked: true}
  ]);

//   useEffect(() => {
//     getGifts(weddingId).then(setGifts);
//   }, [weddingId]);

  return (
    <div className="gift-grid">
      {gifts.map((gift) => (
        <GiftItem key={gift.id} gift={gift} />
      ))}
    </div>
  );
}

export default GiftList;
