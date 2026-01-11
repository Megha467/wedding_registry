import { useEffect, useState } from "react";
//import { getDashboardGifts } from "../api/api";

function DashboardGifts({ weddingId }) {
  const [gifts, setGifts] = useState([{
      id: 1,
      name: "Luxury Watch",
      isBooked: true,
      bookedBy: "Amit Sharma",
      bookedAt: "2026-01-05T14:30:00Z",
    },
    {
      id: 2,
      name: "Dinner Set",
      isBooked: false,
      bookedBy: null,
      bookedAt: null,
    },
    {
      id: 3,
      name: "Air Fryer",
      isBooked: true,
      bookedBy: "Neha Verma",
      bookedAt: "2026-01-06T10:15:00Z",
    },
    {
      id: 4,
      name: "Bed Sheet Set",
      isBooked: false,
      bookedBy: null,
      bookedAt: null,
    },
    {
      id: 5,
      name: "Microwave Oven",
      isBooked: true,
      bookedBy: "Rahul Singh",
      bookedAt: "2026-01-07T18:45:00Z",
    },]);

//   useEffect(() => {
//     getDashboardGifts(weddingId).then(setGifts);
//   }, [weddingId]);

  return (
    <table className="dashboard-table">
      <thead>
        <tr>
          <th>Gift</th>
          <th>Status</th>
          <th>Booked By</th>
          <th>Booked At</th>
        </tr>
      </thead>

      <tbody>
        {gifts.map((gift) => (
          <tr key={gift.id}>
            <td>{gift.name}</td>
            <td>
              {gift.isBooked ? "Booked" : "Available"}
            </td>
            <td>{gift.bookedBy || "-"}</td>
            <td>
              {gift.bookedAt
                ? new Date(gift.bookedAt).toLocaleString()
                : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DashboardGifts;
