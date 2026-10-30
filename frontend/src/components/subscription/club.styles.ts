import Box from "@mui/material/Box";
import { styled, type Theme } from "@mui/material/styles";
import { monoFont } from "./clubTheme";

// the few looks MUI's components don't give the club out of the box

export const ClubCard = styled("section")(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 18,
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
  fontFamily: theme.typography.fontFamily,
}));

export const ClubMark = styled(Box)(({ theme }) => ({
  width: 44,
  height: 44,
  borderRadius: 12,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: theme.palette.grey[200],
}));

// a plan the user has (or had): name and one line, with a chip on the right
export const PlanRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.75),
  borderRadius: 14,
  background: theme.palette.background.default,
  marginBottom: theme.spacing(1.5),
}));

type Tone = "ok" | "warn" | "lock";

// the result icon's colours per tone
const toneColours = (theme: Theme, tone: Tone) =>
  ({
    ok: { background: theme.palette.primary.main, color: theme.palette.primary.contrastText },
    warn: { background: theme.palette.warning.light, color: theme.palette.text.primary },
    lock: { background: theme.palette.grey[200], color: theme.palette.text.primary },
  })[tone];

export const ResultIcon = styled(Box, { shouldForwardProp: prop => prop !== "tone" })<{ tone: Tone }>(
  ({ theme, tone }) => ({
    width: 52,
    height: 52,
    borderRadius: "50%",
    margin: theme.spacing(0.5, "auto", 1.25),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...toneColours(theme, tone),
  })
);

export const RawDetails = styled("pre")({
  margin: 0,
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
  fontFamily: monoFont,
  fontSize: 12,
});

export const DetailRows = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 14,
  "& > div": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.25, 1.75),
  },
  "& > div + div": { borderTop: `1px solid ${theme.palette.divider}` },
  span: { color: theme.palette.text.secondary },
  b: { fontWeight: 600, textAlign: "right" },
  "b small": { display: "block", fontSize: 12, fontWeight: 400, color: theme.palette.text.secondary },
}));

// the club page's main area; the card and the sheet set the club's font the same way
export const ClubMain = styled("main")(({ theme }) => ({
  padding: theme.spacing(3.5, 2, 5),
  fontFamily: theme.typography.fontFamily,
}));
