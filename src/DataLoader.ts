import { Province, Ward, WardMapping, DatabaseExport } from './types';

/**
 * Class để load và parse dữ liệu từ thư viện vietnam-address-database
 */
export class DataLoader {
  private rawData: DatabaseExport[] = [];
  private provinces: Province[] = [];
  private wards: Ward[] = [];
  private wardMappings: WardMapping[] = [];

  /**
   * Load dữ liệu từ thư viện vietnam-address-database
   */
  async loadFromFile(filePath?: string): Promise<void> {
    try {
      let data: DatabaseExport[];
      
      if (typeof window !== 'undefined') {
        // Browser environment - fetch from URL
        throw new Error('DataLoader không hỗ trợ browser environment. Sử dụng loadFromUrl() thay thế.');
      }
      
      if (filePath) {
        // Load từ file path tùy chỉnh
        const { readFileSync } = await import('fs');
        const rawContent = readFileSync(filePath, 'utf8');
        data = JSON.parse(rawContent);
      } else {
        // Load từ thư viện vietnam-address-database
        try {
          const addressDatabase = await import('vietnam-address-database');
          // Thư viện export trực tiếp array dữ liệu
          data = addressDatabase.default || addressDatabase as any;
        } catch (importError) {
          // Fallback: nếu không import được, thử load từ node_modules
          const { readFileSync } = await import('fs');
          const { join } = await import('path');
          const packagePath = join(process.cwd(), 'node_modules', 'vietnam-address-database', 'dist', 'address.json');
          const rawContent = readFileSync(packagePath, 'utf8');
          data = JSON.parse(rawContent);
        }
      }
      
      this.rawData = data;
      this.parseData();
    } catch (error) {
      throw new Error(`Không thể load dữ liệu: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Load dữ liệu từ URL (cho browser environment)
   */
  async loadFromUrl(url?: string): Promise<void> {
    try {
      if (typeof window === 'undefined') {
        throw new Error('loadFromUrl() chỉ hỗ trợ browser environment. Sử dụng loadFromFile() trong Node.js.');
      }

      const defaultUrl = 'https://unpkg.com/vietnam-address-database@latest/address.json'; // CDN URL for browser
      const targetUrl = url || defaultUrl;
      
      const response = await fetch(targetUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: DatabaseExport[] = await response.json();
      this.rawData = data;
      this.parseData();
    } catch (error) {
      throw new Error(`Không thể load dữ liệu từ URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse dữ liệu từ raw JSON thành các đối tượng có cấu trúc
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
   * Lấy danh sách tỉnh/thành phố
   */
  getProvinces(): Province[] {
    return this.provinces;
  }

  /**
   * Lấy danh sách phường/xã
   */
  getWards(): Ward[] {
    return this.wards;
  }

  /**
   * Lấy danh sách mapping
   */
  getWardMappings(): WardMapping[] {
    return this.wardMappings;
  }

  /**
   * Tìm tỉnh theo tên
   */
  findProvinceByName(name: string): Province | undefined {
    const normalizedName = name.toLowerCase().trim();
    
    return this.provinces.find(province => {
      const provinceName = province.name.toLowerCase();
      const shortName = province.short_name.toLowerCase();
      
      return provinceName.includes(normalizedName) || 
             shortName.includes(normalizedName) ||
             normalizedName.includes(provinceName) ||
             normalizedName.includes(shortName);
    });
  }

  /**
   * Tìm phường/xã theo tên và mã tỉnh
   */
  findWardByName(name: string, provinceCode?: string): Ward | undefined {
    const normalizedName = name.toLowerCase().trim();
    
    let wards = this.wards;
    if (provinceCode) {
      wards = wards.filter(ward => ward.province_code === provinceCode);
    }
    
    return wards.find(ward => {
      const wardName = ward.name.toLowerCase();
      return wardName.includes(normalizedName) || normalizedName.includes(wardName);
    });
  }

  /**
   * Tìm mapping theo thông tin địa chỉ cũ
   */
  findMappingByOldAddress(
    wardName?: string,
    districtName?: string,
    provinceName?: string
  ): WardMapping[] {
    let mappings = this.wardMappings;
    
    if (provinceName) {
      const normalizedProvince = provinceName.toLowerCase().trim();
      mappings = mappings.filter(mapping => {
        if (!mapping.old_province_name) return false;
        return mapping.old_province_name.toLowerCase().includes(normalizedProvince) ||
               normalizedProvince.includes(mapping.old_province_name.toLowerCase());
      });
    }
    
    if (districtName) {
      const normalizedDistrict = districtName.toLowerCase().trim();
      mappings = mappings.filter(mapping => {
        if (!mapping.old_district_name) return false;
        return mapping.old_district_name.toLowerCase().includes(normalizedDistrict) ||
               normalizedDistrict.includes(mapping.old_district_name.toLowerCase());
      });
    }
    
    if (wardName) {
      const normalizedWard = wardName.toLowerCase().trim();
      mappings = mappings.filter(mapping => {
        if (!mapping.old_ward_name) return false;
        return mapping.old_ward_name.toLowerCase().includes(normalizedWard) ||
               normalizedWard.includes(mapping.old_ward_name.toLowerCase());
      });
    }
    
    return mappings;
  }

  /**
   * Kiểm tra xem dữ liệu đã được load chưa
   */
  isDataLoaded(): boolean {
    return this.provinces.length > 0 && this.wards.length > 0 && this.wardMappings.length > 0;
  }

  /**
   * Lấy thống kê dữ liệu
   */
  getDataStats(): {
    provinces: number;
    wards: number;
    mappings: number;
  } {
    return {
      provinces: this.provinces.length,
      wards: this.wards.length,
      mappings: this.wardMappings.length
    };
  }
}
