import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not set in environment variables.");
}

if (!global.mongoose) {
    global.mongoose = mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log("MongoDB Connected")).catch(err => console.error(err));
}

const couponSchema = new mongoose.Schema({
    code: String,
    isClaimed: { type: Boolean, default: false },
});

const claimLogSchema = new mongoose.Schema({
    ip: String,
    session: String,
  session: String,
  coupon: String,
  claimedAt: { type: Date, default: Date.now },
});

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
const ClaimLog = mongoose.models.ClaimLog || mongoose.model("ClaimLog", claimLogSchema);

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for") || req.ip;

  const cookieStore = cookies(); // Await the cookies store first
  const session = cookieStore.get("coupon_session")?.value;
  
  const cooldownTime = 60 * 60 * 1000; 
  await global.mongoose; 

  const recentClaim = await ClaimLog.findOne({
    $or: [{ ip }, { session: session?.value }],
    claimedAt: { $gte: new Date(Date.now() - cooldownTime) },
  });

  if (recentClaim) {
    return NextResponse.json({ message: "You can claim another coupon after an hour." }, { status: 429 });
  }

  const coupons = await Coupon.find();
  if (coupons.length === 0) {
    return NextResponse.json({ message: "No coupons available." }, { status: 400 });
  }

  const assignedCoupon = coupons[0];

  await ClaimLog.create({ ip, session: session?.value, coupon: assignedCoupon.code, claimedAt: new Date() });

  if (!session) {
    cookies().set("coupon_session", Math.random().toString(36).substring(7), { maxAge: cooldownTime, httpOnly: true });
  }

  return NextResponse.json({ message: "Coupon claimed successfully!", coupon: assignedCoupon.code });
}
