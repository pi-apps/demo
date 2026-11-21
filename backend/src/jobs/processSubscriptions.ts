// Collects due subscription renewals for one service on Pi's Subscription contract.
//
// Renewals don't happen on their own: the merchant (the wallet that owns the service) has to call the
// contract's `process` at least once per billing period. This script does that from the server with
// pi-backend's SmartContract.Subscription.process, one batch of subscriptions per transaction, so it can
// run from cron. See doc/subscription-processing.md.
//
// Configuration comes from the environment only (a .env file works in development):
//   PI_MERCHANT_SECRET                 required: secret seed (S...) of the wallet that owns the service
//   PI_SUBSCRIPTION_SERVICE_ID         required: the service's id on the Subscription contract
//   SUBSCRIPTION_PROCESS_BATCH_SIZE    optional: subscriptions per transaction (default 20)
//   SUBSCRIPTION_PROCESS_MODE          optional: "submit" (default) sends transactions,
//                                      "simulate" only previews each batch and spends nothing
//
// Exits with status 0 when every batch ran, 1 otherwise, so cron (or whatever runs it) can alert on failures.

import dotenv from "dotenv";
import { SmartContract, PiSubscriptionError } from "pi-backend";

dotenv.config();

const DEFAULT_BATCH_SIZE = 20;

type Mode = "submit" | "simulate";

type Config = {
  merchantSecret: string;
  serviceId: string;
  batchSize: number;
  mode: Mode;
};

function readConfig(): Config {
  const merchantSecret = (process.env.PI_MERCHANT_SECRET || "").trim();
  const serviceId = (process.env.PI_SUBSCRIPTION_SERVICE_ID || "").trim();
  const batchSizeText = (process.env.SUBSCRIPTION_PROCESS_BATCH_SIZE || "").trim();
  const modeText = (process.env.SUBSCRIPTION_PROCESS_MODE || "submit").trim();

  const missing: string[] = [];
  if (!merchantSecret) missing.push("PI_MERCHANT_SECRET");
  if (!serviceId) missing.push("PI_SUBSCRIPTION_SERVICE_ID");
  if (missing.length > 0) {
    throw new Error(`Missing environment variable(s): ${missing.join(", ")}. See doc/subscription-processing.md.`);
  }

  const batchSize = batchSizeText ? Number(batchSizeText) : DEFAULT_BATCH_SIZE;
  if (!Number.isInteger(batchSize) || batchSize < 1) {
    throw new Error(`SUBSCRIPTION_PROCESS_BATCH_SIZE must be a positive integer, got "${batchSizeText}".`);
  }

  if (modeText !== "submit" && modeText !== "simulate") {
    throw new Error(`SUBSCRIPTION_PROCESS_MODE must be "submit" or "simulate", got "${modeText}".`);
  }

  return { merchantSecret, serviceId, batchSize, mode: modeText };
}

function describeError(err: unknown): string {
  if (err instanceof PiSubscriptionError) {
    // The message already names the contract error (e.g. NotServiceOwner) when there is one.
    const parts = [`${err.code}: ${err.message}`];
    if (err.detail) parts.push(`detail ${err.detail}`);
    if (err.txid) parts.push(`txid ${err.txid}`);
    return parts.join(" | ");
  }
  return err instanceof Error ? err.message : String(err);
}

async function run(): Promise<boolean> {
  const { merchantSecret, serviceId, batchSize, mode } = readConfig();
  const started = Date.now();
  log(`Processing service ${serviceId} (mode ${mode}, batch size ${batchSize})`);

  // A free preview of the first batch tells us how many subscriptions there are to page through.
  const preview = await SmartContract.Subscription.process(merchantSecret, serviceId, 0, batchSize, {
    mode: "simulate",
  });
  const total = preview.total;
  if (total === 0) {
    log("The service has no subscriptions. Nothing to do.");
    return true;
  }

  const totals = { charged: 0, failed: 0, skipped: 0 };
  let failedBatches = 0;

  for (let offset = 0; offset < total; offset += batchSize) {
    const range = `[${offset}, ${Math.min(offset + batchSize, total)})`;
    try {
      if (mode === "simulate") {
        const result = await SmartContract.Subscription.process(merchantSecret, serviceId, offset, batchSize, {
          mode: "simulate",
        });
        log(`${range} would charge ${result.charged}, fail ${result.failed}, skip ${result.skipped}`);
        add(totals, result);
      } else {
        const { txid, ledger, result } = await SmartContract.Subscription.process(
          merchantSecret,
          serviceId,
          offset,
          batchSize,
        );
        log(`${range} charged ${result.charged}, failed ${result.failed}, skipped ${result.skipped} (txid ${txid}, ledger ${ledger})`);
        add(totals, result);
      }
    } catch (err) {
      failedBatches += 1;
      log(`${range} FAILED: ${describeError(err)}`);

      // With a txid the transaction may already have landed: don't send it again blindly. Look the txid up
      // first; the next scheduled run will pick up anything that is still due.
      if (err instanceof PiSubscriptionError && err.txid) {
        log("Stopping here: check the txid above before running this batch again.");
        break;
      }
      // Otherwise the batch was never sent: keep going with the next one.
    }
  }

  const verb = mode === "simulate" ? "would charge" : "charged";
  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  log(
    `Done in ${seconds}s: ${verb} ${totals.charged}, failed ${totals.failed}, skipped ${totals.skipped} ` +
      `of ${total} subscription(s); ${failedBatches} batch(es) failed.`,
  );
  return failedBatches === 0;
}

function add(totals: { charged: number; failed: number; skipped: number }, result: { charged: number; failed: number; skipped: number }) {
  totals.charged += result.charged;
  totals.failed += result.failed;
  totals.skipped += result.skipped;
}

function log(message: string) {
  console.log(`[${new Date().toISOString()}] [process-subscriptions] ${message}`);
}

// Exit explicitly: under PM2 the IPC channel to the PM2 daemon would otherwise keep the process alive.
run()
  .then((ok) => process.exit(ok ? 0 : 1))
  .catch((err) => {
    log(`FAILED: ${describeError(err)}`);
    process.exit(1);
  });
