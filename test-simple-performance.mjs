import { VietnamAddressConverter } from './dist/index.esm.js';

async function simplePerformanceTest() {
  console.log('🚀 Simple Performance Test\n');
  
  const testAddresses = [
    'Phường 12, Quận Gò Vấp, Thành phố Hồ Chí Minh',
    'Xã Văn Luông, Huyện Tân Sơn, Tỉnh Phú Thọ',
    'Phường An Lạc, Quận Bình Tân, Thành phố Hồ Chí Minh',
    'Xã Phú Hồng, Huyện Ba Vì, Thành phố Hà Nội',
    '123 Nguyễn Văn Cừ, Phường 5, Quận Gò Vấp, Thành phố Hồ Chí Minh'
  ];
  
  // Create a larger test set
  const largeTestSet = [];
  for (let i = 0; i < 100; i++) {
    largeTestSet.push(...testAddresses);
  }
  
  console.log(`Test set size: ${largeTestSet.length} addresses\n`);
  
  const converter = new VietnamAddressConverter();
  
  console.log('⏳ Initializing converter...');
  const initStart = performance.now();
  await converter.initialize();
  const initEnd = performance.now();
  console.log(`✅ Initialized in ${Math.round(initEnd - initStart)}ms\n`);
  
  console.log('🔄 Converting addresses...');
  
  // Performance test
  const convertStart = performance.now();
  const results = largeTestSet.map(addr => converter.convertAddress(addr));
  const convertEnd = performance.now();
  
  const totalTime = convertEnd - convertStart;
  const avgTime = totalTime / largeTestSet.length;
  const successCount = results.filter(r => r.success).length;
  
  console.log('📊 Results:');
  console.log(`  Total time: ${Math.round(totalTime)}ms`);
  console.log(`  Average per address: ${Math.round(avgTime * 1000) / 1000}ms`);
  console.log(`  Success rate: ${Math.round(successCount / results.length * 100)}%`);
  console.log(`  Throughput: ${Math.round(largeTestSet.length / (totalTime / 1000))} addresses/second`);
  
  // Show sample results
  console.log('\n📋 Sample Results:');
  results.slice(0, 3).forEach((result, index) => {
    console.log(`  ${index + 1}. ${testAddresses[index % testAddresses.length]}`);
    if (result.success) {
      const converted = result.convertedAddress;
      console.log(`     → ${converted?.street ? converted.street + ', ' : ''}${converted?.ward}, ${converted?.province}`);
    } else {
      console.log(`     → Error: ${result.message}`);
    }
  });
  
  console.log('\n✅ Test completed!');
}

simplePerformanceTest().catch(console.error);
