import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

const PI_OAUTH_AUTHORIZE_URL = "https://accounts.pinet.com/oauth/authorize";
const PI_CLIENT_ID = "B2AKdt2zKHxgNqJ18e6PcyuNj4K_JyLgv6q6z8bOLao";

export const SIGN_IN_STATE_STORAGE_KEY = "pi_sign_in_state";

const generateState = () =>
  Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

const getFrontendURL = () => {
  const runtimeURL = typeof window !== "undefined" ? window.__ENV?.frontendURL : undefined;

  return runtimeURL || window.location.origin;
};

const SignInPage = () => {
  const [state, setState] = useState("");

  useEffect(() => {
    const newState = generateState();
    localStorage.setItem(SIGN_IN_STATE_STORAGE_KEY, newState);
    setState(newState);
  }, []);

  const buildSigninURL = () => {
    const redirectURI = new URL("/sign-in/callback", getFrontendURL()).toString();
    const params = new URLSearchParams({
      response_type: "token",
      client_id: PI_CLIENT_ID,
      scope: "username wallet_address",
      redirect_uri: redirectURI,
      state,
    });

    return `${PI_OAUTH_AUTHORIZE_URL}?${params.toString()}`;
  }

  const onSignInWithPi = () => {
    window.location.href = buildSigninURL();
  };

  const onSignInWithPiSDK = () => {
    const redirectURI = new URL("/sign-in/callback", getFrontendURL()).toString();

    window.Pi.signIn({
      clientId: PI_CLIENT_ID,
      redirectUri: redirectURI,
      scopes: ["username", "wallet_address"],
      state,
    });
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
        Sign In
      </Typography>

      <Typography>state: {state || "(generating...)"}</Typography>

      <Button variant="contained" size="large" onClick={onSignInWithPi}>
        Sign in with Pi (plain OAuth)
      </Button>

      <Button variant="contained" size="large" onClick={onSignInWithPiSDK}>
        Sign in with Pi (SDK)
      </Button>

      <a href={buildSigninURL()}>Sign In with Pi (link version?)</a>
    </Box>
  );
};

export default SignInPage;
