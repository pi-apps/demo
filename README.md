**CoinBridge** is a secure gateway built on the Pi Network designed to bridge the gap between digital assets and real-world liquidity. Our mission is to allow Pioneers to seamlessly move between Pi and local financial ecosystems.

## 🌟 Key Features
* **M-Pesa Integration:** Direct withdrawal to mobile money.
* **Airtime Top-ups:** Convert assets into mobile credit instantly.
* **External Wallet Support:** Securely bridge to external crypto environments.
* **Non-Custodial:** High security standards following Pi Network best practices.

---

## ⚙️ Technical Configuration (Pi Developer Portal)

To run this demo locally as CoinBridge, update your `Configuration` in the Pi Developer Portal:

1.  **App URL:** Set this to your local tunnel (e.g., `https://your-unique-id.ngrok-free.app`).
2.  **Wallet:** Your connected app wallet is `GDBXH...NULXY` (as seen in your dashboard).
3.  **API Key:** Generate a new API Key in the portal and paste it into `backend/.env` as `PLATFORM_API_KEY`.

---

## 🛠️ Development Setup

### 1. Backend (Node.js)
The backend handles the communication with the Pi Blockchain and the M-Pesa API.
```bash
cd backend
npm install
# Add your API keys to .env
npm start
