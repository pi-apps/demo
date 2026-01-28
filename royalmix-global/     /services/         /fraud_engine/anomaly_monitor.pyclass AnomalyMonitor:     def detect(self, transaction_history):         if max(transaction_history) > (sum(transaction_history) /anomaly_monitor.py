class AnomalyMonitor:
    def detect(self, transaction_history):
        if max(transaction_history) > (sum(transaction_history) / 2):
            return True
        return False
