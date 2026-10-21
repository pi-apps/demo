import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

export const SheetPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "20px 20px 0 0",
  padding: theme.spacing(2, 2, 4),
  maxHeight: "92%",
}));

export const Summary = styled(Box)(({ theme }) => ({
  borderRadius: 16,
  background: theme.palette.background.default,
  padding: theme.spacing(2),
}));

export const FeeRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  gap: theme.spacing(1.5),
  paddingTop: theme.spacing(1),
  marginTop: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.divider}`,
  span: { color: theme.palette.text.secondary },
  b: { fontWeight: 600, textAlign: "right" },
}));
