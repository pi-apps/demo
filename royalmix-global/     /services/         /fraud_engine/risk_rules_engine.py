class RiskRulesEngine:
    def __init__(self):
        self.rules = [
            ("LARGE_ORDER_CHECK", lambda order: order.amount > 5000),
            ("SUSPICIOUS_COUNTRY", lambda order: order.country in ["NG", "SO", "PK"]),
            ("ACCOUNT_AGE", lambda order: order.user_age_days < 7),
            ("MULTIPLE_CARDS", lambda order: len(order.cards_used) > 3)
        ]

    def evaluate(self, order):
        triggered = []
        for rule_name, rule in self.rules:
            if rule(order):
                triggered.append(rule_name)
        return triggered
