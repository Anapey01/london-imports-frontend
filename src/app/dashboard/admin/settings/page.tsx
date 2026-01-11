/**
 * London's Imports - Admin Settings
 * Site configuration and settings
 */
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI } from '@/lib/api';

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
    });

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
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className={`rounded-xl border p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
            <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
            <div className="space-y-4">{children}</div>
        </div>
    );

    interface InputFieldProps {
        label: string;
        value: string | number;
        onChange: (value: string) => void;
        type?: string;
        placeholder?: string;
    }

    const InputField = ({ label, value, onChange, type = 'text', placeholder = '' }: InputFieldProps) => (
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
    }

    const Toggle = ({ label, description, checked, onChange }: ToggleProps) => (
        <div className="flex items-center justify-between py-2">
            <div>
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{label}</p>
                {description && <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{description}</p>}
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-pink-500' : isDark ? 'bg-slate-700' : 'bg-gray-200'}`}
            >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'left-7' : 'left-1'}`}></div>
            </button>
        </div>
    );

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
                <Section title="General">
                    <InputField
                        label="Site Name"
                        value={settings.siteName}
                        onChange={(v: string) => setSettings({ ...settings, siteName: v })}
                    />
                    <InputField
                        label="Site Description"
                        value={settings.siteDescription}
                        onChange={(v: string) => setSettings({ ...settings, siteDescription: v })}
                    />
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Currency</label>
                        <select
                            value={settings.currency}
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
                <Section title="Contact Information">
                    <InputField
                        label="Support Email"
                        value={settings.supportEmail}
                        onChange={(v: string) => setSettings({ ...settings, supportEmail: v })}
                        type="email"
                    />
                    <InputField
                        label="Support Phone"
                        value={settings.supportPhone}
                        onChange={(v: string) => setSettings({ ...settings, supportPhone: v })}
                        type="tel"
                    />
                </Section>

                {/* User Settings */}
                <Section title="User & Registration">
                    <Toggle
                        label="Allow New Registrations"
                        description="Enable new customer registrations"
                        checked={settings.enableNewUserRegistration}
                        onChange={(v: boolean) => setSettings({ ...settings, enableNewUserRegistration: v })}
                    />
                    <Toggle
                        label="Allow Vendor Registrations"
                        description="Enable vendors to register and sell"
                        checked={settings.enableVendorRegistration}
                        onChange={(v: boolean) => setSettings({ ...settings, enableVendorRegistration: v })}
                    />
                    <Toggle
                        label="Require Email Verification"
                        description="Users must verify email before login"
                        checked={settings.requireEmailVerification}
                        onChange={(v: boolean) => setSettings({ ...settings, requireEmailVerification: v })}
                    />
                </Section>

                {/* Notification Settings */}
                <Section title="Notifications">
                    <Toggle
                        label="Order Email Notifications"
                        description="Send email for order updates"
                        checked={settings.enableOrderNotifications}
                        onChange={(v: boolean) => setSettings({ ...settings, enableOrderNotifications: v })}
                    />
                    <Toggle
                        label="SMS Notifications"
                        description="Send SMS for important updates"
                        checked={settings.enableSMSNotifications}
                        onChange={(v: boolean) => setSettings({ ...settings, enableSMSNotifications: v })}
                    />
                </Section>

                {/* Order Settings */}
                <Section title="Order Settings">
                    <InputField
                        label="Minimum Order Amount (GHS)"
                        value={settings.minOrderAmount}
                        onChange={(v: string) => setSettings({ ...settings, minOrderAmount: parseFloat(v) || 0 })}
                        type="number"
                    />
                    <InputField
                        label="Maximum Order Amount (GHS)"
                        value={settings.maxOrderAmount}
                        onChange={(v: string) => setSettings({ ...settings, maxOrderAmount: parseFloat(v) || 0 })}
                        type="number"
                    />
                    <InputField
                        label="Delivery Fee (GHS)"
                        value={settings.deliveryFee}
                        onChange={(v: string) => setSettings({ ...settings, deliveryFee: parseFloat(v) || 0 })}
                        type="number"
                    />
                    <InputField
                        label="Free Delivery Threshold (GHS)"
                        value={settings.freeDeliveryThreshold}
                        onChange={(v: string) => setSettings({ ...settings, freeDeliveryThreshold: parseFloat(v) || 0 })}
                        type="number"
                    />
                </Section>

                {/* Danger Zone */}
                <Section title="Danger Zone">
                    <Toggle
                        label="Maintenance Mode"
                        description="Disable site access for non-admins"
                        checked={settings.maintenanceMode}
                        onChange={(v: boolean) => setSettings({ ...settings, maintenanceMode: v })}
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
        </div>
    );
}
