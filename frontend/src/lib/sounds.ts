/**
 * Sound Effects Utility
 * Provides subtle audio feedback for interactions
 * Uses Web Audio API for lightweight sound generation
 */

class SoundEffects {
    private audioContext: AudioContext | null = null;

    private getContext(): AudioContext {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return this.audioContext;
    }

    /**
     * Play a subtle click sound
     */
    click() {
        try {
            const ctx = this.getContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.value = 600;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.0005, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.05);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.1);
        } catch (e) {
            // Silent fail if audio not available
        }
    }

    /**
     * Play a success chime
     */
    success() {
        try {
            const ctx = this.getContext();
            const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 - Major chord

            notes.forEach((freq, i) => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.frequency.value = freq;
                oscillator.type = 'sine';

                const startTime = ctx.currentTime + (i * 0.08);
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(0.0005, startTime + 0.02);
                gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + 0.2);

                oscillator.start(startTime);
                oscillator.stop(startTime + 0.3);
            });
        } catch (e) {
            // Silent fail if audio not available
        }
    }

    /**
     * Play a notification sound
     */
    notification() {
        try {
            const ctx = this.getContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.setValueAtTime(880, ctx.currentTime);
            oscillator.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.1);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.0005, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.1);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.2);
        } catch (e) {
            // Silent fail if audio not available
        }
    }
}

// Export singleton instance
export const sounds = new SoundEffects();

// React hook for sound effects
export function useSounds() {
    return sounds;
}
