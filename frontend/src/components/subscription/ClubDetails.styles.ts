import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

export const SectionLabel = styled(Typography)(({ theme }) => ({
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: theme.palette.text.secondary,
  margin: theme.spacing(2.5, 0.25, 1),
}));

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
