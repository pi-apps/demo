import type { ReactNode } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ResultIcon } from "./club.styles";

interface ClubScreenProps {
  icon: ReactNode;
  title: string;
  body: string;
  children: ReactNode;
}

// a club page screen: an icon, a heading and a line, then whatever the screen offers below them
export const ClubScreen = ({ icon, title, body, children }: ClubScreenProps) => (
  <>
    {icon}
    <Typography variant="h5" component="h1" align="center" fontWeight={700}>
      {title}
    </Typography>
    <Typography align="center" color="text.secondary" mb={2}>
      {body}
    </Typography>
    {children}
  </>
);

interface LockedScreenProps {
  body: string;
  // the way in, e.g. Sign in or Subscribe; none when there is nothing the user can do
  action?: { label: string; onClick: () => void };
  onBack: () => void;
}

// the club page for someone without an active subscription
export const LockedScreen = ({ body, action, onBack }: LockedScreenProps) => (
  <ClubScreen
    icon={
      <ResultIcon tone="lock">
        <LockOutlinedIcon />
      </ResultIcon>
    }
    title="This page is for subscribers"
    body={body}
  >
    <Stack gap={1}>
      {action && (
        <Button variant="contained" size="large" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
      <Button onClick={onBack}>Back to shop</Button>
    </Stack>
  </ClubScreen>
);
