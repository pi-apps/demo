import { StrKey } from "@stellar/stellar-base";
import { withTimeout } from "../../utils/withTimeout";
import { onIncompletePaymentFound, rememberWalletGrant, SIGN_IN_SCOPES, WALLET_SCOPE } from "../useAuth";
import { APP_WALLET_ADDRESS } from "../useSubscriptions";
import { byTrialThenPeriod, errorText, failure, toPlan, type MySubscription, type Plan } from "./plans";

const READ_TIMEOUT_MS = 20_000;
export const read = <T>(promise: Promise<T>, what: string) => withTimeout(promise, READ_TIMEOUT_MS, `reading ${what}`);

// The consent screen waits on the user, so it gets a long timeout rather than none: a host that never answers
// must still end in something the user can retry.
const CONSENT_TIMEOUT_MS = 120_000;

// The signed-in user's wallet. The wallet_address scope is asked for only here, for users who get the club, rather
// than at every sign-in: authenticating again with it shows the consent screen for just that scope. The platform
// lists the active wallet first (pi back, users_controller#user_wallets orders by is_active, then updated_at).
export const loadWallet = async () => {
  await withTimeout(
    window.Pi.authenticate([...SIGN_IN_SCOPES, WALLET_SCOPE], onIncompletePaymentFound),
    CONSENT_TIMEOUT_MS,
    "waiting for the wallet address permission"
  );
  rememberWalletGrant();
  const { wallets } = await read(window.Pi.Wallet.getUserWalletAddresses(), "your wallet address");
  const address = wallets?.[0]?.publicKey;
  // it arrives over the SDK bridge, so it is checked before it is used as an address
  if (typeof address !== "string" || !StrKey.isValidEd25519PublicKey(address)) {
    throw new Error("No wallet found for this user");
  }
  return address;
};

export const walletFailure = (err: unknown) => {
  const message = errorText(err);
  if (message.startsWith("Unauthorized app.")) {
    return failure("This app isn't allowed to read wallet addresses yet.", false, err);
  }
  if (message.startsWith("Missing wallet_address scope.") || message.startsWith("User consent cancelled")) {
    return failure("Pi Bakery Club needs permission to read your wallet address.", true, err);
  }
  if (message === "No wallet found for this user") {
    // the platform lists only wallets with Pi Testnet enabled
    return failure("No Pi wallet with Pi Testnet enabled was found for your account.", false, err);
  }
  return failure("Couldn't read your wallet address.", true, err);
};

export const loadPlans = async () => {
  const services = await read(window.Pi.SmartContract.Subscription.getMerchantServices(APP_WALLET_ADDRESS), "plans");
  return services.map(toPlan).sort(byTrialThenPeriod);
};

export const plansFailure = (err: unknown) => failure("Couldn't load the plans.", true, err);

// the user's most relevant subscription to one of the app's plans: the newest active one, else the newest
export const loadMySubscription = async (walletAddress: string, plans: Plan[]): Promise<MySubscription | null> => {
  const { Subscription } = window.Pi.SmartContract;
  const plansById = new Map(plans.map(plan => [plan.serviceId, plan]));
  const ours = (await read(Subscription.getSubscriberSubscriptions(walletAddress), "your subscriptions"))
    .filter(subscription => plansById.has(String(subscription.service_id)))
    .sort((a, b) => Number(b.created_at) - Number(a.created_at));
  if (ours.length === 0) {
    return null;
  }

  // Each status check is its own contract read, so plans whose every subscription has plainly ended are not asked
  // about: without auto renew there is nothing after service_end_ts. The contract decides the rest.
  const now = Date.now() / 1000;
  const mayBeActive = ours.filter(subscription => subscription.auto_renew || Number(subscription.service_end_ts) > now);
  const serviceIds = [...new Set(mayBeActive.map(subscription => String(subscription.service_id)))];
  const active = await Promise.all(
    serviceIds.map(id => read(Subscription.isSubscriptionActive(walletAddress, id), "your subscription's status"))
  );
  const activeServiceIds = serviceIds.filter((_id, index) => active[index]);

  const pick = ours.find(subscription => activeServiceIds.includes(String(subscription.service_id))) ?? ours[0];
  return {
    plan: plansById.get(String(pick.service_id))!,
    subscription: pick,
    active: activeServiceIds.includes(String(pick.service_id)),
    activeServiceIds,
    inTrial: Number(pick.trial_end_ts) > now,
    hasEnded: Number(pick.service_end_ts) <= now,
  };
};

export const subscriptionFailure = (err: unknown) =>
  // the SDK loads the subscriber's account before every read, and a wallet never used on Pi Testnet has none
  /Account not found/i.test(errorText(err))
    ? failure(
        "Your wallet isn't on Pi Testnet yet. Open it once in the Pi Wallet to activate it, then try again.",
        true,
        err
      )
    : failure("Couldn't check your subscription.", true, err);
