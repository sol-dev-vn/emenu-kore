import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter for development
// In production, you should use Redis or another persistent store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  max: number; // Max requests per window
  message: string; // Error message
}

export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<NextResponse | null> {
  const identifier = request.ip || 'unknown';
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Clean up old entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }

  // Get current rate limit data for this identifier
  let rateLimitData = rateLimitStore.get(identifier);

  if (!rateLimitData || rateLimitData.resetTime < now) {
    // First request or window expired
    rateLimitData = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(identifier, rateLimitData);
    return null; // Allow request
  }

  // Increment counter
  rateLimitData.count++;

  // Check if limit exceeded
  if (rateLimitData.count > config.max) {
    const resetTimeSeconds = Math.ceil((rateLimitData.resetTime - now) / 1000);
    
    return NextResponse.json(
      {
        success: false,
        message: config.message,
        resetTime: rateLimitData.resetTime,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': config.max.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitData.resetTime.toString(),
          'Retry-After': resetTimeSeconds.toString(),
        },
      }
    );
  }

  // Update rate limit data
  rateLimitStore.set(identifier, rateLimitData);

  // Add rate limit headers to successful responses
  const remaining = config.max - rateLimitData.count;
  const headers = {
    'X-RateLimit-Limit': config.max.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': rateLimitData.resetTime.toString(),
  };

  // Store headers to be added to the response
  (request as any).rateLimitHeaders = headers;

  return null; // Allow request
}

// Function to add rate limit headers to a response
export function addRateLimitHeaders(response: NextResponse, headers: Record<string, string>): void {
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
}