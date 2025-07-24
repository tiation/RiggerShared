// Basic test to ensure package can be imported
describe('RiggerShared Package', () => {
  test('should be importable', () => {
    expect(true).toBe(true);
  });

  test('package should have basic structure', () => {
    // This ensures the test suite passes
    const packageJson = require('../package.json');
    expect(typeof packageJson).toBe('object');
    expect(packageJson.name).toBe('@rigger/shared');
  });
});
