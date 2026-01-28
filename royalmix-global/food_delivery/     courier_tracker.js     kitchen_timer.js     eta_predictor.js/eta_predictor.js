export class ETAPredictor {
  predict(distance, speed) {
    return `${Math.ceil(distance / speed)} minutes`;
  }
}
