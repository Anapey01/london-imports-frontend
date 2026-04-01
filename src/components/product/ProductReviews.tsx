'use client';

import { useState, useEffect } from 'react';
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
        <section className="py-20 border-t border-gray-100 bg-white" id="reviews">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    
                    {/* Left: Professional Summary */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-32">
                            <div className="mb-10">
                                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Customer Feedback</h2>
                                <p className="text-sm text-gray-500 font-medium">Real reviews from our community.</p>
                            </div>
                            
                            <div className="bg-gray-50/50 p-8 sm:p-10 rounded-[1.5rem] border border-gray-100 relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="mb-8 pb-8 border-b border-gray-100">
                                        <div className="flex items-end gap-3 mb-4">
                                            <div className="text-6xl font-bold text-gray-900 leading-none">
                                                {Number(rating || 0).toFixed(1)}
                                            </div>
                                            <div className="pb-1">
                                                <StarRating initialRating={Number(rating || 0)} readOnly size="sm" />
                                                <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">
                                                    {ratingCount || reviews.length} REVIEWS
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Distribution Bars - Minimal & Solid */}
                                    <div className="space-y-4 mb-10">
                                        {distribution.map((item) => (
                                            <div key={item.star} className="group/bar">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.star} Stars</span>
                                                    <span className="text-[10px] font-bold text-gray-900">{Math.round(item.percentage)}%</span>
                                                </div>
                                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${item.percentage}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                                        className="h-full bg-gray-900 rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {!showForm && (
                                        <button 
                                            onClick={handleShareClick}
                                            className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all active:scale-[0.98] group/btn"
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
                                    className="bg-white p-8 sm:p-12 rounded-[2rem] border-2 border-gray-900 mb-16 relative"
                                >
                                    <button 
                                        onClick={() => setShowForm(false)} 
                                        className="absolute top-8 right-8 p-2 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors"
                                        aria-label="Close review form"
                                        title="Close"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>

                                    <div className="mb-10">
                                        <h3 className="text-2xl font-bold text-gray-900">Your Opinion Matters</h3>
                                        <p className="text-sm text-gray-500 mt-1.5">How was your overall experience with this item?</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {!isAuthenticated && (
                                            <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <p className="text-sm text-red-600 font-medium">Please login to submit your review.</p>
                                                <a href="/login" className="px-6 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors">Login Now</a>
                                            </div>
                                        )}

                                        <div className="space-y-3">
                                            <label className="text-[11px] font-extrabold text-gray-900 uppercase tracking-widest">Select Rating</label>
                                            <div className="pt-1">
                                                <StarRating 
                                                    initialRating={Number(newRating)} 
                                                    onRate={(r) => setNewRating(r)}
                                                    size="lg" 
                                                    readOnly={!isAuthenticated}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <label className="text-[11px] font-extrabold text-gray-900 uppercase tracking-widest">Write Detail</label>
                                                <span className={`text-[10px] font-bold ${comment.length > 500 ? 'text-red-600' : 'text-gray-300'}`}>
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
                                                className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-gray-900 focus:bg-white rounded-2xl outline-none transition-all text-base text-gray-900 placeholder:text-gray-400"
                                            />
                                            {comment && (
                                                <p className="text-[9px] text-gray-400 italic">Draft saved automatically.</p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting || comment.length < 5 || !isAuthenticated}
                                            className="w-full py-5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all disabled:opacity-20 active:scale-[0.98] shadow-xl shadow-gray-200"
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
                                            className="pb-10 border-b border-gray-100 last:border-0"
                                        >
                                            <div className="flex justify-between items-start gap-4 mb-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                                        <User className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h4 className="font-bold text-gray-900 text-base">
                                                                {review.user_name || 'Verified Customer'}
                                                            </h4>
                                                            {review.is_verified && (
                                                                <span className="text-[8px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm uppercase tracking-wider border border-emerald-100">
                                                                    Verified
                                                                </span>
                                                            )}
                                                        </div>
                                                        <StarRating initialRating={review.rating} readOnly size="xs" />
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest pt-1">
                                                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(review.created_at))}
                                                </span>
                                            </div>
                                            
                                            <p className="text-gray-600 leading-relaxed text-base italic ml-16">
                                                &quot;{review.comment}&quot;
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-24 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                                        <MessageSquare className="w-8 h-8 text-gray-200" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Be the First to Spark!</h3>
                                    <p className="text-sm text-gray-400 max-w-[240px] mx-auto mb-10 leading-relaxed">Your feedback helps thousands of shoppers make better choices.</p>
                                    {!showForm && (
                                        <button 
                                            onClick={handleShareClick}
                                            className="px-10 py-4 bg-gray-900 border border-gray-900 text-white text-sm font-bold rounded-full hover:bg-black transition-all shadow-xl shadow-gray-200"
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
