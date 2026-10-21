import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import type { Failure } from "../../hooks/club/plans";
import { RawDetails } from "./club.styles";

// a failure in plain words; "Try again" only where trying again can help, the raw error behind Details
const FailureNote = ({ failure, onRetry }: { failure: Failure; onRetry: () => void }) => (
  <Alert
    severity="warning"
    action={
      failure.retry && (
        <Button color="inherit" size="small" fullWidth={false} onClick={onRetry}>
          Try again
        </Button>
      )
    }
  >
    {failure.error}
    {failure.details && (
      <details>
        <summary>Details</summary>
        <RawDetails>{failure.details}</RawDetails>
      </details>
    )}
  </Alert>
);

export default FailureNote;
