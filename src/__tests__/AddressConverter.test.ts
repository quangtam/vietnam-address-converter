import { VietnamAddressConverter } from '../index';
import { FullAddress } from '../types';
import { join } from 'path';

describe('VietnamAddressConverter', () => {
  let converter: VietnamAddressConverter;

  beforeAll(async () => {
    converter = new VietnamAddressConverter();
    // Provide explicit path for test environment
    const dataPath = join(process.cwd(), 'src', 'data', 'address.json');
    await converter.initialize(dataPath);
  });

  test('should initialize successfully', () => {
    const stats = converter.getDataStats();
    expect(stats.provinces).toBeGreaterThan(0);
    expect(stats.wards).toBeGreaterThan(0);
    expect(stats.mappings).toBeGreaterThan(0);
  });

  test('should convert address from string', () => {
    const result = converter.convertAddress('Xóm Lũng, Xã Văn Luông, Huyện Tân Sơn, Tỉnh Phú Thọ');
    expect(result.success).toBe(true);
    if (result.convertedAddress) {
      expect(result.convertedAddress.province).toBeDefined();
      // District không còn trong địa chỉ mới
      expect(result.convertedAddress).not.toHaveProperty('district');
    }
  });

  test('should convert address from object', () => {
    const address: FullAddress = {
      ward: 'Xã Văn Luông',
      district: 'Huyện Tân Sơn', // Input có thể có district
      province: 'Tỉnh Phú Thọ',
      street: 'Xóm Lũng'
    };
    
    const result = converter.convertAddress(address);
    expect(result.success).toBe(true);
    expect(result.originalAddress).toEqual(address);
    
    // Converted address không có district
    if (result.convertedAddress) {
      expect(result.convertedAddress).not.toHaveProperty('district');
      expect(result.convertedAddress.province).toBeDefined();
    }
  });

  test('should handle merged wards', () => {
    // Test case cho phường bị gộp
    const address: FullAddress = {
      ward: 'Phường 14',
      district: 'Quận Gò Vấp',
      province: 'Thành phố Hồ Chí Minh'
    };
    
    const result = converter.convertAddress(address);
    expect(result.success).toBe(true);
    if (result.mappingInfo) {
      expect(['merged', 'exact', 'renamed']).toContain(result.mappingInfo.mappingType);
    }
  });

  test('should handle renamed wards', () => {
    // Test case cho phường đổi tên
    const address: FullAddress = {
      ward: 'Phường Ninh Giang',
      district: 'Thị xã Ninh Hòa',
      province: 'Tỉnh Khánh Hòa'
    };
    
    const result = converter.convertAddress(address);
    expect(result.success).toBe(true);
    if (result.mappingInfo && result.convertedAddress) {
      expect(result.convertedAddress.ward).toBe('Phường Hòa Thắng');
    }
  });

  test('should return error for invalid address', () => {
    const result = converter.convertAddress('');
    expect(result.success).toBe(false);
    expect(result.message).toContain('tỉnh');
  });

  test('should return error for address without province', () => {
    const address = {
      ward: 'Phường 1',
      district: 'Quận 1'
    } as FullAddress;
    
    const result = converter.convertAddress(address);
    expect(result.success).toBe(false);
  });

  test('should get provinces list', () => {
    const provinces = converter.getProvinces();
    expect(provinces.length).toBeGreaterThan(0);
    expect(provinces[0]).toHaveProperty('name');
    expect(provinces[0]).toHaveProperty('province_code');
  });

  test('should get wards by province', () => {
    const provinces = converter.getProvinces();
    const firstProvince = provinces[0];
    const wards = converter.getWardsByProvince(firstProvince.province_code);
    expect(Array.isArray(wards)).toBe(true);
  });

  test('should search mappings', () => {
    const mappings = converter.searchMappings('Gò Vấp');
    expect(Array.isArray(mappings)).toBe(true);
    if (mappings.length > 0) {
      expect(mappings[0]).toHaveProperty('old_ward_name');
      expect(mappings[0]).toHaveProperty('new_ward_name');
    }
  });
});
