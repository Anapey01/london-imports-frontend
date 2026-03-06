interface ToggleSwitchProps {
    enabled: boolean;
    onChange: () => void;
    label: string;
    description: string;
    isDark: boolean;
}

const ToggleSwitch = ({ enabled, onChange, label, description, isDark }: ToggleSwitchProps) => (
    <div className="flex items-center justify-between py-4">
        <div>
            <p className={`font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>{label}</p>
            <p className={`text-xs font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{description}</p>
        </div>
        <button
            onClick={onChange}
            aria-label={label}
            className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-pink-500' : isDark ? 'bg-slate-700' : 'bg-gray-200'}`}
        >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : ''}`} />
        </button>
    </div>
);

export default ToggleSwitch;
