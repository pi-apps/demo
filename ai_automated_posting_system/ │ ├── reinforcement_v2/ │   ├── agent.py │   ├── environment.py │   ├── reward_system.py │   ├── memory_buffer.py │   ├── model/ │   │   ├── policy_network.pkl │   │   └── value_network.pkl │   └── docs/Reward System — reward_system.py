def calculate_reward(metrics):
    reward = 0
    reward += metrics["engagement"] * 2
    reward += metrics["shares"] * 5
    reward -= metrics["drop_rate"] * 3
    return reward
