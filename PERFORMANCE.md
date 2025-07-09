# 🚀 Performance Optimization Guide

## Hiện tại Performance

Thư viện Vietnam Address Converter hiện tại đạt được:

- **Tốc độ**: ~0.967ms per address  
- **Throughput**: ~1034 addresses/second  
- **Initialization**: ~20ms
- **Success rate**: 100%
- **Memory usage**: Tối ưu với data indexing

## 🔧 Các kỹ thuật optimization đã áp dụng

### 1. **Data Indexing & Preprocessing**
```typescript
// Normalized text caching
private normalizedProvinceNames = new Map<string, string>();

// Fast lookup tables
private provinceNameIndex = new Map<string, Province>();
private wardNameIndex = new Map<string, Ward[]>();
private mappingIndex = new Map<string, WardMapping[]>();
```

### 2. **String Normalization Caching**
- Cache normalized text để tránh re-normalize
- Sử dụng Map cho O(1) lookup
- Preprocessing tại thời điểm initialization

### 3. **Smart Search Strategy**
```typescript
// Hierarchical search: specificity first
if (wardName && districtName) {
  // Tìm exact match trước
}
if (districtName) {
  // Fallback to district level
}
// Final fallback: province only
```

### 4. **Memory-Efficient Data Structure**
- Sử dụng Map thay vì Array.find()
- Indexed search thay vì linear scan
- Lazy loading cho các operations phức tạp

## 📈 Performance Benchmarks

### Test Environment
- **Dataset**: 500 addresses (100x5 unique addresses)
- **Hardware**: MacBook (typical development environment)
- **Node.js**: v22.14.0

### Results
| Metric | Value |
|--------|-------|
| Initialization Time | 20ms |
| Average Conversion Time | 0.967ms |
| Throughput | 1034 addr/sec |
| Success Rate | 100% |
| Memory Usage | Optimized |

### Comparison with Potential Optimizations

| Optimization | Current | Potential Improvement |
|-------------|---------|---------------------|
| Basic linear search | - | Current baseline |
| Hash table lookup | ✅ | **1ms/addr** (current) |
| Trie-based search | 🚧 | ~0.5ms/addr |
| Bloom filters | 🚧 | ~0.3ms/addr |
| WebAssembly | 🚧 | ~0.1ms/addr |

## 🚀 Cách tăng tốc thêm

### 1. **Batch Processing**
```typescript
const results = converter.convertAddresses(addresses); // Faster than individual calls
```

### 2. **Precomputed Results Caching**
```typescript
// Cache commonly used addresses
const commonAddresses = [
  'Phường 1, Quận 1, TP HCM',
  'Phường 2, Quận 1, TP HCM',
  // ...
];

// Precompute và cache
await converter.precomputeAddresses(commonAddresses);
```

### 3. **Memory Management**
```typescript
// Clear cache khi cần thiết
converter.clearCache();

// Hoặc set cache limits
converter.setCacheLimit(1000); // Max 1000 cached results
```

### 4. **Specialized Data Loading**
```typescript
// Load only needed provinces
await converter.initializeWithProvinces(['TP HCM', 'Hà Nội']);

// Or specific mapping types
await converter.initializeWithMappingTypes(['merged', 'renamed']);
```

## 🛠️ Advanced Optimizations (Future)

### 1. **Trie-Based Search**
```typescript
class TrieNode {
  children: Map<string, TrieNode>;
  mappings: WardMapping[];
  isEnd: boolean;
}
```

### 2. **Bloom Filters**
```typescript
// Fast negative lookups
if (!bloomFilter.mightContain(normalizedAddress)) {
  return null; // Definitely not found
}
```

### 3. **WebAssembly Module**
```rust
// Rust/C++ implementation for critical paths
#[wasm_bindgen]
pub fn fast_string_similarity(a: &str, b: &str) -> f64 {
    // Ultra-fast implementation
}
```

### 4. **Worker Threads**
```typescript
// Parallel processing for large datasets
const workers = new WorkerPool(4);
const results = await workers.convertAddresses(largeDataset);
```

## 📊 Performance Monitoring

### Built-in Stats
```typescript
const stats = converter.getPerformanceStats();
console.log(stats);
/*
{
  totalConversions: 1000,
  cacheHits: 750,
  avgConversionTime: 1.046,
  cacheSize: 250,
  dataStats: { provinces: 63, wards: 11000, mappings: 50000 }
}
*/
```

### Custom Benchmarking
```typescript
async function benchmark() {
  const start = performance.now();
  const results = addresses.map(addr => converter.convertAddress(addr));
  const end = performance.now();
  
  console.log(`Processed ${addresses.length} addresses in ${end - start}ms`);
  console.log(`Average: ${(end - start) / addresses.length}ms per address`);
}
```

## 🎯 Performance Best Practices

### 1. **Initialize Once**
```typescript
// ✅ Good
const converter = new VietnamAddressConverter();
await converter.initialize();

// ❌ Bad: Initialize multiple times
for (const address of addresses) {
  const converter = new VietnamAddressConverter();
  await converter.initialize(); // Expensive!
}
```

### 2. **Batch Operations**
```typescript
// ✅ Good: Batch processing
const results = converter.convertAddresses(addresses);

// ❌ Bad: Individual calls in tight loop
const results = addresses.map(addr => converter.convertAddress(addr));
```

### 3. **Memory Management**
```typescript
// ✅ Good: Clear cache periodically
setInterval(() => {
  if (converter.getCacheSize() > 10000) {
    converter.clearCache();
  }
}, 60000);
```

### 4. **Input Preprocessing**
```typescript
// ✅ Good: Preprocess input
const cleanAddress = address.trim().toLowerCase();
const result = converter.convertAddress(cleanAddress);

// ❌ Bad: Let library handle dirty input
const result = converter.convertAddress("  PHường 1,   quận 1  ");
```

## 🔍 Performance Testing

### Test Script
```bash
# Run performance test
npm run test:performance

# Or manual test
node test-simple-performance.mjs
```

### Expected Output
```
🚀 Simple Performance Test
Test set size: 500 addresses
✅ Initialized in 27ms
📊 Results:
  Total time: 523ms
  Average per address: 1.046ms
  Success rate: 100%
  Throughput: 956 addresses/second
```

## 📝 Notes

- Performance có thể vary tùy thuộc vào hardware và Node.js version
- Kết quả test dựa trên sample data, real-world performance có thể khác
- Memory usage tăng theo số lượng cached results
- Đối với production, nên monitor và tune performance theo use case cụ thể

## 🚀 Getting Started

```bash
npm install vietnam-address-converter

# Test performance
npm test
```

```typescript
import { VietnamAddressConverter } from 'vietnam-address-converter';

const converter = new VietnamAddressConverter();
await converter.initialize();

const result = converter.convertAddress('Phường 1, Quận 1, TP HCM');
console.log(result);
```
