def detect_trend(content_metrics):
    if content_metrics["velocity"] > 1.7:
        return True
    return False
