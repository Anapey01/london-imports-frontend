/**
 * London's Imports - Assistant Security & Anti-Penetration Harness
 * Rate limiting and prompt injection guards
 */
import { NextRequest } from 'next/server';

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const ipRateLimits = new Map<string, RateLimitEntry>();

export function getClientIp(req: NextRequest): string {
    const xff = req.headers.get('x-forwarded-for');
    if (xff) return xff.split(',')[0].trim();
    const realIp = req.headers.get('x-real-ip');
    if (realIp) return realIp.trim();
    return '127.0.0.1';
}

export function checkRateLimit(ip: string, maxRequests = 60, windowMs = 60000): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const entry = ipRateLimits.get(ip);

    if (!entry || now > entry.resetTime) {
        ipRateLimits.set(ip, { count: 1, resetTime: now + windowMs });
        return { allowed: true };
    }

    if (entry.count >= maxRequests) {
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
        return { allowed: false, retryAfter };
    }

    entry.count += 1;
    return { allowed: true };
}

// Adversarial prompt injection & jailbreak detection patterns
export const ADVERSARIAL_PATTERNS = [
    /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
    /repeat\s+(everything|the\s+text)\s+above/i,
    /reveal\s+(your\s+)?(system\s+prompt|instructions|developer\s+mode|secret)/i,
    /you\s+are\s+now\s+(in\s+)?(dan|developer|chaos|unrestricted)\s+mode/i,
    /jailbreak/i,
    /what\s+is\s+your\s+system\s*prompt/i,
    /print\s+(your\s+)?system\s*prompt/i,
    /give\s+me\s+all\s+(api\s*keys|credentials|secret\s*keys)/i,
    /admin\s*override/i,
    /eval\s*\(|exec\s*\(|<script\b/i
];

export function isAdversarialInput(text: string): boolean {
    return ADVERSARIAL_PATTERNS.some(pat => pat.test(text));
}
