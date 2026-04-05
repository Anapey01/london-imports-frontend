'use client';

export default function CheckoutSkeleton() {
    return (
        <div className="min-h-screen bg-primary-surface md:bg-secondary-surface pt-16 pb-12 md:pt-20 px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="max-w-6xl mx-auto">
                {/* Header Skeleton */}
                <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg mb-8" />

                <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
                    {/* Left Column - Form Ghosts */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Delivery Card Ghost */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 space-y-6">
                            <div className="h-6 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl" />
                                <div className="h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl" />
                            </div>
                            <div className="h-24 bg-slate-50 dark:bg-slate-800/50 rounded-xl" />
                        </div>

                        {/* Payment Card Ghost */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 space-y-6">
                            <div className="h-6 w-40 bg-slate-100 dark:bg-slate-800 rounded" />
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-20 bg-slate-50 dark:bg-slate-800/50 rounded-xl" />
                                <div className="h-20 bg-slate-50 dark:bg-slate-800/50 rounded-xl" />
                                <div className="h-20 bg-slate-50 dark:bg-slate-800/50 rounded-xl" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Summary Ghost */}
                    <div className="lg:col-span-5">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 space-y-6">
                            <div className="h-6 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <div className="h-4 w-20 bg-slate-50 dark:bg-slate-800/50 rounded" />
                                    <div className="h-4 w-16 bg-slate-50 dark:bg-slate-800/50 rounded" />
                                </div>
                                <div className="flex justify-between">
                                    <div className="h-4 w-24 bg-slate-50 dark:bg-slate-800/50 rounded" />
                                    <div className="h-4 w-16 bg-slate-50 dark:bg-slate-800/50 rounded" />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="h-14 bg-slate-900 dark:bg-emerald-600 rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
