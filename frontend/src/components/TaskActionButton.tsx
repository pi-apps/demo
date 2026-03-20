import Button from "@mui/material/Button";
import { useEffect, useMemo, useState } from "react";
import { formatMinutesSeconds } from "../utils/time.ts";

type TaskActionButtonProps = {
  cooldownMs: number;
  onTap: () => void;
  tapLabel: string;
  refreshLabel: string;
  unlockInLabel: (countdown: string) => string;
};

const TaskActionButton = ({ cooldownMs, onTap, tapLabel, refreshLabel, unlockInLabel }: TaskActionButtonProps) => {
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
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
    setCooldownUntil(Date.now() + cooldownMs);
    setNowMs(Date.now());
  };

  const handleRefresh = () => {
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
