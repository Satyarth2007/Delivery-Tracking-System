import mongoose from "mongoose";
const { Schema } = mongoose;

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending_review", "approved", "rejected"],
      default: "pending_review",
      // New companies start unverified. Agents can't be invited / routes
      // can't be created until an admin approves the company (app logic).
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewedBy: {
      type: String,
      default: null,
      // Admin identifier (name/email string) — no separate Admin model
      // needed at this scale.
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

export default mongoose.model("Company", companySchema);