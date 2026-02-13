export class UIPersonalization {
  rankFeatures(history) {
    return history.sort((a, b) => b.usage - a.usage)
  }
}
