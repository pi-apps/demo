# 📋 GHN.PI - Application Flows

Các luồng chức năng chính của ứng dụng **GHN.PI - Giao Hàng Nhanh**.

---

## 1. Luồng Xác thực người dùng (Authentication)

1. User mở app → Click **"Đăng nhập bằng Pi"**
2. Pi Browser hiện popup xác thực
3. Nhận `accessToken` và `user` từ Pi SDK
4. Backend verify token → Tạo session / JWT
5. User vào được trang chính

---

## 2. Luồng Đặt đơn hàng (Create Order)

1. User chọn sản phẩm / nhập địa chỉ
2. Chọn phương thức vận chuyển
3. Tính phí ship + tổng tiền
4. User click **"Đặt đơn"**
5. Hiển thị form thanh toán Pi
6. User xác nhận thanh toán → Gửi Pi Payment

---

## 3. Luồng Thanh toán Pi (Payment Flow)

1. Frontend gọi Pi SDK `Payment.create()`
2. User xác nhận chuyển Pi trong Pi Browser
3. Backend nhận webhook/callback từ Pi
4. Cập nhật trạng thái đơn hàng = "Đã thanh toán"
5. Thông báo cho shipper

---

## 4. Luồng Shipper (Nhận và Giao hàng)

1. Shipper đăng nhập bằng Pi
2. Xem danh sách đơn hàng gần nhất
3. Nhận đơn (Accept Order)
4. Cập nhật trạng thái: Đang lấy hàng → Đang giao → Hoàn thành
5. User theo dõi realtime (nếu có socket)

---

## 5. Luồng Quản trị (Admin - Tương lai)

- Quản lý đơn hàng
- Quản lý shipper
- Thống kê doanh thu Pi
- Xử lý khiếu nại

---

## Trạng thái đơn hàng

- `pending` → Chờ thanh toán
- `paid` → Đã thanh toán
- `accepted` → Shipper đã nhận
- `shipping` → Đang giao
- `completed` → Hoàn thành
- `cancelled` → Đã hủy

---

**File này sẽ được cập nhật khi có thêm tính năng mới.**

**Made with ❤️ by @tranduyhung1987**
