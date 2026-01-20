import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import WishForm from "../components/wishForm";
import WishList from "../components/wishList";
import GiftList from "../components/giftList";
import { apiGET_Tokenless } from "../apis/service";
function WeddingPage() {
  const { weddingId } = useParams();

  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishes = async () => {
    try {
      const data = await apiGET_Tokenless(
        `api/wedding/${weddingId}/wishes`
      );
      setWishes(data || []);
    } catch (err) {
      console.error("Failed to fetch wishes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (weddingId) fetchWishes();
  }, [weddingId]);

  // 🔥 called immediately after sending wish
  const handleWishAdded = (newWish) => {
    console.log('new wish ', newWish)
    setWishes((prev) => [newWish, ...prev]);
  };
  return (
    <div className="container">
      <h1>💍 Wedding Wishes & Gifts</h1>

      <section>
        <h2>Send Your Wishes ❤️</h2>
        <WishForm weddingId={weddingId}  onWishAdded={handleWishAdded}/>
      </section>

      <section>
        <h2>Wishes Received ✨</h2>
        <WishList weddingId={weddingId} wishes={wishes} loading={loading}/>
      </section>

      <section>
        <h2>Gift Registry 🎁</h2>
        <GiftList weddingId={weddingId} />
      </section>
    </div>
  );
}

export default WeddingPage;
