import styled from "styled-components";
import type { Failure } from "../../hooks/useClubSubscription";
import { club, LinkButton, WarnNote } from "./styles";

const RawDetails = styled.details`
  margin-top: 6px;
  font-size: 12px;
  color: ${club.ink2};

  summary {
    cursor: pointer;
  }

  pre {
    margin: 6px 0 0;
    white-space: pre-wrap;
    word-break: break-all;
    font:
      12px/1.5 "DM Mono",
      ui-monospace,
      Menlo,
      monospace;
  }
`;

// a failure in plain words; "Try again" only where trying again can help, the raw error behind Details
const FailureNote = ({ failure, onRetry }: { failure: Failure; onRetry: () => void }) => (
  <WarnNote>
    <span role="alert">{failure.error}</span> {failure.retry && <LinkButton onClick={onRetry}>Try again</LinkButton>}
    {failure.details && (
      <RawDetails>
        <summary>Details</summary>
        <pre>{failure.details}</pre>
      </RawDetails>
    )}
  </WarnNote>
);

export default FailureNote;
