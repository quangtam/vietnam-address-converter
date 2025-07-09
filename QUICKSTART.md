# Quick Start Guide - Vietnam Address Converter

Hướng dẫn nhanh sử dụng thư viện chuyển đổi địa chỉ hành chính Việt Nam theo Nghị quyết 202/2025/QH15.

🌐 **[Demo Online](https://quangtam.github.io/vietnam-address-converter)** - Thử nghiệm ngay trên trình duyệt!

## 🚀 Cài đặt

```bash
npm install vietnam-address-converter
```

## 💡 Sử dụng cơ bản

### 1. Import và khởi tạo

```javascript
import { VietnamAddressConverter } from 'vietnam-address-converter';

// Khởi tạo và load dữ liệu
const converter = new VietnamAddressConverter();
await converter.initialize();
```

### 2. Chuyển đổi địa chỉ từ string

```javascript
// Địa chỉ cũ (trước 2025) - có Quận/Huyện
const oldAddress = 'Xã Văn Luông, Huyện Tân Sơn, Tỉnh Phú Thọ';

const result = converter.convertAddress(oldAddress);

if (result.success) {
  console.log('Địa chỉ mới:', result.convertedAddress);
  // Output: { 
  //   ward: 'Xã Minh Đài', 
  //   province: 'Tỉnh Phú Thọ'
  // }
  // ⚠️ Lưu ý: Không còn trường 'district' trong cấu trúc mới
} else {
  console.log('Lỗi:', result.error);
}
```

### 3. Chuyển đổi từ object

```javascript
const addressObject = {
  ward: 'Phường An Lạc',
  district: 'Quận Bình Tân',     // Input có thể có district
  province: 'Thành phố Hồ Chí Minh',
  street: '123 Đường Lê Văn Quới'
};

const result = converter.convertAddress(addressObject);

if (result.success) {
  console.log('Địa chỉ mới:', result.convertedAddress);
  // Output:
  // {
  //   ward: 'Phường An Lạc',
  //   province: 'Thành phố Hồ Chí Minh',  // Không còn district
  //   street: '123 Đường Lê Văn Quới'
  // }
}
```

### 4. Chuyển đổi với đường/số nhà

```javascript
// Địa chỉ có số nhà và đường
const fullAddress = '123 Nguyễn Văn Cừ, Phường 5, Quận Gò Vấp, Thành phố Hồ Chí Minh';

const result = converter.convertAddress(fullAddress);
// Kết quả giữ lại thông tin đường và số nhà
```

## 🔍 Kiểm tra trạng thái

### Lấy thống kê dữ liệu

```javascript
const stats = converter.getDataStats();
console.log('Thống kê:', stats);
// Output: { provinces: 63, wards: 10599, mappings: 1234 }
```

### Kiểm tra địa chỉ có thay đổi không

```javascript
const result = converter.convertAddress('Phường An Lạc, Quận Bình Tân, Thành phố Hồ Chí Minh');

if (result.hasChanges) {
  console.log('Địa chỉ đã được chuyển đổi');
} else {
  console.log('Địa chỉ không có thay đổi (giữ nguyên)');
}
```

## 🎯 Tính năng nâng cao

### Tìm kiếm mờ (Fuzzy Search)

```javascript
// Tìm kiếm với lỗi chính tả
const result1 = converter.convertAddress('Xuã Văn Luông'); // 'Xuã' thay vì 'Xã'
const result2 = converter.convertAddress('TP HCM');        // Viết tắt
const result3 = converter.convertAddress('Q Gò Vấp');     // Viết tắt quận
```

### Hỗ trợ loại bỏ dấu

```javascript
// Không cần dấu tiếng Việt
const result = converter.convertAddress('Xa Van Luong, Huyen Tan Son, Tinh Phu Tho');
```

## 🚨 Lưu ý quan trọng

### Breaking Changes v1.0.0

- **Loại bỏ trường `district`**: Theo Nghị quyết 202/2025/QH15, cấp quận/huyện bị xóa bỏ
- **Output mới**: Chỉ còn `ward`, `province`, và `street` (nếu có)
- **Input vẫn hỗ trợ**: Có thể có trường `district` trong input để tăng độ chính xác

### Các trường hợp chuyển đổi

1. **Gộp (Merge)**: Nhiều phường/xã cũ → 1 phường/xã mới
2. **Đổi tên (Rename)**: Phường/xã giữ nguyên ranh giới nhưng đổi tên
3. **Không thay đổi**: Phường/xã giữ nguyên (chỉ loại bỏ district)

## 🛠️ Development & Testing

### Chạy build

```bash
npm run build
```

### Chạy test

```bash
# Chạy utils tests (đang hoạt động)
npm test -- --testPathPattern=utils

# Chạy tất cả tests (có thể gặp lỗi import.meta với Jest)
npm test
```

> **Lưu ý**: Hiện tại có vấn đề nhỏ với Jest và `import.meta` trong test environment. Thư viện hoạt động hoàn hảo trong production (npm run demo), chỉ có issue với test runner.

### Chạy demo

```bash
# Chạy demo nhanh (build + test)
npm run demo

# Hoặc chạy TypeScript demo (cần ts-node)
npm run demo:ts

# Hoặc chạy thủ công
npm run build
node test-library.mjs
```

## 📝 Ví dụ thực tế

```javascript
// Ví dụ đầy đủ
import { VietnamAddressConverter } from 'vietnam-address-converter';

async function convertAddresses() {
  const converter = new VietnamAddressConverter();
  await converter.initialize();
  
  const addresses = [
    'Xã Văn Luông, Huyện Tân Sơn, Tỉnh Phú Thọ',
    'Phường 5, Quận Gò Vấp, TP HCM',
    '123 Lê Lợi, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh'
  ];
  
  for (const address of addresses) {
    const result = converter.convertAddress(address);
    
    console.log(`Địa chỉ cũ: ${address}`);
    if (result.success) {
      console.log(`Địa chỉ mới: ${JSON.stringify(result.convertedAddress)}`);
      console.log(`Có thay đổi: ${result.hasChanges ? 'Có' : 'Không'}`);
    } else {
      console.log(`Lỗi: ${result.error}`);
    }
    console.log('---');
  }
}

convertAddresses();
```

## 🎯 Use Cases & Examples

### Case 1: Web Form Validation

```javascript
// Kiểm tra và chuyển đổi địa chỉ từ form
async function validateAndConvertAddress(userInput) {
  const converter = new VietnamAddressConverter();
  await converter.initialize();
  
  const result = converter.convertAddress(userInput);
  
  if (!result.success) {
    return { valid: false, error: result.error };
  }
  
  return {
    valid: true,
    oldAddress: userInput,
    newAddress: result.convertedAddress,
    hasChanges: result.hasChanges
  };
}
```

### Case 2: Database Migration

```javascript
// Chuyển đổi hàng loạt địa chỉ từ database
async function migrateAddresses(addresses) {
  const converter = new VietnamAddressConverter();
  await converter.initialize();
  
  const results = [];
  
  for (const addr of addresses) {
    const result = converter.convertAddress(addr);
    results.push({
      original: addr,
      converted: result.success ? result.convertedAddress : null,
      success: result.success,
      hasChanges: result.hasChanges,
      error: result.error
    });
  }
  
  return results;
}
```

### Case 3: Address Standardization

```javascript
// Chuẩn hóa địa chỉ cho hệ thống
function standardizeAddress(input) {
  const result = converter.convertAddress(input);
  
  if (result.success) {
    // Tạo địa chỉ đầy đủ theo format mới
    const { ward, province, street } = result.convertedAddress;
    const fullAddress = [street, ward, province]
      .filter(Boolean)
      .join(', ');
    
    return {
      standardized: fullAddress,
      components: result.convertedAddress,
      isModernFormat: !result.hasChanges
    };
  }
  
  return { error: result.error };
}
```

## 🔗 Tài liệu chi tiết

- [README.md](./README.md) - Tài liệu đầy đủ
- [CHANGELOG.md](./CHANGELOG.md) - Lịch sử thay đổi
- [examples/demo.ts](./examples/demo.ts) - Ví dụ TypeScript chi tiết
