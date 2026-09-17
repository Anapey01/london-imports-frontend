export const getNetworkBadgeStyle = (network: string): string => {
    const net = (network || '').toUpperCase();
    if (net === 'MTN') return 'bg-amber-100 text-amber-900 border-amber-200';
    if (net === 'TELECEL') return 'bg-red-100 text-red-900 border-red-200';
    if (net === 'AT') return 'bg-blue-100 text-blue-900 border-blue-200';
    return 'bg-slate-100 text-slate-900 border-slate-200';
};
