import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import WishForm from "../components/wishForm";
import WishList from "../components/wishList";
import GiftList from "../components/giftList";
import NotFound from "../components/notFound";
import { publicGET } from "../apis/service";
import { formatDate } from "../utils/helpers";
import "../styles/publicDashboard/WeddingPage.css";

function WeddingHero({ wedding }) {
  const date = formatDate(wedding.date);
  return (
    <div className="hero">
      <p className="hero-eyebrow">💍 You're invited to celebrate</p>
      <h1>{wedding.coupleName || wedding.title}</h1>
      {wedding.coupleName && wedding.title && <p className="hero-title">{wedding.title}</p>}
      {(date || wedding.venue) && (
        <p className="hero-date">
          {date}
          {date && wedding.venue && " · "}
          {wedding.venue}
        </p>
      )}
      {wedding.description && <p className="hero-description">{wedding.description}</p>}
    </div>
  );
}

function WeddingPage() {
  const { weddingId } = useParams();

  const [wedding, setWedding] = useState(null);
  const [gifts, setGifts] = useState([]);
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWedding = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await publicGET(`api/wedding/${weddingId}`);
      setWedding(data.wedding);
      setGifts(data.gifts || []);
      setWishes(data.wishes || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [weddingId]);

  useEffect(() => {
    fetchWedding();
  }, [fetchWedding]);

  const handleWishAdded = (newWish) => {
    setWishes((prev) => [newWish, ...prev]);
  };

  if (loading) return <p className="page-status">Loading...</p>;

  if (error?.status === 404 || error?.status === 400) {
    return (
      <NotFound
        title="Wedding not found"
        message="This link doesn't match any wedding. Please check it with the couple."
      />
    );
  }

  if (error) {
    return (
      <div className="page-status">
        <p>{error.message}</p>
        <button className="btn btn-primary" onClick={fetchWedding}>Try again</button>
      </div>
    );
  }

  return (
    <div className="container">
      <WeddingHero wedding={wedding} />

      <section>
        <h2>Send Your Wishes ❤️</h2>
        <WishForm weddingId={weddingId} onWishAdded={handleWishAdded} />
      </section>

      <section>
        <h2>Wishes Received ✨</h2>
        <WishList wishes={wishes} />
      </section>

      <section>
        <h2>Gift Registry 🎁</h2>
        <GiftList weddingId={weddingId} gifts={gifts} setGifts={setGifts} />
      </section>
    </div>
  );
}

export default WeddingPage;
