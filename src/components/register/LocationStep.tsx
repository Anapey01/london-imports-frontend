import { VendorFormData } from '@/types/vendor';

interface LocationStepProps {
    formData: VendorFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    theme: string;
}

export const LocationStep: React.FC<LocationStepProps> = ({ formData, handleChange, theme }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-medium mb-6">Location</h2>
            <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1">
                    <label htmlFor="region" className="text-xs font-semibold uppercase tracking-wider opacity-70">Region</label>
                    <select
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-pink-500 transition-all outline-none ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}
                    >
                        <option value="">Select Region</option>
                        <option value="Greater Accra">Greater Accra</option>
                        <option value="Ashanti">Ashanti</option>
                        <option value="Central">Central</option>
                        <option value="Western">Western</option>
                        {/* Add others */}
                    </select>
                </div>
                <div className="space-y-1">
                    <label htmlFor="city" className="text-xs font-semibold uppercase tracking-wider opacity-70">City</label>
                    <input
                        id="city"
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-pink-500 transition-all outline-none ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}
                    />
                </div>
            </div>
            <div className="space-y-1">
                <label htmlFor="address" className="text-xs font-semibold uppercase tracking-wider opacity-70">Address</label>
                <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={2}
                    className={`w-full px-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-pink-500 transition-all outline-none resize-none ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}
                />
            </div>
        </div>
    );
};
