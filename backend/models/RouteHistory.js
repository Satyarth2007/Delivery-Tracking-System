import mongoose from "mongoose";
const { Schema } = mongoose;

const routeHistorySchema = new Schema(
  {
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    routeId: {
      type: Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    completedStops: {
      type: [Schema.Types.ObjectId], // array of stopId
      default: [],
    },
    actualDistance: {
      type: Number,
      default: 0,
    },
    actualTime: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
    },

    // --- OTP verification ---
    deliveryOTP: {
      type: String, // sent to customerPhone for this stop
    },
    otpGeneratedAt: {
      type: Date,
    },
    otpVerifiedAt: {
      type: Date,
      default: null, // set once agent enters the correct OTP
    },

    // --- Dispute handling ---
    disputeStatus: {
      type: String,
      enum: ["none", "raised", "resolved"],
      default: "none",
    },
    disputeRaisedAt: {
      type: Date,
    },
  },
  { timestamps: false } // completedAt/otp fields cover timing explicitly
);

export default mongoose.model("RouteHistory", routeHistorySchema);