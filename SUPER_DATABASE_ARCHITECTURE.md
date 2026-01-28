# Royal Mix Global — Super Database Architecture

## Core Databases

### 1. Main Relational Database (PostgreSQL)
Stores operational data.

Tables:
- users (citizens, businesses, agents)
- wallets
- wallet_transactions
- products
- orders
- order_items
- merchant_profiles
- properties
- leases
- rent_payments

### 2. Financial Ledger Database (Immutable)
Stores double-entry financial records.

Tables:
- ledger_entries
(transaction_id, debit_account, credit_account, amount, currency, hash, timestamp)

Purpose:
- Financial audit trail
- Tax verification
- Future blockchain anchoring

### 3. Analytics & AI Database
Used for dashboards and AI engines.

Tables:
- user_activity_logs
- transaction_metrics
- marketplace_stats
- agent_performance
- economic_indicators

### 4. Cache Layer (Redis)
Used for:
- Wallet balances (fast reads)
- Sessions
- OTP codes
- Rate limiting

### 5. Document Storage
Used for:
- IDs
- Business licenses
- Contracts
- Property documents
