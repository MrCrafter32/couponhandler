"use client";

import { useEffect, useState } from "react";

export default function ClaimedCouponsPage() {
  const [claimedCoupons, setClaimedCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClaimedCoupons() {
      try {
        const response = await fetch("/api/claimed-coupons");
        const data = await response.json();
        setClaimedCoupons(data);
      } catch (error) {
        console.error("Error fetching claimed coupons:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchClaimedCoupons();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 border rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Claimed Coupons</h1>

      {loading ? (
        <p>Loading...</p>
      ) : claimedCoupons.length === 0 ? (
        <p>No coupons have been claimed yet.</p>
      ) : (
        <ul className="space-y-2">
          {claimedCoupons.map((claim, index) => (
            <li key={index} className="p-2 border rounded-md">
              <strong>Coupon Code:</strong> {claim.coupon} <br />
              <strong>Claimed At:</strong> {new Date(claim.claimedAt).toLocaleString()} <br />
              <strong>IP:</strong> {claim.ip} <br />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
