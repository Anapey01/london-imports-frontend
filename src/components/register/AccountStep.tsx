import { VendorFormData } from '@/types/vendor';

interface AccountStepProps {
    formData: VendorFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    theme: string;
}

export const AccountStep: React.FC<AccountStepProps> = ({ formData, handleChange, theme }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-medium mb-6">Create Your Account</h2>
            <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1">
                    <label htmlFor="first_name" className="text-xs font-semibold uppercase tracking-wider opacity-70">First Name</label>
                    <input
                        id="first_name"
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-pink-500 transition-all outline-none ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}
                    />
                </div>
                <div className="space-y-1">
                    <label htmlFor="last_name" className="text-xs font-semibold uppercase tracking-wider opacity-70">Last Name</label>
                    <input
                        id="last_name"
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-pink-500 transition-all outline-none ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}
                    />
                </div>
            </div>
            <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider opacity-70">Email</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-pink-500 transition-all outline-none ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}
                />
            </div>
            <div className="space-y-1">
                <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider opacity-70">Phone</label>
                <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0XX XXX XXXX"
                    className={`w-full px-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-pink-500 transition-all outline-none ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}
                />
            </div>
            <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1">
                    <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider opacity-70">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-pink-500 transition-all outline-none ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}
                    />
                </div>
                <div className="space-y-1">
                    <label htmlFor="password_confirm" className="text-xs font-semibold uppercase tracking-wider opacity-70">Confirm</label>
                    <input
                        id="password_confirm"
                        type="password"
                        name="password_confirm"
                        value={formData.password_confirm}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-pink-500 transition-all outline-none ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}
                    />
                </div>
            </div>
        </div>
    );
};
