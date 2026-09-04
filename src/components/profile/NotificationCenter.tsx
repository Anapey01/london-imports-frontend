'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellRing,
  BellOff,
  ShieldCheck,
  Smartphone,
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
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAndroid(/Android/i.test(navigator.userAgent));
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
          message: 'Notifications enabled! This device will now receive real-time updates.',
        });
        setTimeout(() => setFeedback(null), 5000);
      } else if (res.permission === 'denied') {
        setFeedback({
          type: 'error',
          message: 'Notifications were blocked. Open App Info > Manage notifications in Android settings to allow.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to request notification permission.';
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
          message: 'Test notification sent! Check your notification shade.',
        });
        setTimeout(() => setFeedback(null), 5000);
      } else {
        setFeedback({
          type: 'error',
          message: res.message || 'Could not dispatch test alert.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to trigger test notification.';
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
  const isDefault = permission === 'default';

  return (
    <div className="space-y-6">
      {/* Primary Push Notification Card */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-6">
        {/* Card Header & Status */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center">
                {isGranted ? <BellRing size={14} /> : isDenied ? <BellOff size={14} /> : <Bell size={14} />}
              </div>
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                Device Push Notifications
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-md pt-1">
              Receive real-time flight milestone alerts, customs clearance notices, and doorstep delivery updates.
            </p>
          </div>

          {/* Status Badge */}
          <div>
            {isGranted && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            )}
            {isDefault && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                Not Enabled
              </span>
            )}
            {isDenied && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                <AlertCircle size={10} />
                Blocked
              </span>
            )}
            {permission === 'unsupported' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-400">
                Unsupported
              </span>
            )}
          </div>
        </div>

        {/* Feedback message if any */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={`p-3 rounded-xl text-[11px] font-medium flex items-center gap-2.5 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-100 dark:border-rose-800'
              }`}
            >
              {feedback.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              <span>{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {!isGranted && (
            <button
              onClick={handleEnablePush}
              disabled={isRequesting || isDenied || permission === 'unsupported'}
              className="px-6 py-3 bg-slate-900 hover:bg-brand-emerald text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {isRequesting ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  <span>Requesting...</span>
                </>
              ) : (
                <>
                  <Smartphone size={12} />
                  <span>Enable Push Alerts</span>
                </>
              )}
            </button>
          )}

          {isGranted && (
            <button
              onClick={handleSendTest}
              disabled={isTesting}
              className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-900 dark:hover:border-white text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isTesting ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  <span>Sending Alert...</span>
                </>
              ) : (
                <>
                  <Send size={11} />
                  <span>Send Test Alert</span>
                </>
              )}
            </button>
          )}

          {isDenied && (
            <div className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-800/50 flex items-start gap-2">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>
                To re-enable, go to your phone <strong>Settings &rarr; Apps &rarr; London&apos;s Imports &rarr; Manage notifications</strong> and turn notifications ON.
              </span>
            </div>
          )}
        </div>

        {/* Technical Specs (Minimalist Editorial) */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-2 text-[10px] text-slate-500 font-mono">
          <div className="flex justify-between items-center">
            <span>Client Environment:</span>
            <span className="text-slate-900 dark:text-white font-medium">
              {isAndroid ? 'Android Application (TWA)' : 'Desktop / Web Browser'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Channel Security:</span>
            <span className="text-brand-emerald font-semibold inline-flex items-center gap-1">
              <ShieldCheck size={12} /> Verified AssetLink (Delegation Active)
            </span>
          </div>
        </div>
      </div>

      {/* Multi-Channel Preferences */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Other Notification Channels
        </h4>
        <div className="space-y-4">
          {[
            {
              id: 'email_notifications',
              label: 'Email Alerts',
              desc: 'Order invoices and official payment receipts',
              enabled: emailNotifications,
            },
            {
              id: 'sms_notifications',
              label: 'SMS Alerts',
              desc: 'Carrier dispatch text messages in Ghana',
              enabled: smsNotifications,
            },
            {
              id: 'whatsapp_notifications',
              label: 'WhatsApp Alerts',
              desc: 'Direct concierge status messages',
              enabled: whatsappNotifications,
            },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between group">
              <div className="max-w-[200px] sm:max-w-xs">
                <p className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                  {item.label}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">
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
