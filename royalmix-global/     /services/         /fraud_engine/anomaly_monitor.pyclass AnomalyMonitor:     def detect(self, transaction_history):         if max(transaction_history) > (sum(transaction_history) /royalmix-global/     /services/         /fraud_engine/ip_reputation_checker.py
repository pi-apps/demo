class IPReputationChecker:
    def __init__(self, reputation_api):
        self.reputation_api = reputation_api

    def check_ip(self, ip_address):
        result = self.reputation_api.lookup(ip_address)

        if result["is_tor"] or result["is_proxy"] or result["is_vpn"]:
            return {
                "status": "bad",
                "risk_score": 60,
                "reason": result
            }

        return {
            "status": "clean",
            "risk_score": 0
        }
