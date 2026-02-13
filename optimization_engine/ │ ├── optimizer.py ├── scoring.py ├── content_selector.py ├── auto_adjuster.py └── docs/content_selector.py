def select_best_content(queue):
    return sorted(queue, key=lambda x: x["score"], reverse=True)[0]
