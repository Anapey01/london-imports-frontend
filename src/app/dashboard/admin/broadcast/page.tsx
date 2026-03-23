'use client';

import { useState } from 'react';
import { adminAPI } from '@/lib/api';
import { useTheme } from '@/providers/ThemeProvider';
import { useRouter } from 'next/navigation';
import { 
    Send, 
    Users, 
    AlertCircle, 
    CheckCircle,
    ArrowLeft,
    Mail
} from 'lucide-react';

export default function AdminBroadcastPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const router = useRouter();
    
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [target, setTarget] = useState('customers');
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm(`Are you sure you want to send this broadcast to all ${target}?`)) return;
        
        setSending(true);
        setStatus(null);
        
        try {
            await adminAPI.sendBroadcastEmail({ subject, message, target });
            setStatus({ type: 'success', msg: 'Broadcast email sent successfully!' });
            setSubject('');
            setMessage('');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            setStatus({ type: 'error', msg: error.response?.data?.error || 'Failed to send broadcast' });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className={`min-h-screen pb-24 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <div className={`sticky top-0 z-10 px-4 py-3 border-b ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className={`p-2 -ml-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} title="Go back">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Broadcast Notifications
                    </h1>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-6">
                <div className={`p-6 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-sm border ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-pink-100 dark:bg-pink-900/30 text-pink-500 rounded-xl">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Send Email Broadcast</h2>
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Send a notification email to your users.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSend} className="space-y-4">
                        <div>
                            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                TARGET AUDIENCE
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setTarget('customers')}
                                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                                        target === 'customers'
                                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/10 text-pink-600'
                                        : `${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`
                                    }`}
                                >
                                    <Users className="w-4 h-4" />
                                    Customers
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTarget('all')}
                                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                                        target === 'all'
                                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/10 text-pink-600'
                                        : `${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`
                                    }`}
                                >
                                    <Users className="w-4 h-4" />
                                    All Users
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="subject" className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                EMAIL SUBJECT
                            </label>
                            <input
                                id="subject"
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className={`w-full p-3 rounded-xl border outline-none transition-all ${
                                    isDark 
                                    ? 'bg-slate-900 border-slate-700 text-white focus:border-pink-500' 
                                    : 'bg-white border-gray-200 text-gray-900 focus:border-pink-500'
                                }`}
                                placeholder="E.g., New Collection Launch!"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                MESSAGE CONTENT (HTML SUPPORTED)
                            </label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className={`w-full h-48 p-3 rounded-xl border outline-none transition-all resize-none ${
                                    isDark 
                                    ? 'bg-slate-900 border-slate-700 text-white focus:border-pink-500' 
                                    : 'bg-white border-gray-200 text-gray-900 focus:border-pink-500'
                                }`}
                                placeholder="Write your message here..."
                                required
                            />
                        </div>

                        {status && (
                            <div className={`p-4 rounded-xl flex items-center gap-3 ${
                                status.type === 'success' 
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' 
                                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                                {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                <p className="text-sm">{status.msg}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={sending}
                            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-white font-semibold transition-all ${
                                sending ? 'opacity-70 cursor-not-allowed bg-gray-400' : 'bg-pink-500 hover:bg-pink-600 shadow-lg shadow-pink-500/20'
                            }`}
                        >
                            <Send className="w-4 h-4" />
                            {sending ? 'Sending...' : 'Send Broadcast Now'}
                        </button>
                    </form>
                </div>

                <div className={`mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 flex items-start gap-3`}>
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                        <strong>Developer Note:</strong> This will send an email to all active users via Resend. Use responsibly to avoid being flagged as spam. Ensure your <code>RESEND_API_KEY</code> is correctly set in your environment variables.
                    </p>
                </div>
            </div>
        </div>
    );
}
