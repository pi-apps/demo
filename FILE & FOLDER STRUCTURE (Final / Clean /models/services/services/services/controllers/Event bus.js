import EventEmitter from "events";
import { AutoReorderService } from "../services/AutoReorderService.js";

const eventBus = new EventEmitter();

eventBus.on("stock.low", async (stock) => {
  await AutoReorderService.createReorder(stock);
});

export default eventBus;
