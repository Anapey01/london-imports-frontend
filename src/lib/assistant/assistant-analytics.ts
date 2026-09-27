/**
 * London's Imports - Subtle AI Concierge Analytics & Conversion Attribution
 * Tracks visitor engagement with Miss London quietly in the background without intrusive UI or cookies.
 */
import { trackEvent } from '@/lib/analytics';

const SESSION_KEY = 'li_concierge_sid';
const ENGAGED_KEY = 'li_concierge_engaged';
const MSG_COUNT_KEY = 'li_concierge_msg_count';
const LAST_ACTIVE_KEY = 'li_concierge_last_active';

/**
 * Get or generate persistent anonymous session UUID
 */
export function getOrCreateAssistantSessionId(): string {
    if (typeof window === 'undefined') return '';
    try {
        let sid = localStorage.getItem(SESSION_KEY);
        if (!sid) {
            sid = 'ml_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
            localStorage.setItem(SESSION_KEY, sid);
        }
        return sid;
    } catch {
        return 'ml_anon_' + Date.now().toString(36);
    }
}

/**
 * Subtly record an interaction (drawer open, user message sent)
 */
export function recordAssistantInteraction(action: 'opened' | 'message_sent') {
    if (typeof window === 'undefined') return;

    try {
        const sid = getOrCreateAssistantSessionId();
        localStorage.setItem(ENGAGED_KEY, 'true');
        localStorage.setItem(LAST_ACTIVE_KEY, new Date().toISOString());

        let count = 0;
        if (action === 'message_sent') {
            const rawCount = parseInt(localStorage.getItem(MSG_COUNT_KEY) || '0', 10);
            count = isNaN(rawCount) ? 1 : rawCount + 1;
            localStorage.setItem(MSG_COUNT_KEY, count.toString());
        } else {
            count = parseInt(localStorage.getItem(MSG_COUNT_KEY) || '0', 10);
        }

        // 1. Silent Google Analytics event
        trackEvent('assistant_interaction', {
            action,
            session_id: sid,
            message_count: count
        });

        // 2. Silent backend telemetry ping (fire-and-forget)
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
        fetch(`${apiBase.replace(/\/$/, '')}/orders/assistant/telemetry/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: sid,
                action,
                message_count: count
            }),
            keepalive: true
        }).catch(() => {
            // Silently swallow network anomalies — tracking should never interrupt user experience
        });
    } catch {
        // Ignore storage exceptions
    }
}

/**
 * Get attribution payload for checkout
 */
export function getAssistantAttribution(): { engaged: boolean; session_id?: string; message_count?: number } {
    if (typeof window === 'undefined') return { engaged: false };

    try {
        const engaged = localStorage.getItem(ENGAGED_KEY) === 'true';
        if (!engaged) return { engaged: false };

        const sid = localStorage.getItem(SESSION_KEY) || undefined;
        const count = parseInt(localStorage.getItem(MSG_COUNT_KEY) || '1', 10);

        return {
            engaged: true,
            session_id: sid,
            message_count: count
        };
    } catch {
        return { engaged: false };
    }
}

/**
 * Reset local session engagement after successful checkout
 */
export function markAssistantSessionConverted() {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(ENGAGED_KEY);
        localStorage.removeItem(MSG_COUNT_KEY);
        // Regenerate new session token for subsequent future visits
        localStorage.removeItem(SESSION_KEY);
    } catch {
        // Ignore
    }
}
