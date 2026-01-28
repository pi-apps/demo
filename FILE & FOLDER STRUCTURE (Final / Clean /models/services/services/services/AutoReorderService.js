import ReorderLog from "../models/ReorderLog.js";
import Supplier from "../models/Supplier.js";
import { sendNotification } from "../utils/notifications.js";
import { initiatePiPayment } from "../utils/security.js";

export class AutoReorderService {
  static async createReorder(stock) {
    const supplier = await Supplier.findById(stock.supplierId);

    const order = await ReorderLog.create({
      stockId: stock._id,
      quantityOrdered: stock.reorderLevel * 2
    });

    sendNotification(supplier.contact, `Auto-reorder placed for ${stock.productName}`);

    await initiatePiPayment(supplier.piWallet, 1.5);

    return order;
  }
}
