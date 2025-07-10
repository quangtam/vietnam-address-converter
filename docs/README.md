# Vietnam Address Converter - Browser Demo

Đây là trang demo trực tuyến cho thư viện **Vietnam Address Converter**.

## 🚀 Truy cập Demo

Bạn có thể truy cập demo tại: [https://quangtam.github.io/vietnam-address-converter/](https://quangtam.github.io/vietnam-address-converter/)

## 📁 Cấu trúc thư mục

```
docs/
├── index.html          # Trang demo chính (sử dụng CDN)
├── .nojekyll          # GitHub Pages config
└── README.md          # File này
```

## 🛠️ Cách sử dụng

1. **Truy cập trực tiếp**: Mở `index.html` trong trình duyệt (hoạt động standalone với CDN)
2. **Qua web server**: Chỉ cần để host trang demo

### Chạy local server

```bash
# Python 3
python3 -m http.server 8000

# Node.js (nếu có npx)
npx serve .

# Hoặc bất kỳ web server nào khác
```

Sau đó truy cập: `http://localhost:8000/docs/`

## ✨ Tính năng

- **Giao diện thân thiện**: UI hiện đại, dễ sử dụng
- **Sử dụng CDN**: Load thư viện và data từ unpkg.com, không cần setup local
- **Ví dụ có sẵn**: Các địa chỉ mẫu để test nhanh
- **Kết quả chi tiết**: Hiển thị cả địa chỉ cũ và mới
- **Xử lý lỗi**: Thông báo rõ ràng khi có vấn đề
- **Responsive**: Hoạt động tốt trên mobile

## 🎯 Cách test

1. Click vào một trong các ví dụ địa chỉ
2. Hoặc nhập địa chỉ tùy ý vào ô input
3. Click "Chuyển đổi địa chỉ" hoặc nhấn Enter
4. Xem kết quả hiển thị bên dưới

## 📝 Ghi chú

- Demo này sử dụng CDN unpkg.com để load thư viện và dữ liệu
- Không cần setup local files - chỉ cần mở index.html
- Tự động load phiên bản mới nhất của thư viện
- Hoạt động offline sau khi load lần đầu (browser cache)
- Tương thích với mọi trình duyệt hiện đại

## 🔗 Liên kết

- [Thư viện trên NPM](https://www.npmjs.com/package/vietnam-address-converter)
- [GitHub Repository](https://github.com/quangtam/vietnam-address-converter)
- [Documentation](../README.md)
