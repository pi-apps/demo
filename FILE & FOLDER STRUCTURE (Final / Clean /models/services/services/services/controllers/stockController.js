import Stock from "../models/Stock.js";
import { PredictionEngine } from "../services/PredictionEngine.js";
import { StockMonitor } from "../services/StockMonitor.js";
import { AutoReorderService } from "../services/AutoReorderService.js";

export const StockController = {
  async checkAndReorder(req, res) {
    const stock = await Stock.findById(req.params.id);
    StockMonitor.check(stock);
    res.json({ status: "checked", stock });
  },

  async predict(req, res) {
    const { history } = req.body;
    const forecast = PredictionEngine.forecast(history);
    res.json({ forecast });
  }
};
