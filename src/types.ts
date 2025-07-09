/**
 * Cấu trúc dữ liệu tỉnh/thành phố
 */
export interface Province {
  id: string;
  province_code: string;
  name: string;
  short_name: string;
  code: string;
  place_type: string;
  country: string;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Cấu trúc dữ liệu phường/xã
 */
export interface Ward {
  id: string;
  ward_code: string;
  name: string;
  province_code: string;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Cấu trúc dữ liệu mapping từ địa chỉ cũ sang mới
 */
export interface WardMapping {
  id: string;
  old_ward_code: string;
  old_ward_name: string;
  old_district_name: string;
  old_province_name: string;
  new_ward_code: string;
  new_ward_name: string;
  new_province_name: string;
  created_at: string;
  updated_at: string;
}

/**
 * Địa chỉ đầy đủ (input) - có thể có district trong dữ liệu cũ
 */
export interface FullAddress {
  ward?: string;
  district?: string;  // Chỉ dùng cho input (địa chỉ cũ)
  province?: string;
  street?: string;
}

/**
 * Địa chỉ có tỉnh (đã validate)
 */
export interface ValidAddress extends FullAddress {
  province: string;
}

/**
 * Địa chỉ mới (sau chuyển đổi) - không có district
 */
export interface NewAddress {
  ward?: string;
  province: string;  // Bắt buộc phải có
  street?: string;
}

/**
 * Kết quả chuyển đổi địa chỉ
 */
export interface ConversionResult {
  success: boolean;
  originalAddress: FullAddress;
  convertedAddress?: NewAddress;  // Sử dụng NewAddress thay vì ValidAddress
  mappingInfo?: {
    oldWardCode?: string;
    newWardCode?: string;
    mappingType: 'exact' | 'merged' | 'renamed' | 'unchanged' | 'not_found';
  };
  message?: string;
}

/**
 * Cấu trúc dữ liệu JSON từ database export
 */
export interface DatabaseExport {
  type: string;
  name?: string;
  database?: string;
  data?: any[];
  version?: string;
  comment?: string;
}
