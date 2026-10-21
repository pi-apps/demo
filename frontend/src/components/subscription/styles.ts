import styled, { keyframes } from "styled-components";
// the club's fonts, bundled with the app rather than fetched from a font CDN for every visitor
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/dm-mono/400.css";

// Pi Bakery Club look, from the subscribe-sheet prototype (v2.3, "neutral" direction): plain black and the
// app's own greys (#f4f4f4 result box, #e9e9eb iOS button fill), so it sits with the rest of the app.
export const club = {
  font: `"DM Sans", -apple-system, "Helvetica Neue", sans-serif`,
  ink: "#000",
  ink2: "rgba(0, 0, 0, 0.66)",
  ink3: "rgba(0, 0, 0, 0.56)",
  line: "rgba(0, 0, 0, 0.12)",
  divider: "rgba(0, 0, 0, 0.08)",
  accent: "#000",
  // primary button: black softened to 82%
  cta: "rgba(0, 0, 0, 0.82)",
  tint: "#f4f4f4",
  tint2: "#e9e9eb",
  amberTint: "color-mix(in srgb, #ba7517 10%, #fff)",
  amberText: "#854f0b",
  scrim: "rgba(0, 0, 0, 0.4)",
  surface: "#fff",
  // segmented control track, close button fill
  fill: "rgba(0, 0, 0, 0.06)",
  // switch track when off, sheet grab handle
  fillStrong: "rgba(0, 0, 0, 0.18)",
  shadowSoft: "0 1px 3px rgba(0, 0, 0, 0.14)",
  shadowKnob: "0 2px 4px rgba(0, 0, 0, 0.2)",
};

const spin = keyframes`to { transform: rotate(360deg); }`;
const slideUp = keyframes`from { transform: translateY(100%); }`;
const fadeIn = keyframes`from { opacity: 0; }`;

export const ClubText = styled.div`
  font-family: ${club.font};
  color: ${club.ink};
  -webkit-font-smoothing: antialiased;

  button {
    -webkit-appearance: none;
    appearance: none;
    font-family: inherit;
    letter-spacing: 0;
  }

  button:focus-visible {
    outline: 2px solid ${club.accent};
    outline-offset: 2px;
  }
`;

export const Card = styled(ClubText).attrs({ as: "section" })`
  margin: 16px;
  padding: 18px 16px 16px;
  border: 1px solid ${club.line};
  border-radius: 18px;
  background: ${club.surface};
`;

export const Head = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  margin-bottom: 16px;
`;

export const Mark = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${club.tint2};
  color: ${club.ink};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const Title = styled.h3`
  font-size: 20px;
  line-height: 1.25;
  font-weight: 700;
  margin: 0 0 6px;
`;

export const Sub = styled.p`
  font-size: 15px;
  line-height: 1.45;
  color: ${club.ink2};
  margin: 0;
`;

export const Cta = styled.button`
  width: 100%;
  height: 52px;
  border: 0;
  border-radius: 14px;
  background: ${club.cta};
  color: ${club.surface};
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  padding: 0 16px;

  &:disabled {
    cursor: default;
  }

  &:disabled:not([aria-busy="true"]) {
    background: ${club.tint};
    color: rgba(0, 0, 0, 0.4);
  }
`;

export const Ghost = styled.button`
  width: 100%;
  min-height: 44px;
  border: 0;
  background: transparent;
  color: ${club.accent};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 4px;
`;

export const Fine = styled.p`
  font-size: 13px;
  line-height: 1.45;
  color: ${club.ink3};
  margin: 10px 2px 0;
  text-align: center;
`;

export const Stack = styled.div`
  display: grid;
  gap: 8px;
`;

export const Spinner = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-right-color: transparent;
  vertical-align: -3px;
  margin-right: 8px;
  animation: ${spin} 0.8s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// a div, not a paragraph: notes can hold buttons and a details block
export const Note = styled.div`
  font-size: 13px;
  line-height: 1.4;
  border-radius: 10px;
  padding: 10px 12px;
  margin: 4px 0 10px;
  background: ${club.tint};
  color: ${club.ink};
`;

export const WarnNote = styled(Note)`
  background: ${club.amberTint};
  color: ${club.amberText};
`;

export const LinkButton = styled.button`
  border: 0;
  background: none;
  color: ${club.accent};
  font-size: 13px;
  font-weight: 600;
  padding: 6px 0;
  cursor: pointer;
  text-decoration: underline;
  position: relative;

  /* a 44px tap area without making the line of text taller */
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    min-width: 44px;
    width: 100%;
    height: 44px;
    transform: translate(-50%, -50%);
  }
`;

export const ResultIcon = styled.div<{ $tone: "ok" | "warn" | "lock" }>`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px auto 10px;
  background: ${({ $tone }) => ($tone === "ok" ? club.accent : $tone === "warn" ? club.amberTint : club.tint)};
  color: ${({ $tone }) => ($tone === "ok" ? club.surface : $tone === "warn" ? club.amberText : club.ink)};
`;

export const ResultTitle = styled.p`
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 4px;
`;

export const ResultBody = styled.p`
  font-size: 15px;
  line-height: 1.45;
  color: ${club.ink2};
  text-align: center;
  margin: 0 0 14px;
`;

export const Rows = styled.div`
  border: 1px solid ${club.line};
  border-radius: 14px;
  margin: 0 0 14px;

  & > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 11px 14px;
    font-size: 15px;
  }

  & > div + div {
    border-top: 1px solid ${club.line};
  }

  span {
    color: ${club.ink2};
  }

  b {
    font-weight: 600;
    text-align: right;
  }

  b small {
    display: block;
    font-size: 12px;
    font-weight: 400;
    color: ${club.ink3};
    margin-top: 1px;
  }
`;

export const Detail = styled.pre`
  font:
    12px/1.5 "DM Mono",
    ui-monospace,
    Menlo,
    monospace;
  background: ${club.tint};
  border-radius: 10px;
  padding: 10px 12px;
  white-space: pre-wrap;
  word-break: break-all;
  color: ${club.ink};
  margin: 0 0 12px;
  max-height: 220px;
  overflow: auto;
`;

export const ActiveRow = styled.div<{ $muted?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 14px;
  background: ${club.tint};
  margin: 0 0 12px;

  & > div {
    flex: 1;
    font-size: 15px;
    font-weight: 600;
    color: ${({ $muted }) => ($muted ? club.ink2 : club.ink)};
  }

  & > div small {
    display: block;
    font-weight: 400;
    color: ${club.ink2};
    font-size: 13px;
    margin-top: 2px;
  }
`;

export const Pill = styled.span<{ $muted?: boolean }>`
  font-size: 12px;
  font-weight: 700;
  border-radius: 999px;
  padding: 3px 9px;
  background: ${({ $muted }) => ($muted ? club.divider : club.accent)};
  color: ${({ $muted }) => ($muted ? club.ink2 : club.surface)};
`;

export const Scrim = styled.div`
  position: fixed;
  inset: 0;
  background: ${club.scrim};
  z-index: 10;
  animation: ${fadeIn} 0.3s ease;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Sheet = styled(ClubText)`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 11;
  background: ${club.surface};
  border-radius: 20px 20px 0 0;
  padding: 8px 16px 30px;
  max-height: 92%;
  overflow: auto;
  box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.18);
  animation: ${slideUp} 0.4s cubic-bezier(0.32, 0.72, 0, 1);

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  /* focused on open for screen readers; the controls inside carry their own focus ring */
  &:focus {
    outline: none;
  }
`;
