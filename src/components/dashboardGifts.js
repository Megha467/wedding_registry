import { useEffect, useState } from "react";
function DashboardGifts({ gifts }) {
  if (!gifts || gifts.length === 0) {
    return <p>No gifts available</p>;
  }
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
          <tr key={gift._id}>
            <td>{gift.name}</td>
            <td>{gift.isBooked ? "Booked" : "Available"}</td>
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
