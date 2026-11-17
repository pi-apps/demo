import { createTheme } from "@mui/material/styles";
// the club's fonts, bundled with the app rather than fetched from a font CDN for every visitor
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/dm-mono/400.css";

// Pi Bakery Club look, from the design: plain black on the app's
// own greys, so it sits with the rest of the app. Everything else is MUI's defaults.
export const clubTheme = createTheme({
  palette: {
    primary: { main: "#1f1f1f" },
    warning: { main: "#ba7517" },
    // grey notes, as in the design, rather than MUI's blue
    info: { main: "#5f5f5f" },
    background: { default: "#f4f4f4" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: `"DM Sans", -apple-system, "Helvetica Neue", sans-serif`,
    button: { textTransform: "none", fontWeight: 600, fontSize: 16 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true, fullWidth: true } },
    // a grey track with the chosen plan raised in white, as in the design
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: { background: "rgba(0, 0, 0, 0.06)", padding: 3, gap: 3 },
        grouped: { border: 0, borderRadius: "9px !important" },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          "&.Mui-selected": {
            background: "#fff",
            color: "#000",
            fontWeight: 700,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.14)",
          },
        },
      },
    },
  },
});

export const monoFont = `"DM Mono", ui-monospace, Menlo, monospace`;
