import { createContext, useContext, useEffect } from "react";
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

// a few seconds after the end time, so the contract sees it as ended too
const EXPIRY_MARGIN_MS = 5_000;
const MAX_TIMER_MS = 2 ** 31 - 1;
// read as active although its end time has passed (an answer that arrived late, or the phone's clock running ahead):
// read again shortly, until the contract agrees it has ended
const PAST_END_RECHECK_MS = 30_000;

// enabled: whether this user gets the club at all (see canUseClub); nothing is read otherwise.
// walletWanted: whether the current page shows the club, so the wallet permission is only asked where it is used.
export const useClubSubscription = (enabled: boolean, sessionId: number, walletWanted: boolean) => {
  const wallet = useKeyedRead(enabled && walletWanted ? String(sessionId) : null, loadWallet, walletFailure);
  const plans = useKeyedRead(enabled ? `plans:${sessionId}` : null, loadPlans, plansFailure);

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

  // An active subscription runs out at its end time, so it is read again then: a page left open does not stay
  // unlocked. Past the longest timer the browser allows, the next visit's read covers it.
  const activeUntil = mine.state.status === "ready" ? (mine.state.value?.activeUntil ?? null) : null;
  const { retry: rereadMine } = mine;
  useEffect(() => {
    if (activeUntil === null) {
      return;
    }
    const untilEnd = activeUntil - Date.now() + EXPIRY_MARGIN_MS;
    if (untilEnd > MAX_TIMER_MS) {
      return;
    }
    const timer = setTimeout(rereadMine, untilEnd > 0 ? untilEnd : PAST_END_RECHECK_MS);
    return () => clearTimeout(timer);
  }, [activeUntil, rereadMine]);

  // one status for the screens: the first thing that failed or is not ready yet is what they show
  const failed = [wallet, plans, mine].find(read => read.state.status === "error");
  const status: Loadable<MySubscription | null> = failed?.state.status === "error" ? failed.state : mine.state;

  return {
    enabled,
    walletAddress,
    plans: readyPlans?.filter(plan => plan.offered) ?? [],
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
