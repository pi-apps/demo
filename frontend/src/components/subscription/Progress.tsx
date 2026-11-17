import type { ReactNode } from "react";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

// something the club is still waiting for, with a spinner
const Progress = ({ children }: { children: ReactNode }) => (
  <Alert severity="info" icon={<CircularProgress size={18} aria-hidden="true" />} role="status">
    {children}
  </Alert>
);

export default Progress;
