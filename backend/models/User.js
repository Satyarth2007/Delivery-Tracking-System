import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: false,
      // Not set until account activation (status: pending -> active).
    },
    role: {
      type: String,
      enum: ["dispatcher", "agent"],
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null, // null for the founding dispatcher
    },
    status: {
      type: String,
      enum: ["pending", "active", "deactivated"],
      default: "pending",
    },
    invitedAt: {
      type: Date,
      default: null,
    },
    activatedAt: {
      type: Date,
      default: null,
      // Permanent record of activation time. The OTP itself lives in
      // Redis (temporary), not in this document.
    },
    mustResetPassword: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

// Prevents the same person from being added twice under the same company,
// while still allowing the same phone/email to have separate accounts
// across different companies (multi-company agent scenario).
userSchema.index({ phone: 1, companyId: 1 }, { unique: true });
userSchema.index({ email: 1, companyId: 1 }, { unique: true });

export default mongoose.model("User", userSchema);