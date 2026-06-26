import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const PI_OAUTH_AUTHORIZE_URL = "https://accounts.pinet.com/oauth/authorize";
const PI_CLIENT_ID = "B2AKdt2zKHxgNqJ18e6PcyuNj4K_JyLgv6q6z8bOLao";

const getFrontendURL = () => {
  const runtimeURL = typeof window !== "undefined" ? window.__ENV?.frontendURL : undefined;

  return runtimeURL || window.location.origin;
};

const SignInPage = () => {
  const onSignInWithPi = () => {
    const redirectURI = new URL("/sign-in/callback", getFrontendURL()).toString();
    const params = new URLSearchParams({
      response_type: "token",
      client_id: PI_CLIENT_ID,
      scope: "username wallet_address",
      redirect_uri: redirectURI,
    });

    window.location.href = `${PI_OAUTH_AUTHORIZE_URL}?${params.toString()}`;
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

      <Button variant="contained" size="large" onClick={onSignInWithPi}>
        Sign In with Pi
      </Button>
    </Box>
  );
};

export default SignInPage;
