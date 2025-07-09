import { VietnamAddressConverter } from './dist/index.esm.js';

async function testLibrary() {
  console.log('🚀 Testing Vietnam Address Converter Library\n');

  try {
    // Khởi tạo converter
    const converter = new VietnamAddressConverter();
    await converter.initialize();
    
    // Lấy thống kê dữ liệu
    const stats = converter.getDataStats();
    console.log('📊 Data Statistics:');
    console.log(`- Provinces: ${stats.provinces}`);
    console.log(`- Wards: ${stats.wards}`);
    console.log(`- Mappings: ${stats.mappings}\n`);
    
    // Test conversion
    console.log('🔄 Testing Address Conversion:\n');
    
    const testCases = [
      'Xóm Lũng, Xã Văn Luông, Huyện Tân Sơn, Tỉnh Phú Thọ',
      'Phú Hồng, Huyện Ba Vì, Thành phố Hà Nội',
      'Phường An Lạc, Quận Bình Tân, Thành phố Hồ Chí Minh',
      'Số 20 Ngõ 192 Lê Trọng Tấn, Phường Khương Mai, Quận Thanh Xuân, Thành phố Hà Nội'
    ];
    
    for (let i = 0; i < testCases.length; i++) {
      const address = testCases[i];
      console.log(`${i + 1}. Input: ${address}`);
      
      const result = converter.convertAddress(address);
      if (result.success && result.convertedAddress) {
        const converted = [
          result.convertedAddress.street,
          result.convertedAddress.ward,
          // Loại bỏ district - không còn trong cấu trúc hành chính mới
          result.convertedAddress.province
        ].filter(Boolean).join(', ');
        
        console.log(`   Output: ${converted}`);
        console.log(`   Type: ${result.mappingInfo?.mappingType || 'unknown'}`);
      } else {
        console.log(`   Error: ${result.message}`);
      }
      console.log('');
    }
    
    console.log('✅ Library test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testLibrary();
