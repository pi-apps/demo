import ListItemIcon from "@mui/material/ListItemIcon";
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

export const StepIcon = styled(ListItemIcon)({ minWidth: 34 });
