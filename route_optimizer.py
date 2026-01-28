class RouteOptimizer:
    def find_best_route(self, orders):
        return sorted(orders, key=lambda x: x['distance_km'])
