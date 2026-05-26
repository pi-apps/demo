# 🛠 Development Guide - GHN.PI

Hướng dẫn cài đặt và chạy dự án **GHN.PI** ở chế độ phát triển (local).

---

## 📋 Yêu cầu hệ thống

- Node.js 18.x hoặc 20.x
- Docker & Docker Compose (khuyến nghị)
- Git
- Pi Browser (để test Pi SDK)
- MongoDB (nếu không dùng Docker)

---

## 🚀 Cài đặt nhanh bằng Docker (Khuyến nghị)

```bash
git clone https://github.com/tranduyhung1987/GHN.PI.git
cd GHN.PI
cp .env.example .env
docker-compose up --build
