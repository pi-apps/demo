import { RawDetails } from "./club.styles";

// the raw error behind a plain sentence, folded away under Details
const RawError = ({ details }: { details: string }) => (
  <details>
    <summary>Details</summary>
    <RawDetails>{details}</RawDetails>
  </details>
);

export default RawError;
