export class GestureAI {
  analyze(gestureData) {
    if (gestureData.speed < 0.2) return "increase-sensitivity";
    if (gestureData.swipeErrors > 4) return "enable-guided-mode";
    return "normal";
  }
}
