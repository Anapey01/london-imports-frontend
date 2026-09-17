'use client';

import React from 'react';

interface StoreSettingsTabProps {
  storeNameInput: string;
  setStoreNameInput: (v: string) => void;
  slugInput: string;
  setSlugInput: (v: string) => void;
  momoNetworkInput: string;
  setMomoNetworkInput: (v: string) => void;
  momoNumberInput: string;
  setMomoNumberInput: (v: string) => void;
  handleSettingsSave: (e: React.FormEvent) => void;
  settingsLoading: boolean;
  settingsSuccess: boolean;
  settingsError: string | null;
  agentEmail?: string;
}

export default function StoreSettingsTab({
  storeNameInput,
  setStoreNameInput,
  slugInput,
  setSlugInput,
  momoNetworkInput,
  setMomoNetworkInput,
  momoNumberInput,
  setMomoNumberInput,
  handleSettingsSave,
  settingsLoading,
  settingsSuccess,
  settingsError,
  agentEmail
}: StoreSettingsTabProps) {
  return (
    <div className="space-y-6 max-w-xl">
      <div className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-content-primary">
          Store & Account Settings
        </h3>
        <p className="text-content-secondary text-xs leading-relaxed font-normal">
          Update your public shop name, custom storefront link URL, and Mobile Money payout account.
        </p>
      </div>

      <form onSubmit={handleSettingsSave} className="space-y-5">
        {/* Shop Name */}
        <div className="border border-border-standard p-4 space-y-3 bg-slate-50">
          <label className="block text-xs font-bold text-content-primary">
            Shop / Business Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={storeNameInput}
            onChange={(e) => setStoreNameInput(e.target.value)}
            placeholder="e.g. ERICHECK GH"
            className="w-full bg-surface border border-slate-200 rounded-none px-3 py-2 text-sm font-semibold focus:outline-none"
          />
          <p className="text-[11px] text-content-secondary">
            Displayed on your public storefront header, browser title, and customer receipts.
          </p>
        </div>

        {/* Storefront Slug */}
        <div className="border border-border-standard p-4 space-y-3 bg-slate-50">
          <label className="block text-xs font-bold text-content-primary">
            Storefront Web Address (Slug) <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <span className="bg-slate-200 border border-r-0 border-slate-200 px-3 py-2 text-xs font-mono text-content-secondary select-none">
              /checker/s/
            </span>
            <input
              type="text"
              required
              value={slugInput}
              onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              placeholder="ericheck-gh"
              className="flex-grow bg-surface border border-slate-200 rounded-none px-3 py-2 text-sm font-mono font-semibold focus:outline-none"
            />
          </div>
          <p className="text-[11px] text-content-secondary">
            Lowercase letters, numbers, and hyphens only. Changing this changes your shareable link.
          </p>
        </div>

        {/* Mobile Money Details */}
        <div className="border border-border-standard p-4 space-y-4 bg-slate-50">
          <div>
            <h4 className="text-xs font-bold text-content-primary uppercase tracking-wider mb-1">
              Mobile Money Payout Account
            </h4>
            <p className="text-[11px] text-content-secondary">
              The MoMo account where your withdrawal earnings will be disbursed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-content-primary mb-1">
                Network Provider <span className="text-red-500">*</span>
              </label>
              <select
                value={momoNetworkInput}
                onChange={(e) => setMomoNetworkInput(e.target.value)}
                className="w-full bg-surface border border-slate-200 rounded-none px-3 py-2 text-sm font-semibold focus:outline-none"
              >
                <option value="MTN">MTN Mobile Money</option>
                <option value="Telecel">Telecel Cash (Vodafone)</option>
                <option value="AT">AT Money (AirtelTigo)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-content-primary mb-1">
                MoMo Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={momoNumberInput}
                onChange={(e) => setMomoNumberInput(e.target.value)}
                placeholder="024XXXXXXX"
                className="w-full bg-surface border border-slate-200 rounded-none px-3 py-2 text-sm font-semibold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Registered Email (Read-Only) */}
        <div className="border border-border-standard p-4 bg-slate-50 flex justify-between items-center">
          <div>
            <span className="block text-xs font-bold text-content-primary">
              Account Email Address
            </span>
            <span className="text-[11px] text-content-secondary">
              Used for account login and withdrawal notifications
            </span>
          </div>
          <span className="font-mono text-xs text-content-secondary font-bold">
            {agentEmail || '—'}
          </span>
        </div>

        {/* Feedback Messages */}
        {settingsSuccess && (
          <div className="p-3 bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald font-bold rounded-none text-xs uppercase tracking-wide">
            Store settings updated successfully!
          </div>
        )}

        {settingsError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 font-bold rounded-none text-xs">
            {settingsError}
          </div>
        )}

        {/* Save Button */}
        <button
          type="submit"
          disabled={settingsLoading}
          className="w-full bg-content-primary text-surface py-3 px-6 rounded-none font-bold text-xs uppercase tracking-widest hover:bg-brand-emerald transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {settingsLoading ? 'Saving Changes...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
