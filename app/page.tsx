"use client";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const claimCoupon = async () => {
    setLoading(true);
    setMessage("");
    setCoupon(null);
    setClaimed(false);

    try {
      const response = await fetch("/api/claim", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        setCoupon(data.coupon);
        setMessage(data.message);
        setClaimed(true);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Failed to claim a coupon. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Claim Your Coupon</h1>
      <button 
        onClick={claimCoupon} 
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:bg-gray-400"
        disabled={loading || claimed}
      >
        {loading ? "Claiming..." : claimed ? "Coupon Claimed" : "Claim Coupon"}
      </button>
      {message && <p className="mt-4 text-lg">{message}</p>}
      {coupon && <p className="mt-2 text-xl font-bold">Your Coupon: {coupon}</p>}
    </div>
  );
}
