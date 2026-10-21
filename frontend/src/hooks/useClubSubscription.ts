import { createContext, useContext } from "react";
import {
  loadMySubscription,
  loadPlans,
  loadWallet,
  plansFailure,
  subscriptionFailure,
  walletFailure,
} from "./club/chainReads";
import type { Loadable, MySubscription } from "./club/plans";
import { useKeyedRead } from "./club/useKeyedRead";
import { useSubscribeAttempt } from "./club/useSubscribeAttempt";

// enabled: whether this user gets the club at all (see isSubscriptionEnabledFor); nothing is read otherwise.
// walletWanted: whether the current page shows the club, so the wallet permission is only asked where it is used.
export const useClubSubscription = (enabled: boolean, sessionId: number, walletWanted: boolean) => {
  const wallet = useKeyedRead(enabled && walletWanted ? String(sessionId) : null, loadWallet, walletFailure);
  const plans = useKeyedRead(enabled ? "plans" : null, loadPlans, plansFailure);

  const walletAddress = wallet.state.status === "ready" ? wallet.state.value : null;
  const readyPlans = plans.state.status === "ready" ? plans.state.value : null;
  // what the subscription read and an attempt are tied to: this session and this wallet
  const key = walletAddress ? `${sessionId}:${walletAddress}` : null;

  const mine = useKeyedRead(
    key && readyPlans ? key : null,
    () => loadMySubscription(walletAddress!, readyPlans!),
    subscriptionFailure
  );
  const attempt = useSubscribeAttempt(walletAddress, key, mine.retry);

  // one status for the screens: the first thing that failed or is not ready yet is what they show
  const failed = [wallet, plans, mine].find(read => read.state.status === "error");
  const status: Loadable<MySubscription | null> = failed?.state.status === "error" ? failed.state : mine.state;

  return {
    enabled,
    walletAddress,
    plans: readyPlans?.filter(plan => plan.isActive) ?? [],
    status,
    // tries again whatever failed; offered only when status.retry says it can help
    retry: failed?.retry ?? mine.retry,
    // reads the user's subscription again, e.g. when a transaction may have landed after we stopped waiting
    refresh: mine.retry,
    ...attempt,
  };
};

// one club state for the whole app, so the shop and the club page share reads and an attempt in progress
export const ClubContext = createContext<ReturnType<typeof useClubSubscription> | null>(null);

export const useClub = () => {
  const club = useContext(ClubContext);
  if (!club) {
    throw new Error("useClub must be used inside ClubProvider");
  }
  return club;
};
