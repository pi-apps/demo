import joblib
import numpy as np

class FraudMLModel:
    def __init__(self):
        self.model = joblib.load("fraud_model.pkl")

    def predict(self, features):
        arr = np.array(features).reshape(1, -1)
        return self.model.predict(arr)[0]
