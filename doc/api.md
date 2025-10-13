# TrustSphere API Documentation

This document outlines the backend routes and logic for TrustSphere’s modular trust infrastructure.

---

## 🔐 Escrow Routes

### `POST /api/escrow/initiate`
Initiates an escrow transaction between buyer and seller.

**Body Parameters:**
- `buyerId`
- `sellerId`
- `amount`
- `itemDescription`

### `POST /api/escrow/release`
Releases funds from escrow after successful transaction.

**Body Parameters:**
- `escrowId`
- `confirmationCode`

---

## 📊 Reputation Routes

### `GET /api/reputation/:userId`
Fetches the reputation score for a given user.

**Params:**
- `userId` (string)

---

## ⚖️ Dispute Routes

### `POST /api/dispute/submit`
Submits a dispute for review.

**Body Parameters:**
- `transactionId`
- `reason`
- `evidence` (optional)

---

## 🧠 Notes

- All routes expect JSON payloads.
- Authentication is optional for demo purposes.
- Future versions will include Pi user verification and dispute arbitration logic.

