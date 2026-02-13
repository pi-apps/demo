class Agent:
    def __init__(self, policy_network, value_network):
        self.policy = policy_network
        self.value = value_network

    def decide_action(self, state):
        return self.policy.predict([state])[0]

    def update_policy(self, reward, state):
        # Reinforcement learning update cycle
        pass
