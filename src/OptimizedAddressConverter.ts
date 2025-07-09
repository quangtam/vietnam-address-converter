import { OptimizedDataLoader } from './OptimizedDataLoader';
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
 * Optimized AddressConverter với cache và batch processing
 */
export class OptimizedVietnamAddressConverter {
  private dataLoader: OptimizedDataLoader;
  private isInitialized = false;
  
  // Caches để tránh tính toán lại
  private conversionCache = new Map<string, ConversionResult>();
  private provinceCache = new Map<string, Province | undefined>();
  private wardCache = new Map<string, Ward | undefined>();
  
  // Performance tracking
  private stats = {
    totalConversions: 0,
    cacheHits: 0,
    avgConversionTime: 0
  };

  constructor() {
    this.dataLoader = new OptimizedDataLoader();
  }

  /**
   * Khởi tạo với dữ liệu mặc định
   */
  async initialize(dataFilePath?: string): Promise<void> {
    try {
      const startTime = performance.now();
      await this.dataLoader.loadFromFile(dataFilePath);
      const endTime = performance.now();
      
      this.isInitialized = true;
      console.log(`🚀 Optimized converter initialized in ${Math.round(endTime - startTime)}ms`);
      console.log('📊 Data stats:', this.dataLoader.getStats());
    } catch (error) {
      throw new Error(`Không thể khởi tạo converter: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Chuyển đổi địa chỉ với cache và optimization
   */
  convertAddress(address: string | FullAddress): ConversionResult {
    if (!this.isInitialized) {
      throw new Error('Converter chưa được khởi tạo. Hãy gọi initialize() trước.');
    }

    const startTime = performance.now();
    
    // Tạo cache key từ input
    const cacheKey = typeof address === 'string' ? address : JSON.stringify(address);
    
    // Kiểm tra cache trước
    if (this.conversionCache.has(cacheKey)) {
      this.stats.cacheHits++;
      return this.conversionCache.get(cacheKey)!;
    }

    const fullAddress = typeof address === 'string' ? parseAddress(address) : address;
    
    if (!fullAddress.province) {
      const result: ConversionResult = {
        success: false,
        originalAddress: fullAddress,
        message: 'Địa chỉ phải có ít nhất tên tỉnh/thành phố'
      };
      
      this.conversionCache.set(cacheKey, result);
      return result;
    }

    const validAddress: ValidAddress = fullAddress as ValidAddress;
    
    // Tìm mapping với optimized search
    const mappings = this.dataLoader.findMappingByOldAddress(
      validAddress.ward,
      validAddress.district,
      validAddress.province
    );

    let result: ConversionResult;

    if (mappings.length === 0) {
      // Sử dụng cached province lookup
      const newProvinceMatch = this.findNewProvinceCached(validAddress.province);
      if (newProvinceMatch) {
        const newWardMatch = this.findNewWardCached(validAddress.ward || '', newProvinceMatch.province_code);
        
        result = {
          success: true,
          originalAddress: fullAddress,
          convertedAddress: {
            ward: newWardMatch?.name || validAddress.ward,
            province: newProvinceMatch.name,
            street: validAddress.street
          },
          mappingInfo: {
            mappingType: 'unchanged'
          },
          message: 'Địa chỉ không thay đổi hoặc đã được cập nhật'
        };
      } else {
        result = {
          success: false,
          originalAddress: fullAddress,
          message: 'Không tìm thấy thông tin mapping cho địa chỉ này'
        };
      }
    } else {
      // Tìm mapping phù hợp nhất với fast matching
      const bestMapping = this.findBestMappingFast(validAddress, mappings);
      
      if (!bestMapping) {
        result = {
          success: false,
          originalAddress: fullAddress,
          message: 'Không tìm thấy mapping phù hợp'
        };
      } else {
        // Xây dựng địa chỉ mới từ mapping
        const convertedAddress = this.buildConvertedAddress(bestMapping, validAddress.street);
        
        result = {
          success: true,
          originalAddress: fullAddress,
          convertedAddress,
          mappingInfo: {
            mappingType: 'merged' // simplified mapping type
          }
        };
      }
    }

    // Cache result
    this.conversionCache.set(cacheKey, result);
    
    // Update performance stats
    const endTime = performance.now();
    this.stats.totalConversions++;
    this.stats.avgConversionTime = (this.stats.avgConversionTime * (this.stats.totalConversions - 1) + (endTime - startTime)) / this.stats.totalConversions;

    return result;
  }

  /**
   * Batch conversion với optimizations
   */
  convertAddresses(addresses: (string | FullAddress)[]): ConversionResult[] {
    console.log(`🔄 Converting ${addresses.length} addresses in batch...`);
    const startTime = performance.now();
    
    const results = addresses.map(address => this.convertAddress(address));
    
    const endTime = performance.now();
    console.log(`✅ Batch conversion completed in ${Math.round(endTime - startTime)}ms`);
    console.log(`📈 Cache hit rate: ${Math.round((this.stats.cacheHits / this.stats.totalConversions) * 100)}%`);
    
    return results;
  }

  /**
   * Cached province lookup
   */
  private findNewProvinceCached(provinceName: string): Province | undefined {
    if (this.provinceCache.has(provinceName)) {
      return this.provinceCache.get(provinceName);
    }
    
    const province = this.dataLoader.findProvinceByName(provinceName);
    this.provinceCache.set(provinceName, province);
    return province;
  }

  /**
   * Cached ward lookup
   */
  private findNewWardCached(wardName: string, provinceCode?: string): Ward | undefined {
    const cacheKey = `${wardName}_${provinceCode || ''}`;
    
    if (this.wardCache.has(cacheKey)) {
      return this.wardCache.get(cacheKey);
    }
    
    const ward = this.dataLoader.findWardByName(wardName, provinceCode);
    this.wardCache.set(cacheKey, ward);
    return ward;
  }

  /**
   * Fast mapping selection với simplified scoring
   */
  private findBestMappingFast(address: ValidAddress, mappings: WardMapping[]): WardMapping | null {
    if (mappings.length === 1) {
      return mappings[0];
    }
    
    let bestMapping: WardMapping | null = null;
    let bestScore = 0;
    
    const normalizedProvince = normalizeText(address.province);
    const normalizedDistrict = normalizeText(address.district || '');
    const normalizedWard = normalizeText(address.ward || '');
    
    for (const mapping of mappings) {
      let score = 0;
      
      // Fast exact match checks
      if (mapping.old_province_name && normalizeText(mapping.old_province_name) === normalizedProvince) {
        score += 10;
      }
      
      if (mapping.old_district_name && normalizeText(mapping.old_district_name) === normalizedDistrict) {
        score += 10;
      }
      
      if (mapping.old_ward_name && normalizeText(mapping.old_ward_name) === normalizedWard) {
        score += 20;
      }
      
      // Quick similarity check only if no exact matches
      if (score === 0) {
        if (mapping.old_province_name) {
          score += calculateSimilarity(normalizedProvince, normalizeText(mapping.old_province_name)) * 5;
        }
        if (mapping.old_ward_name) {
          score += calculateSimilarity(normalizedWard, normalizeText(mapping.old_ward_name)) * 10;
        }
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMapping = mapping;
      }
      
      // Early exit for perfect matches
      if (score >= 40) break;
    }
    
    return bestScore > 15 ? bestMapping : null;
  }

  /**
   * Build converted address từ mapping
   */
  private buildConvertedAddress(mapping: WardMapping, street?: string): NewAddress {
    return {
      ward: mapping.new_ward_name || 'Unknown Ward',
      province: mapping.new_province_name || 'Unknown Province',
      street: street
    };
  }

  /**
   * Check if address has changes
   */
  private hasAddressChanges(oldAddress: ValidAddress, newAddress: NewAddress): boolean {
    const oldNormalized = `${normalizeText(oldAddress.ward || '')}_${normalizeText(oldAddress.province)}`;
    const newNormalized = `${normalizeText(newAddress.ward || '')}_${normalizeText(newAddress.province || '')}`;
    
    return oldNormalized !== newNormalized;
  }

  /**
   * Clear caches để giải phóng memory
   */
  clearCache(): void {
    this.conversionCache.clear();
    this.provinceCache.clear();
    this.wardCache.clear();
    console.log('🧹 Caches cleared');
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats() {
    return {
      ...this.stats,
      cacheSize: this.conversionCache.size,
      provinceCacheSize: this.provinceCache.size,
      wardCacheSize: this.wardCache.size,
      dataStats: this.dataLoader.getStats()
    };
  }

  // Backward compatibility methods
  getProvinces(): Province[] { return this.dataLoader.getProvinces(); }
  getWards(): Ward[] { return this.dataLoader.getWards(); }
  getWardMappings(): WardMapping[] { return this.dataLoader.getWardMappings(); }
}
