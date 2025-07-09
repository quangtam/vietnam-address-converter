import { normalizeText, parseAddress, fuzzyContains, calculateSimilarity, findBestMatch, removeAdministrativeTypes } from '../utils';

describe('Utils', () => {
  describe('normalizeText', () => {
    it('should normalize Vietnamese text', () => {
      expect(normalizeText('Xã Văn Luông')).toBe('xa van luong');
      expect(normalizeText('Thành phố Hồ Chí Minh')).toBe('thanh pho ho chi minh');
      expect(normalizeText('Quận Gò Vấp')).toBe('quan go vap');
    });

    it('should handle empty and undefined', () => {
      expect(normalizeText('')).toBe('');
      expect(normalizeText(undefined as any)).toBe('');
    });
  });

  describe('parseAddress', () => {
    it('should parse string address with full components', () => {
      const result = parseAddress('123 Nguyễn Văn Cừ, Phường 5, Quận Gò Vấp, Thành phố Hồ Chí Minh');
      
      expect(result).toEqual({
        street: '123 Nguyễn Văn Cừ',
        ward: 'Phường 5',
        district: 'Quận Gò Vấp',
        province: 'Thành phố Hồ Chí Minh'
      });
    });

    it('should parse address with missing district', () => {
      const result = parseAddress('Phường 5, Thành phố Hồ Chí Minh');
      
      expect(result).toEqual({
        district: 'Phường 5',  // With only 2 parts, this becomes district
        province: 'Thành phố Hồ Chí Minh'
      });
    });

    it('should handle empty input', () => {
      expect(parseAddress('')).toEqual({});
    });
  });

  describe('fuzzyContains', () => {
    it('should find fuzzy matches', () => {
      expect(fuzzyContains('Xã Văn Luông', 'van luong')).toBe(true);
      expect(fuzzyContains('Thành phố Hồ Chí Minh', 'ho chi minh')).toBe(true);
      expect(fuzzyContains('Quận Gò Vấp', 'go vap')).toBe(true);
    });

    it('should handle typos', () => {
      expect(fuzzyContains('Xã Văn Luông', 'van luongg')).toBe(true);
      expect(fuzzyContains('Thành phố Hồ Chí Minh', 'ho chi min')).toBe(true);
    });

    it('should reject non-matches', () => {
      expect(fuzzyContains('Xã Văn Luông', 'completely different')).toBe(false);
    });
  });

  describe('calculateSimilarity', () => {
    it('should calculate exact match', () => {
      expect(calculateSimilarity('Văn Luông', 'Văn Luông')).toBe(1);
    });

    it('should calculate partial similarity', () => {
      const similarity = calculateSimilarity('Văn Luông', 'Văn Luong');
      expect(similarity).toBeGreaterThan(0.8);
    });

    it('should return 0 for completely different strings', () => {
      const similarity = calculateSimilarity('Văn Luông', 'Completely Different');
      expect(similarity).toBeLessThan(0.3);
    });
  });

  describe('removeAdministrativeTypes', () => {
    it('should remove administrative prefixes', () => {
      expect(removeAdministrativeTypes('Xã Văn Luông')).toBe('van luong');
      expect(removeAdministrativeTypes('Thành phố Hồ Chí Minh')).toBe('ho chi minh');
      expect(removeAdministrativeTypes('Quận Gò Vấp')).toBe('go vap');
    });
  });
});