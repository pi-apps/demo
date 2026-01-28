class Memory:
    def __init__(self):
        self.buffer = []

    def add(self, state, action, reward):
        self.buffer.append((state, action, reward))
