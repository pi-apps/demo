export class AdaptiveLayout {
  optimize(userContext) {
    return {
      fontScale: userContext.age > 45 ? 1.3 : 1.0,
      buttonSize: userContext.device === "small" ? "large" : "normal",
      layout: userContext.networkSpeed < 2 ? "lite" : "full"
    };
  }
}
