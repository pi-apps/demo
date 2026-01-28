import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: { type: String },
    piWallet: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Supplier", SupplierSchema);
