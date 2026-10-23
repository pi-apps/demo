import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

export const DevToggle = styled(Button, { shouldForwardProp: prop => prop !== "open" })<{ open: boolean }>(
  ({ theme, open }) => ({
    marginTop: theme.spacing(1.5),
    justifyContent: "space-between",
    color: theme.palette.text.secondary,
    borderTop: `1px solid ${theme.palette.divider}`,
    borderRadius: 0,
    "& .MuiButton-endIcon": { transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" },
  })
);

// the original form keeps the app's original look: plain browser controls and the app's font
export const Legacy = styled(Box)(({ theme }) => ({
  fontFamily: `-apple-system-body, "Helvetica Neue", Helvetica, sans-serif`,
  color: theme.palette.common.black,
}));
