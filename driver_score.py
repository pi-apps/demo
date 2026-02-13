class DriverScore:
    def evaluate(self, data):
        score = 100
        score -= data["late_deliveries"] * 5
        score -= data["speeding"] * 2
        return max(score, 0)
