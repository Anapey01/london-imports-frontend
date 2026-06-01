import React from 'react';
import Image from 'next/image';
import { BlogPost } from './types';

interface BlogListTableProps {
    posts: BlogPost[];
    isDark: boolean;
    openEditModal: (post: BlogPost) => void;
    handleDelete: (id: number) => void;
}

export const BlogListTable: React.FC<BlogListTableProps> = ({
    posts,
    isDark,
    openEditModal,
    handleDelete
}) => {
    if (posts.length === 0) {
        return (
            <div className="py-12 text-center">
                <svg className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>No blog posts yet</p>
            </div>
        );
    }

    return (
        <table className="w-full">
            <thead>
                <tr className={isDark ? 'bg-slate-800/50' : 'bg-gray-50'}>
                    <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Article</th>
                    <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Status</th>
                    <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>SEO Health</th>
                    <th className={`px-5 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Actions</th>
                </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-gray-100'}`}>
                {posts.map((post) => (
                    <tr key={post.id} className={`${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-gray-50/50'} transition-colors`}>
                        <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                                {post.image ? (
                                    <div className="relative w-10 h-10 overflow-hidden rounded-lg">
                                        <Image src={post.image} alt="" fill className="object-cover" />
                                    </div>
                                ) : (
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                                        <svg className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                                <div>
                                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{post.title}</p>
                                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
                                        {post.category}
                                    </span>
                                </div>
                            </div>
                        </td>
                        <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${post.is_published
                                ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                                : isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-700'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${post.is_published ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                {post.is_published ? 'Live' : 'Draft'}
                            </span>
                        </td>
                        <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                                {[
                                    { check: !!post.excerpt, label: 'Desc' },
                                    { check: !!post.seo_title, label: 'Tag' },
                                    { check: !!post.seo_keywords, label: 'Key' }
                                ].map((s, i) => (
                                    <span key={i} className={`w-8 h-4 flex items-center justify-center rounded-[4px] text-[8px] font-bold ${
                                        s.check ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                        {s.label}
                                    </span>
                                ))}
                            </div>
                        </td>
                        <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1">
                                <button
                                    onClick={() => openEditModal(post)}
                                    className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className={`p-2 rounded-lg transition-colors text-red-400 hover:bg-red-400/10`}
                                >
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
