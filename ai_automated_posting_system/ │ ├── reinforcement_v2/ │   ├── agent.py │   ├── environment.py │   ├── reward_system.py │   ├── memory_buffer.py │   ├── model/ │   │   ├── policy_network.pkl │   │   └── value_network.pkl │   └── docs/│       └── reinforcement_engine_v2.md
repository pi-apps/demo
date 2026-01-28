class Environment:
    def __init__(self):
        self.state = None

    def observe_state(self, metrics):
        self.state = [
            metrics["engagement"],
            metrics["velocity"],
            metrics["audience_growth"],
            metrics["posting_time_score"],
            metrics["trend_index"]
        ]
        return self.state
