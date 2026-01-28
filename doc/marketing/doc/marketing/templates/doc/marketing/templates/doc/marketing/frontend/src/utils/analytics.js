export const trackEvent = (eventName, data = {}) => {
  console.log("AI Analytics Event:", eventName, data);

  // Placeholder: integrate with real analytics later
  return {
    status: "logged",
    event: eventName,
    payload: data,
    timestamp: Date.now()
  };
};
