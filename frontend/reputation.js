export function getReputation(userId) {
  return fetch(`/api/reputation/${userId}`)
    .then(res => res.json());
}
