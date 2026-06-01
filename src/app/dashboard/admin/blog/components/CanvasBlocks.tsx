import React, { useState, useEffect, useRef, memo } from 'react';
import Image from 'next/image';
import { Image as ImageIcon } from 'lucide-react';
import { Section } from './types';

export const CanvasTextBlock = memo(({ 
    section, 
    updateSection, 
    isDark 
}: { 
    section: Section, 
    updateSection: (id: string, content: string) => void, 
    isDark: boolean 
}) => {
    const [localContent, setLocalContent] = useState(section.content);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Sync local state with global state when global state changes externally (like on load)
    useEffect(() => {
        setLocalContent(section.content);
    }, [section.content]);

    // Handle height on mount and content change
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [localContent]);

    // Debounced global update to keep typing smooth
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localContent !== section.content) {
                updateSection(section.id, localContent);
            }
        }, 500); // Wait for pause in typing
        return () => clearTimeout(timer);
    }, [localContent, section.id, updateSection, section.content]);

    return (
        <textarea
            ref={textareaRef}
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
            rows={1}
            placeholder="Tell your story..."
            className={`w-full p-0 bg-transparent border-none focus:ring-0 resize-none font-serif text-xl leading-relaxed transition-all placeholder:italic ${isDark ? 'text-slate-200 placeholder:text-slate-700' : 'text-slate-900 placeholder:text-slate-200'}`}
        />
    );
});

CanvasTextBlock.displayName = 'CanvasTextBlock';

export const CanvasImageBlock = memo(({ 
    section, 
    handleSectionImageUpload, 
    isDark 
}: { 
    section: Section, 
    handleSectionImageUpload: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void, 
    isDark: boolean 
}) => {
    return (
        <div className="relative group/image-block">
            {section.content || section.previewUrl ? (
                <div className="relative w-full aspect-[16/9] bg-slate-50 border border-slate-100 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 group-hover/image-block:shadow-2xl group-hover/image-block:shadow-slate-200">
                    <Image 
                        src={section.previewUrl || section.content} 
                        alt="Section content" 
                        fill
                        className="object-cover" 
                    />
                    <label className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover/image-block:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-6 py-3">Replace Framework</span>
                        <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleSectionImageUpload(section.id, e)}
                        />
                    </label>
                </div>
            ) : (
                <label className={`flex flex-col items-center justify-center aspect-[21/9] border-2 border-dashed transition-all cursor-pointer group-hover/image-block:border-indigo-500 ${
                    isDark ? 'border-slate-800 hover:bg-slate-800/30' : 'border-slate-100 hover:bg-slate-50/50'
                }`}>
                    <ImageIcon className="w-6 h-6 text-slate-200 mb-4" />
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Anchor Visual Asset</span>
                    <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleSectionImageUpload(section.id, e)}
                    />
                </label>
            )}
        </div>
    );
});

CanvasImageBlock.displayName = 'CanvasImageBlock';
