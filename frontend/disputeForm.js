export function submitDispute(escrowId, reason) {
  return fetch('/api/dispute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ escrowId, reason })
  });
}
