/**
 * Chuẩn hóa tên địa chỉ để so sánh
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    // Loại bỏ dấu tiếng Việt
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Loại bỏ các ký tự đặc biệt
    .replace(/[^\w\s]/g, ' ')
    // Chuẩn hóa khoảng trắng
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tính độ tương đồng giữa 2 chuỗi (Levenshtein distance)
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);
  
  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;
  
  const matrix = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));
  
  for (let i = 0; i <= s1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= s2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= s2.length; j++) {
    for (let i = 1; i <= s1.length; i++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // insertion
        matrix[j - 1][i] + 1,     // deletion
        matrix[j - 1][i - 1] + cost // substitution
      );
    }
  }
  
  const maxLength = Math.max(s1.length, s2.length);
  return (maxLength - matrix[s2.length][s1.length]) / maxLength;
}

/**
 * Kiểm tra xem một chuỗi có chứa chuỗi khác hay không (fuzzy match)
 */
export function fuzzyContains(haystack: string, needle: string, threshold = 0.8): boolean {
  const normalizedHaystack = normalizeText(haystack);
  const normalizedNeedle = normalizeText(needle);
  
  if (normalizedHaystack.includes(normalizedNeedle)) return true;
  
  // Tìm kiếm từng từ
  const needleWords = normalizedNeedle.split(' ');
  const haystackWords = normalizedHaystack.split(' ');
  
  return needleWords.every(needleWord => 
    haystackWords.some(haystackWord => 
      calculateSimilarity(haystackWord, needleWord) >= threshold
    )
  );
}

/**
 * Tìm kết quả tốt nhất dựa trên độ tương đồng
 */
export function findBestMatch<T>(
  items: T[],
  searchText: string,
  getTextFunction: (item: T) => string,
  threshold = 0.7
): { item: T; similarity: number } | null {
  let bestMatch: { item: T; similarity: number } | null = null;
  
  for (const item of items) {
    const itemText = getTextFunction(item);
    const similarity = calculateSimilarity(searchText, itemText);
    
    if (similarity >= threshold && (!bestMatch || similarity > bestMatch.similarity)) {
      bestMatch = { item, similarity };
    }
  }
  
  return bestMatch;
}

/**
 * Loại bỏ các từ chỉ loại hình hành chính
 */
export function removeAdministrativeTypes(text: string): string {
  const types = [
    'thành phố', 'tỉnh', 'quận', 'huyện', 'thị xã', 'thành phố trung ương',
    'phường', 'xã', 'thị trấn'
  ];
  
  let result = normalizeText(text);
  
  for (const type of types) {
    const normalizedType = normalizeText(type);
    result = result.replace(new RegExp(`\\b${normalizedType}\\b`, 'g'), '').trim();
  }
  
  return result.replace(/\s+/g, ' ').trim();
}

/**
 * Tách địa chỉ thành các thành phần
 */
export function parseAddress(address: string): {
  ward?: string;
  district?: string;
  province?: string;
  street?: string;
} {
  if (!address) return {};
  
  const parts = address.split(',').map(part => part.trim()).filter(Boolean);
  
  if (parts.length === 0) return {};
  
  // Thường thì địa chỉ Việt Nam có format: street, ward, district, province
  const result: any = {};
  
  if (parts.length >= 1) {
    result.province = parts[parts.length - 1];
  }
  
  if (parts.length >= 2) {
    result.district = parts[parts.length - 2];
  }
  
  if (parts.length >= 3) {
    result.ward = parts[parts.length - 3];
  }
  
  if (parts.length >= 4) {
    result.street = parts.slice(0, parts.length - 3).join(', ');
  }
  
  return result;
}
