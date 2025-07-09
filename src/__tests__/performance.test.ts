import { VietnamAddressConverter } from '../AddressConverter';
import { OptimizedVietnamAddressConverter } from '../OptimizedAddressConverter';

/**
 * Performance comparison test
 */
async function performanceTest() {
  console.log('🚀 Starting Performance Comparison Test\n');
  
  // Test data
  const testAddresses = [
    'Phường 12, Quận Gò Vấp, Thành phố Hồ Chí Minh',
    'Xã Văn Luông, Huyện Tân Sơn, Tỉnh Phú Thọ',
    'Phường An Lạc, Quận Bình Tân, Thành phố Hồ Chí Minh',
    'Xã Phú Hồng, Huyện Ba Vì, Thành phố Hà Nội',
    '123 Nguyễn Văn Cừ, Phường 5, Quận Gò Vấp, Thành phố Hồ Chí Minh',
    'Phường Tân Định, Quận 1, Thành phố Hồ Chí Minh',
    'Xã Tân Phú, Huyện Đông Hòa, Tỉnh Phú Yên',
    'Phường Nguyễn Du, Quận Hai Bà Trưng, Thành phố Hà Nội',
    'Xã Hòa Bình, Huyện Bắc Ái, Tỉnh Ninh Thuận',
    'Phường 6, Quận 3, Thành phố Hồ Chí Minh'
  ];
  
  // Tạo danh sách test lớn hơn bằng cách duplicate
  const largeTestSet: string[] = [];
  for (let i = 0; i < 100; i++) {
    largeTestSet.push(...testAddresses);
  }
  
  console.log(`Test set size: ${largeTestSet.length} addresses\n`);
  
  // Test original converter
  console.log('📊 Testing Original Converter...');
  const originalConverter = new VietnamAddressConverter();
  
  let startTime = performance.now();
  await originalConverter.initialize();
  let endTime = performance.now();
  console.log(`  Initialization: ${Math.round(endTime - startTime)}ms`);
  
  startTime = performance.now();
  const originalResults = largeTestSet.map(addr => originalConverter.convertAddress(addr));
  endTime = performance.now();
  const originalTime = endTime - startTime;
  console.log(`  Conversion time: ${Math.round(originalTime)}ms`);
  console.log(`  Average per address: ${Math.round(originalTime / largeTestSet.length * 1000) / 1000}ms`);
  
  const originalSuccessCount = originalResults.filter(r => r.success).length;
  console.log(`  Success rate: ${Math.round(originalSuccessCount / originalResults.length * 100)}%`);
  
  // Test optimized converter
  console.log('\n🔥 Testing Optimized Converter...');
  const optimizedConverter = new OptimizedVietnamAddressConverter();
  
  startTime = performance.now();
  await optimizedConverter.initialize();
  endTime = performance.now();
  console.log(`  Initialization: ${Math.round(endTime - startTime)}ms`);
  
  startTime = performance.now();
  const optimizedResults = largeTestSet.map(addr => optimizedConverter.convertAddress(addr));
  endTime = performance.now();
  const optimizedTime = endTime - startTime;
  console.log(`  Conversion time: ${Math.round(optimizedTime)}ms`);
  console.log(`  Average per address: ${Math.round(optimizedTime / largeTestSet.length * 1000) / 1000}ms`);
  
  const optimizedSuccessCount = optimizedResults.filter(r => r.success).length;
  console.log(`  Success rate: ${Math.round(optimizedSuccessCount / optimizedResults.length * 100)}%`);
  
  // Performance stats
  const perfStats = optimizedConverter.getPerformanceStats();
  console.log(`  Cache hit rate: ${Math.round(perfStats.cacheHits / perfStats.totalConversions * 100)}%`);
  
  // Test batch conversion
  console.log('\n⚡ Testing Batch Conversion...');
  startTime = performance.now();
  const batchResults = optimizedConverter.convertAddresses(testAddresses);
  endTime = performance.now();
  console.log(`  Batch time: ${Math.round(endTime - startTime)}ms`);
  
  // Performance comparison
  console.log('\n📈 Performance Comparison:');
  const speedup = originalTime / optimizedTime;
  console.log(`  Speed improvement: ${Math.round(speedup * 100) / 100}x faster`);
  console.log(`  Time saved: ${Math.round(originalTime - optimizedTime)}ms (${Math.round((originalTime - optimizedTime) / originalTime * 100)}%)`);
  
  // Memory usage comparison (rough estimate)
  console.log('\n💾 Memory Usage:');
  console.log(`  Optimized cache size: ${perfStats.cacheSize} conversions cached`);
  console.log(`  Province cache: ${perfStats.provinceCacheSize} entries`);
  console.log(`  Ward cache: ${perfStats.wardCacheSize} entries`);
  
  // Clear cache and test again
  console.log('\n🧹 Testing Cache Clear...');
  optimizedConverter.clearCache();
  
  startTime = performance.now();
  const afterClearResults = testAddresses.map(addr => optimizedConverter.convertAddress(addr));
  endTime = performance.now();
  console.log(`  Conversion after cache clear: ${Math.round(endTime - startTime)}ms`);
  
  console.log('\n✅ Performance test completed!');
}

// Run test
performanceTest().catch(console.error);
