import mongoose from "mongoose";

const StockSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, index: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    reorderLevel: { type: Number, default: 10 },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" }
  },
  { timestamps: true }
);

StockSchema.index({ productId: 1, supplierId: 1 });

export default mongoose.model("Stock", StockSchema);
