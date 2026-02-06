import { validateEmail, sanitizeInput } from '../../src/utils/helpers';

describe('Helpers', () => {
  describe('validateEmail', () => {
    it('should reject invalid email addresses', () => {
      expect(validateEmail('@')).toBe(false);
      expect(validateEmail('@@')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain')).toBe(false);
      expect(validateEmail('not-an-email')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should escape HTML special characters', () => {
      const result = sanitizeInput('<script>alert("xss")</script>');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('</script>');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
    });

    it('should escape ampersands', () => {
      const result = sanitizeInput('a & b');
      expect(result).toContain('&amp;');
      expect(result).not.toBe('a & b');
    });

    it('should escape quotes', () => {
      const result = sanitizeInput('"hello" & \'world\'');
      expect(result).toContain('&quot;');
      expect(result).toContain('&#x27;');
    });
  });
});
