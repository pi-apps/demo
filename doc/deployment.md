# 🚀 Deployment Guide - GHN.PI

Hướng dẫn triển khai (deploy) dự án GHN.PI lên server.

---

## 1. Deploy nhanh bằng Vercel (Khuyến nghị cho Frontend)

1. Vào [vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
2. Click **"New Project"** → Import repo `GHN.PI`.
3. Vercel sẽ tự động detect framework (Vite/React).
4. Trong **Environment Variables**, thêm các biến từ file `.env` (PI_APP_ID, PI_API_KEY…).
5. Click **Deploy**.

→ Sau khi deploy xong bạn sẽ có link live (ví dụ: `https://ghn-pi.vercel.app`).

---

## 2. Deploy Full App bằng Docker (Production)

### Chuẩn bị
```bash
cp .env.example .env
# Chỉnh sửa .env cho production:
# - SANDBOX_SDK=false
# - FRONTEND_URL=link-vercel-của-bạn
# - MONGODB_URI=connection-string-production
