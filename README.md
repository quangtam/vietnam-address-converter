# Vietnam Address Converter

Thư viện JavaScript/TypeScript để tự động chuyển đổi địa chỉ hành chính Việt Nam từ cũ sang mới theo Nghị quyết số 202/2025/QH15 của Quốc hội.

[![npm version](https://img.shields.io/npm/v/vietnam-address-converter.svg)](https://www.npmjs.com/package/vietnam-address-converter)
[![Build Status](https://github.com/quangtam/vietnam-address-converter/workflows/Build%20and%20Test/badge.svg)](https://github.com/quangtam/vietnam-address-converter/actions)
[![Deploy Status](https://github.com/quangtam/vietnam-address-converter/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/quangtam/vietnam-address-converter/actions)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue.svg)](https://www.typescriptlang.org/)

📦 **[NPM Package](https://www.npmjs.com/package/vietnam-address-converter)** | 📚 **[Quick Start](./QUICKSTART.md)** | 🌐 **[Live Demo]([https://diachi.info.vn](https://diachi.info.vn))** | 🟦 **[PHP Version](https://github.com/quangtam/vietnam-address-converter-php)**

## ✨ Tính năng chính

- 🔄 **Chuyển đổi địa chỉ tự động**: Chuyển đổi địa chỉ cũ sang địa chỉ mới theo quy định mới nhất
- 📊 **Dữ liệu mapping thực tế**: Sử dụng dữ liệu mapping chính thức từ cơ sở dữ liệu hành chính
- 🚀 **Hiệu suất cao**: ~1ms/địa chỉ, 956 địa chỉ/giây với data indexing tối ưu
- 🎯 **Cấu trúc hành chính mới**: Loại bỏ cấp quận/huyện theo Nghị quyết 202/2025/QH15
- 🔍 **Tìm kiếm thông minh**: Sử dụng fuzzy matching để tìm địa chỉ tương đồng
- 📱 **Đa nền tảng**: Hoạt động trên Node.js và trình duyệt
- ⚡ **Hoạt động offline**: Dữ liệu được tích hợp sẵn trong thư viện, không cần kết nối Internet

## 📈 Performance

| Metric | Value |
|--------|--------|
| **Tốc độ chuyển đổi** | ~0.967ms per address |
| **Throughput** | 1034 addresses/second |
| **Initialization** | ~20ms |
| **Success rate** | 100% |
| **Memory usage** | Optimized với caching |

👉 **[Xem chi tiết Performance Guide](./PERFORMANCE.md)**

##  Cài đặt

```bash
npm install vietnam-address-converter
```

## 🚀 Sử dụng cơ bản

### 1. Node.js Environment

```javascript
import { VietnamAddressConverter } from 'vietnam-address-converter';

// Khởi tạo converter
const converter = new VietnamAddressConverter();
await converter.initialize();

// Chuyển đổi địa chỉ từ string
const result = converter.convertAddress('Phường 12, Quận Gò Vấp, Thành phố Hồ Chí Minh');

if (result.success) {
  console.log('Địa chỉ cũ:', result.originalAddress);
  console.log('Địa chỉ mới:', result.convertedAddress);
  console.log('Loại chuyển đổi:', result.mappingInfo?.mappingType);
} else {
  console.log('Lỗi:', result.message);
}
```

### 2. Browser Environment

🌐 **[Try Live Demo]([https://diachi.info.vn](https://diachi.info.vn))** - Trải nghiệm trực tiếp trên trình duyệt

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/vietnam-address-converter@latest/dist/index.browser.js"></script>
</head>
<body>
  <script>
    async function convertAddress() {
      // Khởi tạo converter
      const converter = new VietnamAddressConverter.VietnamAddressConverter();
      
      // Load dữ liệu từ CDN
      await converter.initializeFromUrl('https://unpkg.com/vietnam-address-converter@latest/dist/data/address.json');
      
      // Chuyển đổi địa chỉ
      const result = converter.convertAddress('Phường 12, Quận Gò Vấp, Thành phố Hồ Chí Minh');
      console.log(result);
    }
    
    convertAddress();
  </script>
</body>
</html>
```

### 3. ES Modules trong Browser

```javascript
import { VietnamAddressConverter } from 'https://unpkg.com/vietnam-address-converter@latest/dist/index.esm.js';

const converter = new VietnamAddressConverter();
// Load data từ CDN
await converter.initializeFromUrl('https://unpkg.com/vietnam-address-converter@latest/dist/data/address.json');

const result = converter.convertAddress('Phường 12, Quận Gò Vấp, TP.HCM');
```

### 4. Chuyển đổi từ object

```javascript
// Địa chỉ cũ (có Quận/Huyện)
const addressObject = {
  ward: 'Phường 12',
  district: 'Quận Gò Vấp',  // Input có thể có district
  province: 'Thành phố Hồ Chí Minh',
  street: '123 Nguyễn Văn Cừ'
};

const result = converter.convertAddress(addressObject);

// Kết quả trả về (không có district theo cấu trúc mới)
// {
//   ward: 'Phường An Hội Tây',
//   province: 'Thành phố Hồ Chí Minh',
//   street: '123 Nguyễn Văn Cừ'
// }
```

## 📚 API Reference

### VietnamAddressConverter

#### Khởi tạo

**Node.js:**
```javascript
const converter = new VietnamAddressConverter();
await converter.initialize(); // Sử dụng dữ liệu mặc định

// Hoặc sử dụng file dữ liệu tùy chỉnh
await converter.initialize('/path/to/custom/data.json');
```

**Browser:**
```javascript
const converter = new VietnamAddressConverter();
await converter.initializeFromUrl(); // Sử dụng './data/address.json'

// Hoặc sử dụng URL tùy chỉnh
await converter.initializeFromUrl('/path/to/custom/data.json');
```

#### convertAddress(address)

Chuyển đổi địa chỉ từ định dạng cũ sang mới.

**Tham số:**
- `address`: `string | FullAddress` - Địa chỉ cần chuyển đổi

**Kết quả trả về:**

```typescript
interface ConversionResult {
  success: boolean;
  originalAddress: FullAddress;
  convertedAddress?: NewAddress;  // Không có district
  mappingInfo?: {
    oldWardCode?: string;
    newWardCode?: string;
    mappingType: 'exact' | 'merged' | 'renamed' | 'unchanged' | 'not_found';
  };
  message?: string;
}
```

#### Các phương thức khác

```javascript
// Lấy thống kê dữ liệu
const stats = converter.getDataStats();
// { provinces: 34, wards: 3321, mappings: 10039 }

// Lấy danh sách tỉnh/thành phố
const provinces = converter.getProvinces();

// Lấy danh sách phường/xã theo tỉnh
const wards = converter.getWardsByProvince('01'); // Mã tỉnh Hà Nội

// Tìm kiếm mapping theo từ khóa
const mappings = converter.searchMappings('Gò Vấp');
```

## 🔄 Các loại chuyển đổi

### 1. Merged (Gộp)
Nhiều phường/xã cũ được gộp thành một phường/xã mới:

```javascript
// Phường 12 và Phường 14 → Phường An Hội Tây
converter.convertAddress('Phường 12, Quận Gò Vấp, TP.HCM');
// mappingType: 'merged'
```

### 2. Renamed (Đổi tên)
Phường/xã giữ nguyên ranh giới nhưng đổi tên:

```javascript
// Phường Ninh Giang → Phường Hòa Thắng
converter.convertAddress('Phường Ninh Giang, Thị xã Ninh Hòa, Khánh Hòa');
// mappingType: 'renamed'
```

### 3. Unchanged (Không đổi)
Phường/xã không có thay đổi:

```javascript
converter.convertAddress('Phường An Lạc, Quận Bình Tân, TP.HCM');
// mappingType: 'unchanged'
```

## 📊 Dữ liệu

Thư viện bao gồm:
- **34 tỉnh/thành phố** theo cấu trúc hành chính mới
- **3,321 phường/xã** đã được cập nhật
- **10,039 mapping records** cho việc chuyển đổi

Dữ liệu được cập nhật theo Nghị quyết số 202/2025/QH15 của Quốc hội về việc sắp xếp đơn vị hành chính.

## ⚠️ Thay đổi quan trọng

### Loại bỏ cấp Quận/Huyện

Theo Nghị quyết 202/2025/QH15, cấu trúc hành chính mới **không còn cấp quận/huyện**:

**Trước (3 cấp):**
```
Tỉnh/Thành phố → Quận/Huyện → Phường/Xã
```

**Sau (2 cấp):**
```
Tỉnh/Thành phố → Phường/Xã
```

**Ví dụ chuyển đổi:**

Input:
```
Phường 12, Quận Gò Vấp, Thành phố Hồ Chí Minh
```

Output:
```
Phường An Hội Tây, Thành phố Hồ Chí Minh  // Không còn "Quận Gò Vấp"
```

## 💻 Ví dụ hoàn chỉnh

```javascript
import { VietnamAddressConverter } from 'vietnam-address-converter';

async function demo() {
  const converter = new VietnamAddressConverter();
  await converter.initialize();
  
  const testAddresses = [
    'Phường 12, Quận Gò Vấp, TP.HCM',
    'Phường Ninh Giang, Thị xã Ninh Hòa, Khánh Hòa',
    'Xóm Lũng, Xã Văn Luông, Huyện Tân Sơn, Phú Thọ'
  ];
  
  for (const address of testAddresses) {
    const result = converter.convertAddress(address);
    
    if (result.success) {
      console.log(`Input:  ${address}`);
      console.log(`Output: ${result.convertedAddress?.ward}, ${result.convertedAddress?.province}`);
      console.log(`Type:   ${result.mappingInfo?.mappingType}\n`);
    } else {
      console.log(`Error:  ${result.message}\n`);
    }
  }
}

demo();
```

## 🛠️ Phát triển

### Build từ source

```bash
git clone https://github.com/quangtam/vietnam-address-converter
cd vietnam-address-converter
npm install
npm run build
```

### Chạy test

```bash
npm test
```

### Ví dụ demo

```bash
node examples/demo.ts
```

## 🔗 Links & Resources

### 📋 Documentation
- 📚 **[Quick Start Guide](./QUICKSTART.md)** - Hướng dẫn nhanh bắt đầu
- 📖 **[Full Documentation](./README.md)** - Tài liệu đầy đủ
- 📝 **[Changelog](./CHANGELOG.md)** - Lịch sử thay đổi

### 🌐 Online Resources  
- 📦 **[NPM Package](https://www.npmjs.com/package/vietnam-address-converter)** - Tải về và cài đặt
- 💻 **[GitHub Repository](https://github.com/quangtam/vietnam-address-converter)** - Source code và issues
- 🏛️ **[Nghị quyết 202/2025/QH15](https://chinhphu.vn)** - Văn bản pháp lý gốc

### 🛠️ Development
- 🔧 **[TypeScript Definitions](./dist/index.d.ts)** - Type definitions
- 🧪 **[Examples](./examples/)** - Code examples
- 🏃‍♂️ **[Demo Script](./test-library.mjs)** - Local testing script

## 🌍 Other Language Implementations

Vietnam Address Converter hiện có sẵn cho nhiều ngôn ngữ lập trình:

- 🟨 **JavaScript/TypeScript**: [vietnam-address-converter](https://github.com/quangtam/vietnam-address-converter) (repo này)
- 🟦 **PHP**: [vietnam-address-converter-php](https://github.com/quangtam/vietnam-address-converter-php) - Thư viện PHP với API tương tự
- 🔴 **Python**: Coming soon...
- 🟩 **Go**: Coming soon...

> 💡 Tất cả implementations đều sử dụng cùng dữ liệu mapping và logic chuyển đổi để đảm bảo tính nhất quán.

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng:

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Mở Pull Request

## 📄 License

[MIT License](LICENSE)

## 📞 Liên hệ

- Issues: [GitHub Issues](https://github.com/quangtam/vietnam-address-converter/issues)
- Email: quangtamvu@gmail.com

## 🙏 Cảm ơn

- Dữ liệu từ [thanhtrungit97/dvhcvn](https://github.com/thanhtrungit97/dvhcvn)
- Nghị quyết số 202/2025/QH15 của Quốc hội

---

Made with ❤️ for Vietnam developers
