class HeatmapEngine:
    def generate(self, order_history):
        zones = {}
        for o in order_history:
            zones[o["zone"]] = zones.get(o["zone"], 0) + 1
        return zones
