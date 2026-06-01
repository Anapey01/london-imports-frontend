export function FormattedDescription({ text }: { text: string }) {
    if (!text) return null;
    
    // Split into segments, cleaning up extra whitespace
    const segments = text.split('\n').map(s => s.trim()).filter(Boolean);
    
    return (
        <div className="flex flex-col gap-4">
            {segments.map((segment, i) => {
                // 1. Handle Visual Separators (——)
                if (segment.includes('——')) {
                    return (
                        <div key={i} className="w-full py-4 flex items-center gap-4">
                            <div className="h-px flex-1 bg-border-standard opacity-50" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-content-secondary whitespace-nowrap">
                                {segment.replace(/—/g, '').trim()}
                            </span>
                            <div className="h-px flex-1 bg-border-standard opacity-50" />
                        </div>
                    );
                }

                // 2. Handle Multi-part line with | (e.g. "Title | Subtitle")
                if (segment.includes('|')) {
                    return (
                        <div key={i} className="flex flex-wrap gap-x-4 gap-y-2 mb-2">
                            {segment.split('|').map((part, pi) => (
                                <span key={pi} className="text-[11px] font-bold uppercase tracking-widest text-[#006B5A] bg-[#006B5A]/5 px-3 py-1 rounded-full border border-[#006B5A]/10">
                                    {part.trim()}
                                </span>
                            ))}
                        </div>
                    );
                }

                // 3. Handle Bullet points (*)
                if (segment.startsWith('*')) {
                    return (
                        <div key={i} className="flex items-start gap-4 pl-1 group/item transition-all">
                            <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#006B5A] flex-shrink-0 opacity-40 group-hover/item:opacity-100 transition-opacity" />
                            <p className="text-[13px] leading-relaxed text-content-primary/90 font-medium tracking-tight">
                                {segment.substring(1).trim()}
                            </p>
                        </div>
                    );
                }

                // 4. Handle Subheaders (e.g. "Specifications", "Product Type:")
                const isHeader = segment.endsWith(':') || 
                                (segment.length > 5 && segment.length < 40 && segment === segment.toUpperCase());
                
                if (isHeader) {
                    return (
                        <h3 key={i} className="text-[10px] font-black text-[#006B5A] uppercase tracking-[0.4em] mt-6 mb-1">
                            {segment}
                        </h3>
                    );
                }

                // 5. Default Paragraph
                return (
                    <p key={i} className="text-[13px] leading-relaxed text-content-primary/80 font-medium tracking-tight">
                        {segment}
                    </p>
                );
            })}
        </div>
    );
}
