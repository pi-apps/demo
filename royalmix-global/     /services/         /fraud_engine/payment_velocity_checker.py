class PaymentVelocityChecker:
    def __init__(self, db):
        self.db = db

    def check_velocity(self, user_id):
        last_1h = self.db.get_transactions_last_hour(user_id)
        if len(last_1h) > 10:
            return True
        return False
