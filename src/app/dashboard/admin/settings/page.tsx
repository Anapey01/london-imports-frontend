/**
 * London's Imports - Admin Settings
 * Site configuration and settings
 */
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI } from '@/lib/api';
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import { AuraAlert, AlertType } from '@/components/AuraAlert';
import { AnimatePresence } from 'framer-motion';

// --- Helper Components Defined Outside to Prevent Re-renders ---

interface InputFieldProps {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    isDark: boolean;
}

const InputField = ({ label, value, onChange, type = 'text', placeholder = '', isDark }: InputFieldProps) => (
    <div>
        <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full px-4 py-2.5 rounded-lg border text-sm ${isDark
                ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
                }`}
        />
    </div>
);

interface ToggleProps {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    isDark: boolean;
}

const Toggle = ({ label, description, checked, onChange, isDark }: ToggleProps) => (
    <div className="flex items-center justify-between py-2">
        <div>
            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{label}</p>
            {description && <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{description}</p>}
        </div>
        <button
            onClick={() => onChange(!checked)}
            aria-label={label}
            className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-pink-500' : isDark ? 'bg-slate-700' : 'bg-gray-200'}`}
        >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'left-7' : 'left-1'}`}></div>
        </button>
    </div>
);

const Section = ({ title, children, isDark }: { title: string; children: React.ReactNode; isDark: boolean }) => (
    <div className={`rounded-xl border p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
        <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

// --- Main Component ---

export default function AdminSettingsPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        siteName: "London's Imports",
        siteDescription: 'Premium marketplace for quality products from Ghana',
        supportEmail: 'support@londonsimports.com',
        supportPhone: '+233 XX XXX XXXX',
        currency: 'GHS',
        enableNewUserRegistration: true,
        enableVendorRegistration: true,
        requireEmailVerification: false,
        enableOrderNotifications: true,
        enableSMSNotifications: false,
        maintenanceMode: false,
        minOrderAmount: 10,
        maxOrderAmount: 10000,
        deliveryFee: 15,
        freeDeliveryThreshold: 200,
        baseOrderCount: 1200,
        baseProductCount: 500,
        baseAuthenticityRate: 99.9,
    });

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant?: 'danger' | 'warning';
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {}
    });

    const [alerts, setAlerts] = useState<Array<{ id: string; message: string; type: AlertType }>>([]);

    const addAlert = (message: string, type: AlertType = 'success') => {
        const id = Math.random().toString(36).substring(7);
        setAlerts(prev => [...prev, { id, message, type }]);
    };

    const removeAlert = (id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const response = await adminAPI.settings();
                setSettings(response.data);
            } catch (err) {
                console.error('Failed to load settings:', err);
            }
        };
        loadSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await adminAPI.updateSettings(settings);
            addAlert('Settings saved successfully!');
        } catch (error) {
            console.error('Failed to save settings:', error);
            addAlert('Failed to save settings. Please try again.', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Settings</h2>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600 transition-colors disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Settings */}
                <Section title="General" isDark={isDark}>
                    <InputField
                        label="Site Name"
                        value={settings.siteName}
                        onChange={(v: string) => setSettings({ ...settings, siteName: v })}
                        isDark={isDark}
                    />
                    <InputField
                        label="Site Description"
                        value={settings.siteDescription}
                        onChange={(v: string) => setSettings({ ...settings, siteDescription: v })}
                        isDark={isDark}
                    />
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Currency</label>
                        <select
                            value={settings.currency}
                            aria-label="Currency"
                            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                            className={`w-full px-4 py-2.5 rounded-lg border text-sm ${isDark
                                ? 'bg-slate-800 border-slate-700 text-white'
                                : 'bg-white border-gray-200 text-gray-900'
                                }`}
                        >
                            <option value="GHS">GHS (Ghanaian Cedi)</option>
                            <option value="USD">USD (US Dollar)</option>
                            <option value="EUR">EUR (Euro)</option>
                            <option value="GBP">GBP (British Pound)</option>
                        </select>
                    </div>
                </Section>

                {/* Contact Settings */}
                <Section title="Contact Information" isDark={isDark}>
                    <InputField
                        label="Support Email"
                        value={settings.supportEmail}
                        onChange={(v: string) => setSettings({ ...settings, supportEmail: v })}
                        type="email"
                        isDark={isDark}
                    />
                    <InputField
                        label="Support Phone"
                        value={settings.supportPhone}
                        onChange={(v: string) => setSettings({ ...settings, supportPhone: v })}
                        type="tel"
                        isDark={isDark}
                    />
                </Section>

                {/* User Settings */}
                <Section title="User & Registration" isDark={isDark}>
                    <Toggle
                        label="Allow New Registrations"
                        description="Enable new customer registrations"
                        checked={settings.enableNewUserRegistration}
                        onChange={(v: boolean) => setSettings({ ...settings, enableNewUserRegistration: v })}
                        isDark={isDark}
                    />
                    <Toggle
                        label="Allow Vendor Registrations"
                        description="Enable vendors to register and sell"
                        checked={settings.enableVendorRegistration}
                        onChange={(v: boolean) => setSettings({ ...settings, enableVendorRegistration: v })}
                        isDark={isDark}
                    />
                    <Toggle
                        label="Require Email Verification"
                        description="Users must verify email before login"
                        checked={settings.requireEmailVerification}
                        onChange={(v: boolean) => setSettings({ ...settings, requireEmailVerification: v })}
                        isDark={isDark}
                    />
                </Section>

                {/* Notification Settings */}
                <Section title="Notifications" isDark={isDark}>
                    <Toggle
                        label="Order Email Notifications"
                        description="Send email for order updates"
                        checked={settings.enableOrderNotifications}
                        onChange={(v: boolean) => setSettings({ ...settings, enableOrderNotifications: v })}
                        isDark={isDark}
                    />
                    <Toggle
                        label="SMS Notifications"
                        description="Send SMS for important updates"
                        checked={settings.enableSMSNotifications}
                        onChange={(v: boolean) => setSettings({ ...settings, enableSMSNotifications: v })}
                        isDark={isDark}
                    />
                </Section>

                {/* Order Settings */}
                <Section title="Order Settings" isDark={isDark}>
                    <InputField
                        label="Minimum Order Amount (GHS)"
                        value={settings.minOrderAmount}
                        onChange={(v: string) => setSettings({ ...settings, minOrderAmount: parseFloat(v) || 0 })}
                        type="number"
                        isDark={isDark}
                    />
                    <InputField
                        label="Maximum Order Amount (GHS)"
                        value={settings.maxOrderAmount}
                        onChange={(v: string) => setSettings({ ...settings, maxOrderAmount: parseFloat(v) || 0 })}
                        type="number"
                        isDark={isDark}
                    />
                    <InputField
                        label="Delivery Fee (GHS)"
                        value={settings.deliveryFee}
                        onChange={(v: string) => setSettings({ ...settings, deliveryFee: parseFloat(v) || 0 })}
                        type="number"
                        isDark={isDark}
                    />
                    <InputField
                        label="Free Delivery Threshold (GHS)"
                        value={settings.freeDeliveryThreshold}
                        onChange={(v: string) => setSettings({ ...settings, freeDeliveryThreshold: parseFloat(v) || 0 })}
                        type="number"
                        isDark={isDark}
                    />
                </Section>

                {/* Impact Stats */}
                <Section title="Brand Impact (Public Stats)" isDark={isDark}>
                    <InputField
                        label="Base Order Count Offset"
                        value={settings.baseOrderCount}
                        onChange={(v: string) => setSettings({ ...settings, baseOrderCount: parseInt(v) || 0 })}
                        type="number"
                        isDark={isDark}
                    />
                    <InputField
                        label="Base Product Count Offset"
                        value={settings.baseProductCount}
                        onChange={(v: string) => setSettings({ ...settings, baseProductCount: parseInt(v) || 0 })}
                        type="number"
                        isDark={isDark}
                    />
                    <InputField
                        label="Trust Score / Authenticity Rate (%)"
                        value={settings.baseAuthenticityRate}
                        onChange={(v: string) => setSettings({ ...settings, baseAuthenticityRate: parseFloat(v) || 0 })}
                        type="number"
                        isDark={isDark}
                    />
                </Section>

                {/* Data Integrity */}
                <Section title="System Maintenance" isDark={isDark}>
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Synchronize Product Reservations
                            </p>
                            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                Updates &quot;X reserved&quot; counts on all products based on actual paid orders.
                                <br />Use this if counts seem incorrect.
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setConfirmModal({
                                    isOpen: true,
                                    title: 'Recalculate Reservations',
                                    message: 'This will recalculate all product reservation counts based on real paid orders. Continue?',
                                    variant: 'warning',
                                    onConfirm: async () => {
                                        try {
                                            await adminAPI.recalculateReservations();
                                            addAlert('Successfully recalculated all reservation counts!');
                                        } catch (err) {
                                            console.error(err);
                                            addAlert('Failed to recalculate: ' + (err as Error).message, 'error');
                                        }
                                    }
                                });
                            }}
                            className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
                        >
                            Run Cleanup
                        </button>
                    </div>
                </Section>

                {/* Danger Zone */}
                <Section title="Danger Zone" isDark={isDark}>
                    <Toggle
                        label="Maintenance Mode"
                        description="Disable site access for non-admins"
                        checked={settings.maintenanceMode}
                        onChange={(v: boolean) => setSettings({ ...settings, maintenanceMode: v })}
                        isDark={isDark}
                    />
                    <div className={`p-4 rounded-lg border-2 border-dashed ${isDark ? 'border-red-900/50' : 'border-red-200'}`}>
                        <p className={`text-sm font-medium text-red-500 mb-2`}>Clear All Data</p>
                        <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            This action cannot be undone. All data will be permanently deleted.
                        </p>
                        <button className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors">
                            Clear Data
                        </button>
                    </div>
                </Section>
            </div>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
            />

            {/* Notification Toasts */}
            <div className="fixed bottom-8 left-0 right-0 z-[110] pointer-events-none flex flex-col items-center">
                <AnimatePresence mode="popLayout">
                    {alerts.map(alert => (
                        <AuraAlert
                            key={alert.id}
                            id={alert.id}
                            message={alert.message}
                            type={alert.type}
                            onClose={removeAlert}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
