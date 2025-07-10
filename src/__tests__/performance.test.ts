import { VietnamAddressConverter } from '../AddressConverter';

/**
 * Simple performance test
 */
describe('Performance Tests', () => {
  test('should initialize converter successfully', async () => {
    const converter = new VietnamAddressConverter();
    await expect(converter.initialize()).resolves.not.toThrow();
  });

  test('should convert address successfully', async () => {
    const converter = new VietnamAddressConverter();
    await converter.initialize();
    
    const result = converter.convertAddress('Phường 12, Quận Gò Vấp, Thành phố Hồ Chí Minh');
    expect(result.success).toBe(true);
  });

  test('should have performance stats', async () => {
    const converter = new VietnamAddressConverter();
    await converter.initialize();
    
    converter.convertAddress('Phường 12, Quận Gò Vấp, Thành phố Hồ Chí Minh');
    
    const stats = converter.getPerformanceStats();
    expect(stats.totalConversions).toBeGreaterThan(0);
    expect(stats.avgConversionTime).toBeGreaterThanOrEqual(0);
  });
});
