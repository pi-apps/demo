import { Router } from "express";
import env from "../environments";
import "../types/session";

export default function mountSubscriptionEndpoints(router: Router) {
  // send the app wallet address to the frontend, it is the merchant address of the app's subscription services
  router.get("/app_wallet", async (req, res) => {
    if (!req.session.currentUser) {
      return res.status(401).json({ error: "unauthorized", message: "User needs to sign in first" });
    }

    if (!env.app_wallet_address) {
      return res.status(500).json({ error: "missing_app_wallet", message: "APP_WALLET_ADDRESS is not set" });
    }

    return res.status(200).json({ address: env.app_wallet_address });
  });
}
