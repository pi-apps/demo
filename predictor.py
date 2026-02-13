import pickle
import numpy as np

class Predictor:
    def __init__(self):
        self.engagement = pickle.load(open("engagement_model.pkl", "rb"))
        self.time_model = pickle.load(open("time_forecast_model.pkl", "rb"))

    def predict_engagement(self, features):
        return self.engagement.predict(np.array([features]))[0]

    def predict_best_time(self, features):
        return self.time_model.predict(np.array([features]))[0]

predictor = Predictor()
