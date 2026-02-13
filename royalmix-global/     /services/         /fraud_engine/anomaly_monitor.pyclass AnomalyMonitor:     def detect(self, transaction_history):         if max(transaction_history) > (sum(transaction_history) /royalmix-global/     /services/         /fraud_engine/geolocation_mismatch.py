class GeoMismatchDetector:
    def __init__(self):
        self.threshold_km = 1500

    def is_mismatch(self, ip_country: str, card_country: str):
        return ip_country != card_country

    def evaluate(self, ip_country, card_country):
        if self.is_mismatch(ip_country, card_country):
            return {
                "status": "warning",
                "reason": "IP location differs from card origin",
                "risk_score": 40
            }
        return {
            "status": "ok",
            "risk_score": 0
        }
