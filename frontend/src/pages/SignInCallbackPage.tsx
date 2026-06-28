import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SIGN_IN_STATE_STORAGE_KEY } from "./SignInPage";

const PI_ME_URL = "https://api.minepi.com/v2/me";

type CallbackState = "loading" | "success" | "error";

const SignInCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState<CallbackState>("loading");
  const [username, setUsername] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [returnedState, setReturnedState] = useState<string | null>(null);
  const [stateMatches, setStateMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const hash = location.hash.startsWith("#") ? location.hash.slice(1) : location.hash;

    if (!hash) {
      setState("error");
      setErrorMessage("No access token found in callback URL.");
      return;
    }

    const params = new URLSearchParams(hash);
    const token = params.get("access_token");
    const incomingState = params.get("state");
    const expectedState = localStorage.getItem(SIGN_IN_STATE_STORAGE_KEY);
    setReturnedState(incomingState);
    setStateMatches(incomingState !== null && incomingState === expectedState);

    window.history.replaceState(null, "", `${location.pathname}${location.search}`);

    if (!token) {
      setState("error");
      setErrorMessage("No access token found in callback URL.");
      return;
    }

    const fetchMe = async () => {
      try {
        const response = await fetch(PI_ME_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setState("error");
          setErrorMessage("Failed to fetch Pi account details.");
          return;
        }

        const data = (await response.json()) as { username?: string };

        if (!data.username) {
          setState("error");
          setErrorMessage("Pi API response did not include a username.");
          return;
        }

        setUsername(data.username);
        setState("success");
      } catch {
        setState("error");
        setErrorMessage("Could not reach Pi API.");
      }
    };

    void fetchMe();
  }, [location.hash, location.pathname, location.search]);

  const onGoBack = () => {
    navigate("/sign-in");
  };

  return (
    <Box
      minHeight="100vh"
      px={3}
      py={6}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      textAlign="center"
    >
      <Typography variant="h4" fontWeight={700}>
        Sign In Callback
      </Typography>

      {state === "loading" ? <Typography>Signing you in...</Typography> : null}

      {state === "success" && username ? (
        <>
          <Typography variant="h5" fontWeight={700}>
            Success! Welcome, @{username}.
          </Typography>
          <Typography>
            state: {returnedState ?? "(none)"} {stateMatches ? "✅" : "❌"}
          </Typography>
        </>
      ) : null}

      {state === "error" ? <Typography color="error">{errorMessage || "Sign-in failed."}</Typography> : null}

      <Button variant="outlined" size="large" onClick={onGoBack}>
        Go back
      </Button>
    </Box>
  );
};

export default SignInCallbackPage;
