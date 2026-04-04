'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { productsAPI } from '@/lib/api';
import StarRating from '@/components/StarRating';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
    MessageSquare, 
    User, 
    ArrowRight,
    X
} from 'lucide-react';

interface Review {
    id: string;
    user_name: string;
    rating: number;
    comment: string;
    is_verified: boolean;
    created_at: string;
}

interface ProductReviewsProps {
    productSlug: string;
    initialReviews: Review[];
    rating: number;
    ratingCount: number;
}

export default function ProductReviews({ productSlug, initialReviews, rating, ratingCount }: ProductReviewsProps) {
    const { isAuthenticated } = useAuthStore();
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    
    // Form state with draft persistence
    const [newRating, setNewRating] = useState(5);
    const [comment, setComment] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(`review_draft_${productSlug}`) || '';
        }
        return '';
    });

    // Handle draft saving
    useEffect(() => {
        if (comment) {
            localStorage.setItem(`review_draft_${productSlug}`, comment);
        }
        return () => {
            // No cleanup needed
        };
    }, [comment, productSlug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error('Please login to leave a review');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await productsAPI.addReview(productSlug, {
                rating: newRating,
                comment
            });
            
            // Success! 
            const newReview = response.data;
            setReviews([newReview, ...reviews]);
            setComment('');
            localStorage.removeItem(`review_draft_${productSlug}`);
            setNewRating(5);
            setShowForm(false);
            toast.success('Review submitted! Thank you for your feedback.');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { detail?: string; non_field_errors?: string[] } } };
            const message = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Failed to submit review. You may have already reviewed this product.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate rating distribution with synthetic fallback
    const distribution = [5, 4, 3, 2, 1].map(star => {
        let count = reviews.filter(r => Math.round(r.rating) === star).length;
        
        // SYNTHETIC FALLBACK: If we have an aggregate rating but no individual reviews loaded yet
        // we estimate the distribution mathematically to avoid the "0% bars" placeholder look.
        if (reviews.length === 0 && ratingCount > 0) {
            const diff = Math.abs(rating - star);
            if (diff < 0.5) count = ratingCount; // Primary star (e.g. 5-star if rating is 4.8)
            else if (diff < 1.5) count = Math.round(ratingCount * 0.2); // Secondary star
            else count = 0;
        }

        const totalForCalc = reviews.length > 0 ? reviews.length : ratingCount;
        const percentage = totalForCalc > 0 ? (count / totalForCalc) * 100 : 0;
        return { star, count, percentage };
    });

    const handleShareClick = () => {
        if (!isAuthenticated) {
            toast.error('Please login to share your experience');
            // Allow them to see where they would type
            setShowForm(true); 
            return;
        }
        setShowForm(true);
        // Smooth scroll to form
        setTimeout(() => {
            const form = document.querySelector('form');
            if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    return (
        <section className="py-20 border-t border-primary-surface bg-primary-surface/20" id="reviews">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-24">
                    
                    {/* Left: Professional Summary */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-32">
                            <div className="mb-10">
                                <h2 className="text-3xl font-black nuclear-text tracking-tight mb-2">Customer Feedback</h2>
                                <p className="text-sm nuclear-text opacity-40 font-black uppercase tracking-widest">Real reviews from our community.</p>
                            </div>
                            
                            <div className="bg-primary-surface p-6 sm:p-10 rounded-[1.5rem] border border-primary-surface relative overflow-hidden shadow-diffusion-lg">
                                <div className="relative z-10">
                                    <div className="mb-8 pb-8 border-b border-primary-surface/40">
                                        <div className="flex items-center sm:items-end gap-3 mb-4">
                                            <div className="text-5xl sm:text-6xl font-black nuclear-text leading-none">
                                                {Number(rating || 0).toFixed(1)}
                                            </div>
                                            <div className="pb-1">
                                                <StarRating initialRating={Number(rating || 0)} readOnly size="sm" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Distribution Bars - Minimal & Solid */}
                                    <div className="space-y-4 mb-10">
                                        {distribution.map((item) => (
                                            <div key={item.star} className="group/bar">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-[10px] font-black nuclear-text opacity-30 uppercase tracking-widest">{item.star} Stars</span>
                                                    <span className="text-[10px] font-black nuclear-text">{Math.round(item.percentage)}%</span>
                                                </div>
                                                <div className="h-2 bg-primary-surface/40 rounded-full overflow-hidden border border-primary-surface">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${item.percentage}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                                        className="h-full bg-emerald-500 rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {!showForm && (
                                        <button 
                                            onClick={handleShareClick}
                                            className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-all active:scale-[0.98] group/btn shadow-xl shadow-emerald-500/20"
                                        >
                                            Share My Experience
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                {/* Right: Reviews List & Form */}
                    <div className="lg:w-2/3">
                        <AnimatePresence mode="wait">
                            {showForm && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="bg-primary-surface p-8 sm:p-12 rounded-[2rem] border border-primary-surface mb-16 relative shadow-diffusion-xl"
                                >
                                    <button 
                                        onClick={() => setShowForm(false)} 
                                        className="absolute top-8 right-8 p-2 rounded-full hover:bg-primary-surface/10 nuclear-text opacity-40 hover:opacity-100 transition-all"
                                        aria-label="Close review form"
                                        title="Close"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>

                                    <div className="mb-10">
                                        <h3 className="text-2xl font-black nuclear-text">Your Opinion Matters</h3>
                                        <p className="text-sm nuclear-text opacity-40 mt-1.5">How was your overall experience with this item?</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {!isAuthenticated && (
                                            <div className="p-6 bg-red-500/10 rounded-2xl border border-red-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <p className="text-sm text-red-500 font-black">Authentication Required</p>
                                                <Link href="/login" className="px-6 py-2.5 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-black transition-colors">Login Now</Link>
                                            </div>
                                        )}

                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black nuclear-text uppercase tracking-widest opacity-40">Select Rating</label>
                                            <div className="pt-1">
                                                <StarRating 
                                                    initialRating={Number(newRating)} 
                                                    onRate={(r) => setNewRating(r)}
                                                    size="lg" 
                                                    readOnly={false} // Allow interaction even if not logged in for better UX (submit blocks it anyway)
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <label className="text-[11px] font-black nuclear-text uppercase tracking-widest opacity-40">Write Detail</label>
                                                <span className={`text-[10px] font-black ${comment.length > 500 ? 'text-red-500' : 'nuclear-text opacity-20'}`}>
                                                    {comment.length} / 500
                                                </span>
                                            </div>
                                            <textarea
                                                required
                                                disabled={!isAuthenticated}
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value.slice(0, 500))}
                                                placeholder="Help others by sharing your honest feedback..."
                                                rows={5}
                                                className="w-full px-6 py-5 bg-primary-surface/20 border border-primary-surface/40 focus:border-emerald-500 focus:bg-primary-surface/30 rounded-2xl outline-none transition-all text-base nuclear-text placeholder:nuclear-text placeholder:opacity-20"
                                            />
                                            {comment && (
                                                <p className="text-[9px] nuclear-text opacity-30 italic">Draft saved automatically.</p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting || comment.length < 5 || !isAuthenticated}
                                            className="w-full py-5 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all disabled:opacity-20 active:scale-[0.98] shadow-xl shadow-emerald-500/20"
                                        >
                                            {isSubmitting ? 'Posting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Reviews List */}
                        <div className="space-y-8">
                            {reviews.length > 0 ? (
                                <div className="space-y-8">
                                    {reviews.map((review, idx) => (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.05 }}
                                            key={review.id} 
                                            className="pb-10 border-b border-primary-surface last:border-0"
                                        >
                                            <div className="flex justify-between items-start gap-4 mb-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-primary-surface rounded-full flex items-center justify-center nuclear-text opacity-20">
                                                        <User className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h4 className="font-black nuclear-text text-base">
                                                                {review.user_name || 'Verified Customer'}
                                                            </h4>
                                                            {review.is_verified && (
                                                                <span className="text-[8px] font-black text-white bg-emerald-600 px-2 py-0.5 rounded-sm uppercase tracking-wider border border-emerald-500/40 shadow-sm">
                                                                    Verified
                                                                </span>
                                                            )}
                                                        </div>
                                                        <StarRating initialRating={review.rating} readOnly size="xs" />
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-black nuclear-text opacity-20 uppercase tracking-widest pt-1">
                                                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(review.created_at))}
                                                </span>
                                            </div>
                                            
                                            <p className="nuclear-text opacity-60 leading-relaxed text-base italic ml-16">
                                                &quot;{review.comment}&quot;
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-24 bg-primary-surface/20 rounded-[2rem] border border-dashed border-primary-surface/40 shadow-diffusion">
                                    <div className="w-20 h-20 bg-primary-surface/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary-surface/60">
                                        <MessageSquare className="w-8 h-8 nuclear-text opacity-20" />
                                    </div>
                                    <h3 className="text-2xl font-black nuclear-text mb-2">Be the First to Spark!</h3>
                                    <p className="text-sm nuclear-text opacity-40 max-w-[240px] mx-auto mb-10 leading-relaxed uppercase tracking-widest text-[10px] font-black">Your feedback helps thousands of shoppers make better choices.</p>
                                    {!showForm && (
                                        <button 
                                            onClick={handleShareClick}
                                            className="px-10 py-4 bg-emerald-600 border border-emerald-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-full hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20"
                                        >
                                            Drop a Review
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
