import mongoose from "mongoose";
const { Schema } = mongoose;

const coordinatesSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

const timeWindowSchema = new Schema(
  {
    start: { type: Date },
    end: { type: Date },
  },
  { _id: false }
);

// Represents a single customer's delivery within a stop.
// A stop can have one or more packages (e.g. multiple flats
// in the same building, multiple orders at one office address).
const packageSchema = new Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true, // used to send delivery OTP for this specific package
  },
  notes: {
    type: String,
    default: null, // e.g. "Flat 302", "Ask for reception"
  },
  status: {
    type: String,
    enum: ["pending", "delivered", "failed"],
    default: "pending",
    // Tracks this package independently — a stop with 3 packages
    // can be partially complete (e.g. 2 delivered, 1 pending).
  },
});

const stopSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  coordinates: {
    type: coordinatesSchema,
    required: true,
  },
  priority: {
    type: Number,
    default: 0,
  },
  timeWindow: timeWindowSchema,
  assignedAgentId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null, // used for multi-agent clustering
  },
  packages: {
    type: [packageSchema],
    default: [],
    // One or more customer deliveries at this single location.
    // Route optimization only cares about `coordinates` above —
    // it treats this whole array as one visit.
  },
});

const deliveryListSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    depotAddress: {
      type: String,
      required: true,
    },
    depotCoordinates: {
      type: coordinatesSchema,
      required: true,
    },
    stops: {
      type: [stopSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "optimized", "in-progress", "completed"],
      default: "draft",
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

export default mongoose.model("DeliveryList", deliveryListSchema);