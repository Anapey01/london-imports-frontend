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
                {description && <p className="text-[10px] font-black uppercase tracking-widest text-content-secondary/60 italic">{description}</p>}
            </div>
        )}
        <button
            onClick={onChange}
            aria-label={label || 'Toggle'}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${enabled ? 'bg-brand-emerald shadow-lg shadow-brand-emerald/20' : 'bg-surface-card border border-border-standard'}`}
        >
            <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${enabled ? 'translate-x-6' : 'bg-content-secondary/40'}`} />
        </button>
    </div>
);

export default ToggleSwitch;
