import statistics

class ETAPredictor:
    def predict(self, history):
        return statistics.mean(history)
