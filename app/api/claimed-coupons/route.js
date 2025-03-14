import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ClaimLog from "../../../models/ClaimLog"; // Assuming ClaimLog model is in models folder

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
if (!global.mongoose) {
  global.mongoose = mongoose.connect(MONGO_URI, { dbName: "test" })
    .then(() => console.log("MongoDB Connected"));
}

export async function GET() {
  try {
    const claimedCoupons = await ClaimLog.find().sort({ claimedAt: -1 }); // Get all claims sorted by latest
    return NextResponse.json(claimedCoupons);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch claimed coupons" }, { status: 500 });
  }
}
