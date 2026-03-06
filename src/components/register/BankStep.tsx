import { VendorFormData } from '@/types/vendor';

interface BankStepProps {
    formData: VendorFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    theme: string;
}

export const BankStep: React.FC<BankStepProps> = ({ formData, handleChange, theme }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-medium mb-6">Payout Details</h2>
            <div className={`p-4 rounded-xl text-sm mb-6 ${theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-pink-50 text-pink-700'}`}>
                Your earnings will be sent here. Ensure details are accurate.
            </div>
            <div className="space-y-1">
                <label htmlFor="bank_name" className="text-xs font-semibold uppercase tracking-wider opacity-70">Bank / Provider</label>
                <select
                    id="bank_name"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-pink-500 transition-all outline-none ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}
                >
                    <option value="">Select Provider</option>
                    <option value="MTN Mobile Money">MTN Mobile Money</option>
                    <option value="Vodafone Cash">Vodafone Cash</option>
                    <option value="GcB Bank">GCB Bank</option>
                    <option value="Ecobank">Ecobank</option>
                    {/* Add others */}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1">
                    <label htmlFor="bank_account_number" className="text-xs font-semibold uppercase tracking-wider opacity-70">Account Number</label>
                    <input
                        id="bank_account_number"
                        type="text"
                        name="bank_account_number"
                        value={formData.bank_account_number}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-pink-500 transition-all outline-none ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}
                    />
                </div>
                <div className="space-y-1">
                    <label htmlFor="bank_account_name" className="text-xs font-semibold uppercase tracking-wider opacity-70">Account Name</label>
                    <input
                        id="bank_account_name"
                        type="text"
                        name="bank_account_name"
                        value={formData.bank_account_name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-pink-500 transition-all outline-none ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}
                    />
                </div>
            </div>
        </div>
    );
};
