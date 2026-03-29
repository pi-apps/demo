export const redirectToLaunchpad = () => {
  const env = import.meta.env;

  if (env.PROD) {
    window.open("https://launchpad.pinet.com", "_top", "noreferrer");
  } else {
    window.open("https://minepi.com", "_top", "noreferrer");
  }
};
