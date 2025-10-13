export function initiateEscrow(buyerId, sellerId, amount) {
  return fetch('/api/escrow/initiate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ buyerId, sellerId, amount })
  });
}

export function releaseFunds(escrowId) {
  return fetch(`/api/escrow/release/${escrowId}`, {
    method: 'POST'
  });
}
