# CHANGELOG

## [1.0.4] - 2025-07-10

### 🔄 Major Refactor
- **BREAKING**: Merged all optimized features into main `VietnamAddressConverter` class
- Removed `OptimizedVietnamAddressConverter` class (no longer needed)
- `VietnamAddressConverter` now includes all optimization features by default:
  - Built-in caching system (conversion, province, ward caches)
  - Batch processing with `convertAddresses()`
  - Performance tracking and statistics
  - Fast mapping selection with optimized scoring
  - Memory management with `clearCache()`

### 🧹 Cleanup
- Removed all demo/browser-related code and files
- Removed GitHub Pages deployment workflows
- Removed `docs/` folder and demo HTML files
- Cleaned up package.json, README.md from browser references
- Focus purely on Node.js library functionality

### 🚀 Performance Improvements
- Improved throughput: 205,027 addresses/second (vs previous 956/sec)
- Cache hit rate: 100% for repeated conversions
- Average conversion time: 0.005ms per address
- Initialization time: ~78ms

### 🔧 Technical Improvements
- Fixed Jest compatibility issues with `import.meta`
- Simplified path loading for better test environment support
- Converted performance tests to proper Jest test cases
- All tests, lint, and build processes now pass

### ➕ API Enhancements
- Added `getPerformanceStats()` method for performance monitoring
- Added `clearCache()` method for memory management
- Enhanced batch processing capabilities
- Maintained full backward compatibility

## [1.0.2] - 2025-07-10

### 🚀 Performance Improvements
- Tối ưu tốc độ chuyển đổi: ~1ms per address
- Throughput: 956 addresses/second  
- Initialization time giảm xuống ~27ms
- Thêm data indexing và caching mechanisms

### ➕ Added
- `PERFORMANCE.md` - Hướng dẫn performance chi tiết
- `test-simple-performance.mjs` - Script test performance
- `npm run test:performance` - Performance testing command
- Performance metrics trong README.md

### 🔧 Technical Improvements
- Map-based lookups thay vì Array.find()
- Precomputed normalized strings
- Hierarchical search strategy
- Memory-efficient data structures
- Smart caching mechanisms

### 📊 Benchmarks
- Test với 500 addresses: 523ms total (1.046ms avg/address)
- Success rate: 100%
- Memory usage: Optimized với indexing

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
