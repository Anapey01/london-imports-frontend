interface ToggleSwitchProps {
    enabled: boolean;
    onChange: () => void;
    label?: string;
    description?: string;
}

const ToggleSwitch = ({ enabled, onChange, label, description }: ToggleSwitchProps) => (
    <div className={`flex items-center justify-between ${label || description ? 'py-6' : ''}`}>
        {(label || description) && (
            <div className="space-y-1">
                {label && <p className="text-[11px] font-black uppercase tracking-widest text-content-primary">{label}</p>}
                {description && <p className="text-[10px] font-black uppercase tracking-widest text-content-secondary/80 dark:text-content-secondary/70 italic">{description}</p>}
            </div>
        )}
        <button
            onClick={onChange}
            aria-label={label || 'Toggle'}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 ${enabled ? 'bg-slate-900 dark:bg-white' : 'bg-slate-200 dark:bg-slate-700'}`}
        >
            <span className={`absolute top-1 left-1 w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${enabled ? 'translate-x-5 bg-white dark:bg-slate-900' : 'bg-white'}`} />
        </button>
    </div>
);

export default ToggleSwitch;
