import { useEffect, useState } from "react";
//import { getDashboardWishes } from "../api/api";

function DashboardWishes({ weddingId }) {
  const [wishes, setWishes] = useState([{
      id: 1,
      message: "Wishing you both a lifetime full of love and happiness 💖",
      senderName: "Amit Sharma",
      createdAt: "2026-01-05T09:15:00Z",
    },
    {
      id: 2,
      message: "May your journey together be filled with joy and laughter!",
      senderName: "Neha Verma",
      createdAt: "2026-01-05T11:45:00Z",
    },
    {
      id: 3,
      message: "Congratulations on your new beginning. Best wishes always!",
      senderName: "Rahul Singh",
      createdAt: "2026-01-06T16:30:00Z",
    },
    {
      id: 4,
      message: "So happy for you both! Wishing you endless love ❤️",
      senderName: "Priya Kapoor",
      createdAt: "2026-01-07T08:20:00Z",
    },
    {
      id: 5,
      message: "Cheers to a beautiful life together 🥂",
      senderName: "Ankit Malhotra",
      createdAt: "2026-01-07T19:10:00Z",
    },
]);

//   useEffect(() => {
//     getDashboardWishes(weddingId).then(setWishes);
//   }, [weddingId]);

  return (
    <ul className="dashboard-wishes">
      {wishes.map((wish) => (
        <li key={wish.id}>
          <p className="wish-message">"{wish.message}"</p>
          <p className="wish-meta">
            <strong>From:</strong> {wish.senderName}<br />
            <strong>Time:</strong>{" "}
            {new Date(wish.createdAt).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default DashboardWishes;
