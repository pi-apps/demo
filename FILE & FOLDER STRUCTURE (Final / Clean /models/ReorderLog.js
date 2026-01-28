import mongoose from "mongoose";

const ReorderLogSchema = new mongoose.Schema(
  {
    stockId: { type: mongoose.Schema.Types.ObjectId, ref: "Stock" },
    quantityOrdered: Number,
    status: { type: String, default: "PENDING" },
    auto: { type: Boolean, default: true }
  },
  { timestamps: true }
);

ReorderLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 * 30 });

export default mongoose.model("ReorderLog", ReorderLogSchema);
