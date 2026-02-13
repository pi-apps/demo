export function recommendProducts(userHistory) {
  const { purchases, visits, interests } = userHistory;

  const recommended = [];

  if (purchases.includes("liquor")) {
    recommended.push("Castle Lite", "Black Label", "Mosi");
  }

  if (interests.includes("health")) {
    recommended.push("Vitamin C", "Painkillers", "First Aid Kit");
  }

  if (visits > 10) {
    recommended.push("Loyalty discount");
  }

  return recommended;
}
