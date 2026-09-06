import mongoose from "mongoose";
const { Schema } = mongoose;

// GeoJSON LineString for the optimized route path (used with Leaflet)
const routeGeometrySchema = new Schema(
  {
    type: {
      type: String,
      enum: ["LineString"],
      default: "LineString",
    },
    coordinates: {
      type: [[Number]], // array of [lng, lat] pairs
      default: [],
    },
  },
  { _id: false }
);

const routeSchema = new Schema(
  {
    deliveryListId: {
      type: Schema.Types.ObjectId,
      ref: "DeliveryList",
      required: true,
    },
    optimizedStopOrder: {
      type: [Schema.Types.ObjectId], // ordered array of stopId
      default: [],
    },
    totalDistanceKm: {
      type: Number,
      required: true,
    },
    totalTimeMinutes: {
      type: Number,
      required: true,
    },
    routeGeometry: routeGeometrySchema,
  },
  { timestamps: { createdAt: "generatedAt", updatedAt: false } }
);

export default mongoose.model("Route", routeSchema);