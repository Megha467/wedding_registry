import { useEffect, useState } from "react";
//import { getGifts } from "../api/api";
import GiftItem from "./giftItem";
import { apiGET_Tokenless, apiPOST } from "../apis/service";
function GiftList({ weddingId }) {
  // const [gifts, setGifts] = useState([{id:'1', name: 'Watch', description: 'Blue color', booked: false},
  //   {id:'2', name: 'Overcoat', description: 'Blue color', booked: false}, {id:'3', name: 'Dress', description: 'Blue color', booked: false},
  //   {id:'4', name: 'Bag', description: 'Blue color', booked: true}
  // ]);

  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch gifts
  useEffect(() => {
    if (!weddingId) return;

    const fetchGifts = async () => {
      try {
        const data = await apiGET_Tokenless(
          `api/wedding/${weddingId}/gifts`
        );
        setGifts(data || []);
      } catch (err) {
        console.error("Failed to fetch gifts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGifts();
  }, [weddingId]);

  // 🔥 Update UI instantly when gift is booked
  const handleGiftBooked = (updatedGift) => {
    console.log('updated gifts', updatedGift);
    setGifts((prev) =>
      prev.map((gift) =>
        gift._id === updatedGift._id ? updatedGift : gift
      )
    );
  };

  if (loading) return <p>Loading gifts...</p>;
  if (!gifts.length) return <p>No gifts available 🎁</p>;

return (
    <div className="gift-grid">
      {gifts.map((gift) => (
        <GiftItem
          key={gift._id}
          gift={gift}
          onBooked={handleGiftBooked}
        />
      ))}
    </div>
  );
}
export default GiftList;
