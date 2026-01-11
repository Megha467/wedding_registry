import { useParams } from "react-router-dom";
import WishForm from "../components/wishForm";
import WishList from "../components/wishList";
import GiftList from "../components/giftList";

function WeddingPage() {
  const { weddingId } = useParams();

  return (
    <div className="container">
      <h1>💍 Wedding Wishes & Gifts</h1>

      <section>
        <h2>Send Your Wishes ❤️</h2>
        <WishForm weddingId={weddingId} />
      </section>

      <section>
        <h2>Wishes Received ✨</h2>
        <WishList weddingId={weddingId} />
      </section>

      <section>
        <h2>Gift Registry 🎁</h2>
        <GiftList weddingId={weddingId} />
      </section>
    </div>
  );
}

export default WeddingPage;
