import { VietnamAddressConverter } from '../src/index.js';

async function main() {
  // Khởi tạo converter
  const converter = new VietnamAddressConverter();
  await converter.initialize();
  
  console.log('=== VIETNAM ADDRESS CONVERTER ===\n');
  
  // Lấy thống kê dữ liệu
  const stats = converter.getDataStats();
  console.log('📊 Thống kê dữ liệu:');
  console.log(`- Số tỉnh/thành phố: ${stats.provinces}`);
  console.log(`- Số phường/xã: ${stats.wards}`);
  console.log(`- Số mapping: ${stats.mappings}\n`);
  
  // Test cases
  const testAddresses = [
    // Case 1: Phường bị gộp (merge)
    'Xã Văn Luông, Huyện Tân Sơn, Tỉnh Phú Thọ',
    'Xã Minh Đài, Huyện Tân Sơn, Tỉnh Phú Thọ',
    
    // Case 2: Phường đổi tên (rename)
    'Xã Phú Hồng, Huyện Ba Vì, Thành phố Hà Nội',
    
    // Case 3: Phường không thay đổi
    'Phường An Lạc, Quận Bình Tân, Thành phố Hồ Chí Minh',
    
    // Case 4: Địa chỉ có đường
    '123 Nguyễn Văn Cừ, Phường 5, Quận Gò Vấp, Thành phố Hồ Chí Minh',

    // Case 5: Địa chỉ được thay đổi 2 lần từ tháng 12/2024 đến 01/07/2025
    'Thôn Vân Sa, Xã Tản Hồng, Huyện Ba Vì, Thành phố Hà Nội',
  ];
  
  console.log('🔄 Kết quả chuyển đổi địa chỉ:\n');
  
  for (let i = 0; i < testAddresses.length; i++) {
    const address = testAddresses[i];
    console.log(`${i + 1}. Địa chỉ cũ: ${address}`);
    
    try {
      const result = converter.convertAddress(address);
      
      if (result.success && result.convertedAddress) {
        const newAddress = [
          result.convertedAddress.street,
          result.convertedAddress.ward,
          // Không còn district trong cấu trúc hành chính mới
          result.convertedAddress.province
        ].filter(Boolean).join(', ');
        
        console.log(`   Địa chỉ mới: ${newAddress}`);
        console.log(`   Loại chuyển đổi: ${result.mappingInfo?.mappingType || 'N/A'}`);
        console.log(`   Thông điệp: ${result.message || 'N/A'}`);
        
        if (result.mappingInfo?.oldWardCode && result.mappingInfo?.newWardCode) {
          console.log(`   Mã cũ: ${result.mappingInfo.oldWardCode} → Mã mới: ${result.mappingInfo.newWardCode}`);
        }
      } else {
        console.log(`   ❌ Lỗi: ${result.message}`);
      }
    } catch (error) {
      console.log(`   ❌ Exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    console.log('');
  }
  
  // Demo tìm kiếm mapping
  console.log('🔍 Tìm kiếm mapping theo từ khóa "Gò Vấp":\n');
  const mappings = converter.searchMappings('Gò Vấp');
  
  mappings.slice(0, 5).forEach((mapping, index) => {
    console.log(`${index + 1}. ${mapping.old_ward_name} (${mapping.old_district_name}) → ${mapping.new_ward_name}`);
  });
  
  if (mappings.length > 5) {
    console.log(`... và ${mappings.length - 5} kết quả khác`);
  }
  
  console.log('');
  
  // Demo lấy danh sách phường/xã theo tỉnh
  console.log('📍 Danh sách một số phường/xã tại Hà Nội:\n');
  const hanoiProvince = converter.getProvinces().find(p => p.name.includes('Hà Nội'));
  if (hanoiProvince) {
    const hanoiWards = converter.getWardsByProvince(hanoiProvince.province_code);
    hanoiWards.slice(0, 10).forEach((ward, index) => {
      console.log(`${index + 1}. ${ward.name} (Mã: ${ward.ward_code})`);
    });
    
    if (hanoiWards.length > 10) {
      console.log(`... và ${hanoiWards.length - 10} phường/xã khác`);
    }
  }
  
  console.log('\n✅ Demo hoàn thành!');
}

main().catch(console.error);
