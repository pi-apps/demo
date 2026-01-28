import statistics

class BehavioralBiometrics:
    def __init__(self):
        self.typing_speed_threshold = 30  # ms per character
        self.touch_pressure_min = 0.1
        self.touch_pressure_max = 0.8

    def detect_bot_typing(self, typing_speeds):
        avg_speed = statistics.mean(typing_speeds)
        if avg_speed < self.typing_speed_threshold:
            return True
        return False

    def detect_swipe_anomaly(self, swipe_angles):
        variance = statistics.variance(swipe_angles) if len(swipe_angles) > 1 else 0
        return variance < 0.01  # too perfect -> likely a bot

    def evaluate(self, typing_speeds, swipe_angles, touch_pressure):
        anomalies = []

        if self.detect_bot_typing(typing_speeds):
            anomalies.append("bot-like typing detected")

        if self.detect_swipe_anomaly(swipe_angles):
            anomalies.append("automated swipe pattern detected")

        if not (self.touch_pressure_min <= touch_pressure <= self.touch_pressure_max):
            anomalies.append("abnormal touch pressure")

        return {
            "status": "anomalies" if anomalies else "normal",
            "issues": anomalies
        }
