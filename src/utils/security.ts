
import DOMPurify from 'isomorphic-dompurify';

// Content sanitization utilities
export const sanitizeContent = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
};

// Input validation utilities
export const validateGameCode = (code: string): boolean => {
  const gameCodeRegex = /^[A-Z0-9]{6,8}$/;
  return gameCodeRegex.test(code);
};

export const validatePseudo = (pseudo: string): boolean => {
  const trimmed = pseudo.trim();
  return trimmed.length >= 2 && trimmed.length <= 20 && /^[a-zA-Z0-9\s_-]+$/.test(trimmed);
};

export const validateQuestionContent = (content: string): boolean => {
  const trimmed = content.trim();
  return trimmed.length >= 10 && trimmed.length <= 500;
};

export const validateMessageContent = (content: string): boolean => {
  const trimmed = content.trim();
  return trimmed.length >= 1 && trimmed.length <= 1000;
};

// Rate limiting utility
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    return true;
  }
}

export const joinGameRateLimiter = new RateLimiter(3, 60000); // 3 attempts per minute
export const messageRateLimiter = new RateLimiter(20, 60000); // 20 messages per minute

// Security headers for API calls
export const getSecurityHeaders = () => ({
  'Content-Security-Policy': "default-src 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block'
});

// Audit logging utility
export const logSecurityEvent = async (
  action: string,
  details: Record<string, any>
) => {
  console.log(`[SECURITY] ${action}:`, details);
  // In a production environment, you would send this to your logging service
};
