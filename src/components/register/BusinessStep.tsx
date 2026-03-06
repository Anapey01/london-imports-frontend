import { VendorFormData } from '@/types/vendor';

interface BusinessStepProps {
    formData: VendorFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    theme: string;
}

export const BusinessStep: React.FC<BusinessStepProps> = ({ formData, handleChange, theme }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-medium mb-6">Business Details</h2>
            <div className="space-y-1">
                <label htmlFor="business_name_input" className="text-xs font-semibold uppercase tracking-wider opacity-70">Business Name</label>
                <input
                    id="business_name_input"
                    type="text"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    placeholder="Your store name"
                    className={`w-full px-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-pink-500 transition-all outline-none ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}
                />
            </div>
            <div className="space-y-1">
                <label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider opacity-70">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-pink-500 transition-all outline-none resize-none ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}
                />
            </div>
            <div className="space-y-1">
                <label htmlFor="whatsapp" className="text-xs font-semibold uppercase tracking-wider opacity-70">WhatsApp</label>
                <input
                    id="whatsapp"
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-pink-500 transition-all outline-none ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}
                />
            </div>
        </div>
    );
};
