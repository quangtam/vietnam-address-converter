import { Province, Ward, WardMapping, DatabaseExport } from './types';
import { normalizeText } from './utils';

/**
 * Optimized DataLoader với cache và indexing
 */
export class OptimizedDataLoader {
  private rawData: DatabaseExport[] = [];
  private provinces: Province[] = [];
  private wards: Ward[] = [];
  private wardMappings: WardMapping[] = [];
  
  // Caches và indexes để tăng tốc độ tìm kiếm
  private provinceNameIndex = new Map<string, Province>();
  private wardNameIndex = new Map<string, Ward[]>();
  private mappingIndex = new Map<string, WardMapping[]>();
  private normalizedProvinceNames = new Map<string, string>();
  
  /**
   * Load dữ liệu từ file JSON với tối ưu hóa
   */
  async loadFromFile(filePath?: string): Promise<void> {
    try {
      let data: DatabaseExport[];
      
      if (typeof window !== 'undefined') {
        // Browser environment - fetch from URL
        throw new Error('OptimizedDataLoader không hỗ trợ browser environment. Sử dụng loadFromUrl() thay thế.');
      }
      
      // Node.js environment - dynamic import
      const { readFileSync } = await import('fs');
      const { join } = await import('path');
      
      if (filePath) {
        const rawContent = readFileSync(filePath, 'utf8');
        data = JSON.parse(rawContent);
      } else {
        // Load từ file mặc định trong thư viện
        // Always use the source path for simplicity
        const dataPath = join(process.cwd(), 'src', 'data', 'address.json');
        const rawContent = readFileSync(dataPath, 'utf8');
        data = JSON.parse(rawContent);
      }
      
      this.rawData = data;
      this.parseData();
      this.buildIndexes();
    } catch (error) {
      throw new Error(`Không thể load dữ liệu: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Load dữ liệu từ URL với tối ưu hóa (cho browser environment)
   */
  async loadFromUrl(url?: string): Promise<void> {
    try {
      if (typeof window === 'undefined') {
        throw new Error('loadFromUrl() chỉ hỗ trợ browser environment. Sử dụng loadFromFile() trong Node.js.');
      }

      const defaultUrl = './data/address.json'; // Relative URL for browser
      const targetUrl = url || defaultUrl;
      
      const response = await fetch(targetUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: DatabaseExport[] = await response.json();
      this.rawData = data;
      this.parseData();
      this.buildIndexes();
    } catch (error) {
      throw new Error(`Không thể load dữ liệu từ URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse dữ liệu từ raw JSON
   */
  private parseData(): void {
    for (const item of this.rawData) {
      if (item.type === 'table' && item.data) {
        switch (item.name) {
          case 'provinces':
            this.provinces = item.data as Province[];
            break;
          case 'wards':
            this.wards = item.data as Ward[];
            break;
          case 'ward_mappings':
            this.wardMappings = item.data as WardMapping[];
            break;
        }
      }
    }
  }

  /**
   * Xây dựng indexes để tăng tốc độ tìm kiếm
   */
  private buildIndexes(): void {
    console.log('🔧 Building search indexes...');
    
    // Index provinces by normalized names
    for (const province of this.provinces) {
      const normalizedName = normalizeText(province.name);
      const normalizedShortName = normalizeText(province.short_name);
      
      this.provinceNameIndex.set(normalizedName, province);
      this.provinceNameIndex.set(normalizedShortName, province);
      
      // Cache normalized names để tránh normalize lại
      this.normalizedProvinceNames.set(province.name, normalizedName);
      this.normalizedProvinceNames.set(province.short_name, normalizedShortName);
    }
    
    // Index wards by province code và normalized names
    for (const ward of this.wards) {
      const normalizedName = normalizeText(ward.name);
      const key = `${ward.province_code}_${normalizedName}`;
      
      if (!this.wardNameIndex.has(key)) {
        this.wardNameIndex.set(key, []);
      }
      this.wardNameIndex.get(key)!.push(ward);
      
      // Index chỉ theo tên ward (slower fallback)
      if (!this.wardNameIndex.has(normalizedName)) {
        this.wardNameIndex.set(normalizedName, []);
      }
      this.wardNameIndex.get(normalizedName)!.push(ward);
    }
    
    // Index mappings by combined keys
    for (const mapping of this.wardMappings) {
      const keys = [];
      
      if (mapping.old_province_name) {
        const normalizedProvince = normalizeText(mapping.old_province_name);
        keys.push(`province_${normalizedProvince}`);
        
        if (mapping.old_district_name) {
          const normalizedDistrict = normalizeText(mapping.old_district_name);
          keys.push(`district_${normalizedProvince}_${normalizedDistrict}`);
          
          if (mapping.old_ward_name) {
            const normalizedWard = normalizeText(mapping.old_ward_name);
            keys.push(`ward_${normalizedProvince}_${normalizedDistrict}_${normalizedWard}`);
          }
        }
      }
      
      for (const key of keys) {
        if (!this.mappingIndex.has(key)) {
          this.mappingIndex.set(key, []);
        }
        this.mappingIndex.get(key)!.push(mapping);
      }
    }
    
    console.log(`✅ Indexes built: ${this.provinceNameIndex.size} province entries, ${this.wardNameIndex.size} ward entries, ${this.mappingIndex.size} mapping entries`);
  }

  /**
   * Tìm tỉnh theo tên (optimized)
   */
  findProvinceByName(name: string): Province | undefined {
    const normalizedName = normalizeText(name);
    
    // Tìm exact match trước
    let province = this.provinceNameIndex.get(normalizedName);
    if (province) return province;
    
    // Fallback: tìm partial match
    for (const [indexedName, indexedProvince] of this.provinceNameIndex.entries()) {
      if (indexedName.includes(normalizedName) || normalizedName.includes(indexedName)) {
        return indexedProvince;
      }
    }
    
    return undefined;
  }

  /**
   * Tìm phường/xã theo tên và mã tỉnh (optimized)
   */
  findWardByName(name: string, provinceCode?: string): Ward | undefined {
    const normalizedName = normalizeText(name);
    
    if (provinceCode) {
      // Tìm theo province code trước (faster)
      const key = `${provinceCode}_${normalizedName}`;
      const wards = this.wardNameIndex.get(key);
      if (wards && wards.length > 0) {
        return wards[0];
      }
      
      // Fallback: partial match trong province
      for (const [indexedKey, indexedWards] of this.wardNameIndex.entries()) {
        if (indexedKey.startsWith(`${provinceCode}_`) && 
            (indexedKey.includes(normalizedName) || normalizedName.includes(indexedKey.split('_')[1]))) {
          return indexedWards[0];
        }
      }
    }
    
    // Fallback: tìm trong tất cả wards
    const wards = this.wardNameIndex.get(normalizedName);
    if (wards && wards.length > 0) {
      return wards[0];
    }
    
    return undefined;
  }

  /**
   * Tìm mapping theo thông tin địa chỉ cũ (optimized)
   */
  findMappingByOldAddress(
    wardName?: string,
    districtName?: string,
    provinceName?: string
  ): WardMapping[] {
    if (!provinceName) return [];
    
    const normalizedProvince = normalizeText(provinceName);
    
    // Tìm theo thứ tự specificity: ward -> district -> province
    if (wardName && districtName) {
      const normalizedWard = normalizeText(wardName);
      const normalizedDistrict = normalizeText(districtName);
      const key = `ward_${normalizedProvince}_${normalizedDistrict}_${normalizedWard}`;
      
      const mappings = this.mappingIndex.get(key);
      if (mappings && mappings.length > 0) {
        return mappings;
      }
    }
    
    if (districtName) {
      const normalizedDistrict = normalizeText(districtName);
      const key = `district_${normalizedProvince}_${normalizedDistrict}`;
      
      const mappings = this.mappingIndex.get(key);
      if (mappings && mappings.length > 0) {
        return mappings;
      }
    }
    
    // Fallback: chỉ theo province
    const key = `province_${normalizedProvince}`;
    const mappings = this.mappingIndex.get(key);
    return mappings || [];
  }

  // Getter methods (unchanged)
  getProvinces(): Province[] { return this.provinces; }
  getWards(): Ward[] { return this.wards; }
  getWardMappings(): WardMapping[] { return this.wardMappings; }
  
  /**
   * Get performance stats
   */
  getStats() {
    return {
      provinces: this.provinces.length,
      wards: this.wards.length,
      mappings: this.wardMappings.length,
      provinceIndexSize: this.provinceNameIndex.size,
      wardIndexSize: this.wardNameIndex.size,
      mappingIndexSize: this.mappingIndex.size
    };
  }
}
