'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellRing,
  Send,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';
import { requestAndRegisterPush, dispatchTestNotification } from '../PushNotificationManager';

interface NotificationCenterProps {
  emailNotifications: boolean;
  smsNotifications: boolean;
  whatsappNotifications: boolean;
  onPreferenceChange: (key: string, value: boolean) => void;
}

export default function NotificationCenter({
  emailNotifications,
  smsNotifications,
  whatsappNotifications,
  onPreferenceChange,
}: NotificationCenterProps) {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [isRequesting, setIsRequesting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!('Notification' in window)) {
        setPermission('unsupported');
      } else {
        setPermission(Notification.permission);
      }
    }
  }, []);

  const handleEnablePush = async () => {
    setIsRequesting(true);
    setFeedback(null);
    try {
      const res = await requestAndRegisterPush();
      setPermission(res.permission);
      if (res.success) {
        setFeedback({
          type: 'success',
          message: 'Notifications enabled for this device.',
        });
        setTimeout(() => setFeedback(null), 4000);
      } else if (res.permission === 'denied') {
        setFeedback({
          type: 'error',
          message: 'Notifications blocked. Allow notifications in your browser or phone settings.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not enable notifications.';
      setFeedback({
        type: 'error',
        message: msg,
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSendTest = async () => {
    setIsTesting(true);
    setFeedback(null);
    try {
      const res = await dispatchTestNotification();
      if (res.success) {
        setFeedback({
          type: 'success',
          message: 'Test notification sent!',
        });
        setTimeout(() => setFeedback(null), 4000);
      } else {
        setFeedback({
          type: 'error',
          message: res.message || 'Could not send test.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send test alert.';
      setFeedback({
        type: 'error',
        message: msg,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const isGranted = permission === 'granted';
  const isDenied = permission === 'denied';

  return (
    <div className="space-y-6">
      {/* Push Notification Card */}
      <div className="p-5 bg-surface dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-5 transition-colors">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center shrink-0">
              {isGranted ? <BellRing size={15} /> : <Bell size={15} />}
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Push Notifications
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Instant delivery & order updates
              </p>
            </div>
          </div>

          <div>
            {isGranted && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            )}
            {!isGranted && !isDenied && (
              <button
                onClick={handleEnablePush}
                disabled={isRequesting || permission === 'unsupported'}
                className="px-4 py-2 bg-slate-900 hover:bg-brand-emerald dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
              >
                {isRequesting ? (
                  <>
                    <Loader2 size={11} className="animate-spin" />
                    <span>Enabling...</span>
                  </>
                ) : (
                  <span>Enable</span>
                )}
              </button>
            )}
            {isDenied && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60">
                <AlertCircle size={10} />
                Blocked
              </span>
            )}
          </div>
        </div>

        {/* Feedback Alert */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={`p-3 rounded-xl text-[11px] font-medium flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-100 dark:border-rose-800'
              }`}
            >
              {feedback.type === 'success' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
              <span>{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Discreet Test Trigger for Active Mode */}
        {isGranted && (
          <div className="pt-1 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              Want to check notifications?
            </span>
            <button
              onClick={handleSendTest}
              disabled={isTesting}
              className="text-[10px] font-black uppercase tracking-wider text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white inline-flex items-center gap-1.5 py-1 transition-colors disabled:opacity-50"
            >
              {isTesting ? <Loader2 size={11} className="animate-spin" /> : <Send size={10} />}
              <span>Send test alert</span>
            </button>
          </div>
        )}

        {isDenied && (
          <div className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-800/40 flex items-start gap-2">
            <AlertCircle size={13} className="mt-0.5 shrink-0" />
            <span>Turn notifications back on in your phone or browser settings.</span>
          </div>
        )}
      </div>

      {/* Multi-Channel Preferences */}
      <div className="bg-surface dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4 transition-colors">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
          Other Notification Channels
        </h4>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {[
            {
              id: 'email_notifications',
              label: 'Email Alerts',
              desc: 'Invoices and receipts',
              enabled: emailNotifications,
            },
            {
              id: 'sms_notifications',
              label: 'SMS Alerts',
              desc: 'Carrier dispatch texts',
              enabled: smsNotifications,
            },
            {
              id: 'whatsapp_notifications',
              label: 'WhatsApp Alerts',
              desc: 'Direct order status updates',
              enabled: whatsappNotifications,
            },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 first:pt-1 last:pb-1">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.label}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
              <ToggleSwitch
                enabled={item.enabled}
                onChange={() => onPreferenceChange(item.id, !item.enabled)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
