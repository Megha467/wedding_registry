// import { apiPOST } from "../apis/service";
// import { useState } from "react";
// import { useParams } from "react-router-dom";

// function GiftItem({ gift, onBooked }) {
//   const { weddingId } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [bookedBy, setBookedBy] = useState("");
//   const [showInput, setShowInput] = useState(false);

//   const handleBook = async () => {
//     if (!bookedBy.trim()) {
//     alert("Please enter your name");
//     return;
//   }
//     try {
//       setLoading(true);

//       const updatedGift = await apiPOST(
//          `api/wedding/${weddingId}/gifts/${gift._id}/book`,
//         { bookedBy: "Guest" } // can be dynamic
//       );

//       // ✅ update parent state
//        onBooked(updatedGift);
//        setShowInput(false);
//        setBookedBy("");
//     } catch (err) {
//       alert("Failed to book gift");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="gift-card">
//       <h3>{gift.name}</h3>

//       {gift.isBooked ? (
//         <span className="booked">
//           Booked {gift.bookedBy && `by ${gift.bookedBy}`}
//         </span>
//       ) :( 
//       <>
//       {showInput ? (
//         <>
//           <input
//             type="text"
//             placeholder="Your name"
//             value={bookedBy}
//             onChange={(e) => setBookedBy(e.target.value)}
//           />
//           <button onClick={handleBook} disabled={loading}>
//             {loading ? "Booking..." : "Confirm Booking"}
//           </button>
//         </>
//       ) :(
//         <button onClick={handleBook} disabled={loading}>
//           {loading ? "Booking..." : "Book Gift"}
//         </button>
//       )}
//       </>
//       )}
//     </div>
//   );
// }

// export default GiftItem;

import { apiPOST } from "../apis/service";
import { useState } from "react";
import { useParams } from "react-router-dom";

function GiftItem({ gift, onBooked }) {
  const { weddingId } = useParams();
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [bookedBy, setBookedBy] = useState("");

  const handleBook = async () => {
    if (!bookedBy.trim()) {
      alert("Please enter your name");
      return;
    }

    try {
      setLoading(true);

      const updatedGift = await apiPOST(
        `api/wedding/${weddingId}/gifts/${gift._id}/book`,
        { bookedBy }
      );

      // update UI instantly
      onBooked(updatedGift);

      // reset UI
      setShowInput(false);
      setBookedBy("");
    } catch (err) {
      alert("Failed to book gift");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gift-card">
      <h3>{gift.name}</h3>

      {gift.isBooked ? (
        <span className="booked">
          Booked 
          {/* {gift.bookedBy && `by ${gift.bookedBy}`} */}
        </span>
      ) : (
        <>
          {!showInput ? (
            // 👉 STEP 1: show input when clicked
            <button onClick={() => setShowInput(true)}>
              Book Gift
            </button>
          ) : (
            // 👉 STEP 2: input + confirm
            <>
              <input
                type="text"
                placeholder="Your name"
                value={bookedBy}
                onChange={(e) => setBookedBy(e.target.value)}
              />

              <button onClick={handleBook} disabled={loading}>
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default GiftItem;
