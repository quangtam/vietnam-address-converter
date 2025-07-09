import { DataLoader } from './DataLoader';
import { FullAddress, ValidAddress, NewAddress, ConversionResult, WardMapping, Province, Ward } from './types';
import { 
  normalizeText, 
  calculateSimilarity, 
  findBestMatch, 
  removeAdministrativeTypes,
  parseAddress,
  fuzzyContains
} from './utils';

/**
 * Class chính để chuyển đổi địa chỉ hành chính Việt Nam từ cũ sang mới
 */
export class VietnamAddressConverter {
  private dataLoader: DataLoader;
  private isInitialized = false;

  constructor() {
    this.dataLoader = new DataLoader();
  }

  /**
   * Khởi tạo với dữ liệu mặc định
   */
  async initialize(dataFilePath?: string): Promise<void> {
    try {
      await this.dataLoader.loadFromFile(dataFilePath);
      this.isInitialized = true;
    } catch (error) {
      throw new Error(`Không thể khởi tạo converter: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Chuyển đổi địa chỉ từ cũ sang mới
   */
  convertAddress(address: string | FullAddress): ConversionResult {
    if (!this.isInitialized) {
      throw new Error('Converter chưa được khởi tạo. Hãy gọi initialize() trước.');
    }

    const fullAddress = typeof address === 'string' ? parseAddress(address) : address;
    
    if (!fullAddress.province) {
      return {
        success: false,
        originalAddress: fullAddress,
        message: 'Địa chỉ phải có ít nhất tên tỉnh/thành phố'
      };
    }

    // Cast thành ValidAddress sau khi đã validate
    const validAddress: ValidAddress = fullAddress as ValidAddress;

    // Tìm mapping dựa trên thông tin địa chỉ
    const mappings = this.dataLoader.findMappingByOldAddress(
      validAddress.ward,
      validAddress.district,
      validAddress.province
    );

    if (mappings.length === 0) {
      // Không tìm thấy mapping, kiểm tra xem địa chỉ có tồn tại trong dữ liệu mới không
      const newProvinceMatch = this.findNewProvince(validAddress.province);
      if (newProvinceMatch) {
        const newWardMatch = this.findNewWard(validAddress.ward, newProvinceMatch.province_code);
        
        return {
          success: true,
          originalAddress: fullAddress,
          convertedAddress: {
            ward: newWardMatch?.name || validAddress.ward,
            // Loại bỏ district theo cấu trúc hành chính mới
            province: newProvinceMatch.name,
            street: validAddress.street
          },
          mappingInfo: {
            mappingType: 'unchanged'
          },
          message: 'Địa chỉ không thay đổi hoặc đã được cập nhật'
        };
      }

      return {
        success: false,
        originalAddress: fullAddress,
        message: 'Không tìm thấy thông tin mapping cho địa chỉ này'
      };
    }

    // Tìm mapping phù hợp nhất
    const bestMapping = this.findBestMapping(validAddress, mappings);
    
    if (!bestMapping) {
      return {
        success: false,
        originalAddress: fullAddress,
        message: 'Không tìm thấy mapping phù hợp'
      };
    }

    // Tạo địa chỉ mới từ mapping
    const convertedAddress = this.createConvertedAddress(validAddress, bestMapping);
    const mappingType = this.determineMappingType(bestMapping, mappings);

    return {
      success: true,
      originalAddress: fullAddress,
      convertedAddress,
      mappingInfo: {
        oldWardCode: bestMapping.old_ward_code,
        newWardCode: bestMapping.new_ward_code,
        mappingType
      },
      message: this.getMappingMessage(mappingType)
    };
  }

  /**
   * Tìm mapping phù hợp nhất
   */
  private findBestMapping(address: ValidAddress, mappings: WardMapping[]): WardMapping | null {
    if (mappings.length === 1) {
      return mappings[0];
    }

    // Tính điểm cho mỗi mapping
    let bestMapping: WardMapping | null = null;
    let bestScore = 0;

    for (const mapping of mappings) {
      let score = 0;

      // Điểm province (quan trọng nhất)
      if (address.province) {
        const provinceSimilarity = Math.max(
          calculateSimilarity(address.province, mapping.old_province_name),
          calculateSimilarity(address.province, mapping.new_province_name)
        );
        score += provinceSimilarity * 3;
      }

      // Điểm district
      if (address.district) {
        const districtSimilarity = calculateSimilarity(address.district, mapping.old_district_name);
        score += districtSimilarity * 2;
      }

      // Điểm ward
      if (address.ward) {
        const wardSimilarity = calculateSimilarity(address.ward, mapping.old_ward_name);
        score += wardSimilarity * 1;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMapping = mapping;
      }
    }

    return bestScore > 1.5 ? bestMapping : null; // Threshold để đảm bảo chất lượng mapping
  }

  /**
   * Tạo địa chỉ mới từ mapping
   */
  private createConvertedAddress(originalAddress: ValidAddress, mapping: WardMapping): NewAddress {
    return {
      ward: mapping.new_ward_name,
      // Loại bỏ district theo cấu trúc hành chính mới
      province: mapping.new_province_name,
      street: originalAddress.street
    };
  }

  /**
   * Xác định loại mapping
   */
  private determineMappingType(mapping: WardMapping, allMappings: WardMapping[]): 'exact' | 'merged' | 'renamed' | 'unchanged' | 'not_found' {
    // Kiểm tra merge: nhiều ward cũ -> 1 ward mới
    const sameNewWard = allMappings.filter(m => m.new_ward_code === mapping.new_ward_code);
    if (sameNewWard.length > 1) {
      return 'merged';
    }

    // Kiểm tra rename: 1 ward cũ -> 1 ward mới với tên khác
    if (mapping.old_ward_code === mapping.new_ward_code && mapping.old_ward_name !== mapping.new_ward_name) {
      return 'renamed';
    }

    // Kiểm tra exact: ward không thay đổi
    if (mapping.old_ward_code === mapping.new_ward_code && mapping.old_ward_name === mapping.new_ward_name) {
      return 'unchanged';
    }

    return 'exact';
  }

  /**
   * Tạo message cho kết quả mapping
   */
  private getMappingMessage(mappingType: 'exact' | 'merged' | 'renamed' | 'unchanged' | 'not_found'): string {
    switch (mappingType) {
      case 'exact':
        return 'Địa chỉ đã được chuyển đổi chính xác';
      case 'merged':
        return 'Phường/xã cũ đã được gộp vào phường/xã mới';
      case 'renamed':
        return 'Phường/xã đã được đổi tên';
      case 'unchanged':
        return 'Địa chỉ không thay đổi';
      default:
        return 'Không xác định được loại chuyển đổi';
    }
  }

  /**
   * Tìm tỉnh trong dữ liệu mới
   */
  private findNewProvince(provinceName: string): Province | null {
    const provinces = this.dataLoader.getProvinces();
    const match = findBestMatch(
      provinces,
      provinceName,
      (province: Province) => province.name + ' ' + province.short_name,
      0.7
    );
    return match?.item || null;
  }

  /**
   * Tìm phường/xã trong dữ liệu mới
   */
  private findNewWard(wardName: string | undefined, provinceCode: string): Ward | null {
    if (!wardName) return null;
    
    const wards = this.dataLoader.getWards().filter((ward: Ward) => ward.province_code === provinceCode);
    const match = findBestMatch(
      wards,
      wardName,
      (ward: Ward) => ward.name,
      0.7
    );
    return match?.item || null;
  }

  /**
   * Lấy thống kê dữ liệu
   */
  getDataStats() {
    if (!this.isInitialized) {
      throw new Error('Converter chưa được khởi tạo');
    }
    return this.dataLoader.getDataStats();
  }

  /**
   * Lấy danh sách tỉnh/thành phố
   */
  getProvinces() {
    if (!this.isInitialized) {
      throw new Error('Converter chưa được khởi tạo');
    }
    return this.dataLoader.getProvinces();
  }

  /**
   * Lấy danh sách phường/xã theo tỉnh
   */
  getWardsByProvince(provinceCode: string) {
    if (!this.isInitialized) {
      throw new Error('Converter chưa được khởi tạo');
    }
    return this.dataLoader.getWards().filter((ward: Ward) => ward.province_code === provinceCode);
  }

  /**
   * Tìm kiếm mapping theo từ khóa
   */
  searchMappings(keyword: string) {
    if (!this.isInitialized) {
      throw new Error('Converter chưa được khởi tạo');
    }
    
    const normalizedKeyword = normalizeText(keyword);
    return this.dataLoader.getWardMappings().filter((mapping: WardMapping) => {
      const searchText = `${mapping.old_ward_name} ${mapping.old_district_name} ${mapping.old_province_name} ${mapping.new_ward_name} ${mapping.new_province_name}`;
      return fuzzyContains(searchText, keyword, 0.6);
    });
  }
}
