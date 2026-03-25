import Button from "@mui/material/Button";
import { useEffect, useMemo, useState } from "react";
import { formatMinutesSeconds } from "../utils/time.ts";

type TaskActionButtonProps = {
  cooldownMs: number;
  storageKey: string;
  onTap: () => void;
  tapLabel: string;
  refreshLabel: string;
  unlockInLabel: (countdown: string) => string;
};

const TaskActionButton = ({ cooldownMs, storageKey, onTap, tapLabel, refreshLabel, unlockInLabel }: TaskActionButtonProps) => {
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(() => {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return null;
    const value = Number(stored);
    return value > Date.now() ? value : null;
  });
  const [nowMs, setNowMs] = useState(() => Date.now());

  const remainingMs = useMemo(() => (cooldownUntil ? cooldownUntil - nowMs : 0), [cooldownUntil, nowMs]);

  useEffect(() => {
    if (!cooldownUntil || remainingMs <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [cooldownUntil, remainingMs]);

  const handleTap = () => {
    onTap();
    const until = Date.now() + cooldownMs;
    // On Android, everything works fine, even after killing the app.
    // On iOS, the state is preserved as long as the app isn’t killed. If you we send it to the background or switch via the Launchpad and return to the Demo App, it works correctly. However, once the app is killed, the localStorage is cleared.
    // At the moment, we don’t have a better way to persist this state.
    // Consider providing a better way to persist the state in the future.
    localStorage.setItem(storageKey, String(until));
    setCooldownUntil(until);
    setNowMs(Date.now());
  };

  const handleRefresh = () => {
    localStorage.removeItem(storageKey);
    setCooldownUntil(null);
  };

  if (!cooldownUntil) {
    return (
      <Button variant="contained" sx={{ minWidth: 84, height: 36 }} onClick={handleTap}>
        {tapLabel}
      </Button>
    );
  }

  if (remainingMs > 0) {
    return (
      <Button variant="contained" disabled sx={{ minWidth: 110, height: 36 }}>
        {unlockInLabel(formatMinutesSeconds(remainingMs))}
      </Button>
    );
  }

  return (
    <Button variant="outlined" sx={{ minWidth: 96, height: 36 }} onClick={handleRefresh}>
      {refreshLabel}
    </Button>
  );
};

export default TaskActionButton;
