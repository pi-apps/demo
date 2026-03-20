export const redirectToLaunchpad = () => {
  const env = import.meta.env;

  if (env.NODE_ENV === "production") {
    window.open("launchpad.pinet.com", "_top", "noreferrer");
  } else {
    window.open("https://minepi.com", "_top", "noreferrer");
  }
};
