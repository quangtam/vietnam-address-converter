# CHANGELOG

## [1.0.1] - 2025-07-10

### 🐛 Fixed
- Sửa lỗi ReferenceError trong demo GitHub Pages  
- Cải thiện expose functions ra global scope
- Thêm favicon.ico để tránh 404 error
- Tối ưu event handling trong demo

### ➕ Added
- File test functions để debug demo
- Hướng dẫn chi tiết trong DEMO_JS_FIX.md

### 📝 Documentation
- Cập nhật README.md với demo link rõ ràng hơn
- Thêm troubleshooting guide cho GitHub Pages

## [1.0.0] - 2025-07-09

### 🚨 BREAKING CHANGES

- **Loại bỏ cấp Quận/Huyện**: Theo Nghị quyết 202/2025/QH15, cấu trúc hành chính mới không còn cấp quận/huyện
- **ConversionResult.convertedAddress**: Không còn trường `district` trong kết quả chuyển đổi
- **NewAddress type**: Địa chỉ mới chỉ gồm `ward`, `province`, `street`

### ✨ Features

- **Dữ liệu mapping thực tế**: 10,039 mapping records từ cơ sở dữ liệu chính thức
- **Hoạt động offline**: Dữ liệu tích hợp sẵn, không cần fetch từ external sources
- **Fuzzy matching**: Tìm kiếm địa chỉ tương đồng thông minh
- **TypeScript support**: Full type definitions

### 📊 Data

- 34 tỉnh/thành phố
- 3,321 phường/xã 
- 10,039 mapping records

### 🔄 Migration từ phiên bản cũ

**Trước:**
```javascript
const result = converter.convertAddress(address);
console.log(result.convertedAddress);
// { ward: "Phường A", district: "Quận B", province: "Tỉnh C" }
```

**Sau:**
```javascript
const result = converter.convertAddress(address);
console.log(result.convertedAddress);
// { ward: "Phường A", province: "Tỉnh C" }  // Không còn district
```

### 📝 Examples

**Input (có Quận/Huyện):**
```
Phường 12, Quận Gò Vấp, Thành phố Hồ Chí Minh
```

**Output (loại bỏ Quận/Huyện):**
```
Phường An Hội Tây, Thành phố Hồ Chí Minh
```

---

Phiên bản này tuân thủ đầy đủ cấu trúc hành chính mới theo Nghị quyết 202/2025/QH15.
