export class CameraRecognition {
  static detect(frameData) {
    return {
      detectedItems: [
        { productId: "RM-CH-01", count: 12 },
        { productId: "RM-ML-02", count: 4 }
      ]
    };
  }
}
