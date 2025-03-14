import mongoose from "mongoose";

const claimLogSchema = new mongoose.Schema({
  ip: String,
  session: String,
  coupon: String,
  claimedAt: { type: Date, default: Date.now },
});

const ClaimLog = mongoose.models.ClaimLog || mongoose.model("ClaimLog", claimLogSchema);
export default ClaimLog;
