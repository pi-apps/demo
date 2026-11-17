import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import type { Failure } from "../../hooks/club/plans";
import RawError from "./RawError";

// a failure in plain words; "Try again" only where trying again can help
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
    {failure.details && <RawError details={failure.details} />}
  </Alert>
);

export default FailureNote;
