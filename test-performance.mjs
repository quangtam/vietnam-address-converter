import { VietnamAddressConverter } from './dist/index.esm.js';

async function quickPerformanceTest() {
  console.log('🚀 Quick Performance Test\n');
  
  const testAddresses = [
    'Phường 12, Quận Gò Vấp, Thành phố Hồ Chí Minh',
    'Xã Văn Luông, Huyện Tân Sơn, Tỉnh Phú Thọ',
    'Phường An Lạc, Quận Bình Tân, Thành phố Hồ Chí Minh',
    'Xã Phú Hồng, Huyện Ba Vì, Thành phố Hà Nội',
    '123 Nguyễn Văn Cừ, Phường 5, Quận Gò Vấp, Thành phố Hồ Chí Minh'
  ];
  
  const converter = new VietnamAddressConverter();
  
  console.log('⏳ Initializing converter...');
  const initStart = performance.now();
  await converter.initialize();
  const initEnd = performance.now();
  console.log(`✅ Initialized in ${Math.round(initEnd - initStart)}ms\n`);
  
  console.log('🔄 Converting addresses...');
  
  // First run
  const firstStart = performance.now();
  const firstResults = testAddresses.map(addr => converter.convertAddress(addr));
  const firstEnd = performance.now();
  
  console.log('First run (no cache):');
  console.log(`  Time: ${Math.round(firstEnd - firstStart)}ms`);
  console.log(`  Success: ${firstResults.filter(r => r.success).length}/${firstResults.length}`);
  
  // Second run (with cache)
  const secondStart = performance.now();
  const secondResults = testAddresses.map(addr => converter.convertAddress(addr));
  const secondEnd = performance.now();
  
  console.log('\nSecond run (with cache):');
  console.log(`  Time: ${Math.round(secondEnd - secondStart)}ms`);
  console.log(`  Success: ${secondResults.filter(r => r.success).length}/${secondResults.length}`);
  
  // Performance stats
  const stats = converter.getPerformanceStats();
  console.log('\n📊 Performance Stats:');
  console.log(`  Total conversions: ${stats.totalConversions}`);
  console.log(`  Cache hits: ${stats.cacheHits}`);
  console.log(`  Cache hit rate: ${Math.round(stats.cacheHits / stats.totalConversions * 100)}%`);
  console.log(`  Average conversion time: ${Math.round(stats.avgConversionTime * 1000) / 1000}ms`);
  
  // Show sample results
  console.log('\n📋 Sample Results:');
  firstResults.slice(0, 2).forEach((result, index) => {
    console.log(`  ${index + 1}. ${testAddresses[index]}`);
    if (result.success) {
      const converted = result.convertedAddress;
      console.log(`     → ${converted?.street ? converted.street + ', ' : ''}${converted?.ward}, ${converted?.province}`);
    } else {
      console.log(`     → Error: ${result.message}`);
    }
  });
  
  console.log('\n✅ Test completed!');
}

quickPerformanceTest().catch(console.error);
