export class ThemeManager {
  apply(context) {
    if (context.battery < 15) return "ultra-lite";
    if (context.time >= 18) return "dark";
    return "default";
  }
}
