def score_content(metrics):
    score = 0
    score += metrics["watch_time"] * 4
    score += metrics["likes"] * 2
    score += metrics["comments"] * 3
    return score
