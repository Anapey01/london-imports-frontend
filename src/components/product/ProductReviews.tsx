'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { productsAPI } from '@/lib/api';
import StarRating from '@/components/StarRating';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
    MessageSquare, 
    Star, 
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
    
    // Form state
    const [newRating, setNewRating] = useState(5);
    const [comment, setComment] = useState('');

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
            
            // Success! Add to list and reset form
            const newReview = response.data;
            setReviews([newReview, ...reviews]);
            setComment('');
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

    // Calculate rating distribution
    const distribution = [5, 4, 3, 2, 1].map(star => {
        const count = reviews.filter(r => Math.round(r.rating) === star).length;
        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
        return { star, count, percentage };
    });

    return (
        <section className="py-16 border-t border-gray-100 bg-white" id="reviews">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                    
                    {/* Left: Compact Rating Summary */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-32">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Reviews</h2>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs font-bold text-gray-900">{Number(rating || 0).toFixed(1)}</span>
                                </div>
                            </div>
                            
                            <div className="bg-white/70 backdrop-blur-md p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-[0.03] -rotate-12 transform group-hover:rotate-0 transition-transform duration-1000">
                                    <MessageSquare className="w-24 h-24 text-black" />
                                </div>
                                
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <div className="text-5xl font-black text-gray-900 leading-none mb-3">
                                            {Number(rating || 0).toFixed(1)}
                                        </div>
                                        <StarRating initialRating={Number(rating || 0)} readOnly size="sm" />
                                        <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">
                                            {ratingCount || reviews.length} Total Reviews
                                        </p>
                                    </div>

                                    {/* Compact Distribution Bars */}
                                    <div className="space-y-3 mb-8">
                                        {distribution.map((item) => (
                                            <div key={item.star} className="flex items-center gap-3">
                                                <span className="text-[10px] font-bold text-gray-500 w-4">{item.star}★</span>
                                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${item.percentage}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 1, ease: "circOut" }}
                                                        className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full"
                                                    />
                                                </div>
                                                <span className="text-[9px] font-bold text-gray-400 w-6 text-right">
                                                    {Math.round(item.percentage)}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {!showForm && (
                                        <button 
                                            onClick={() => isAuthenticated ? setShowForm(true) : toast.error('Please login to write a review')}
                                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all active:scale-[0.98] group/btn shadow-lg shadow-gray-200"
                                        >
                                            Share Experience
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 15 }}
                                    className="bg-white p-8 sm:p-10 rounded-[2rem] border border-pink-100 mb-12 relative shadow-xl shadow-pink-50/50"
                                >
                                    <button 
                                        onClick={() => setShowForm(false)} 
                                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors"
                                        title="Close"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
                                        <p className="text-xs text-gray-500 mt-1">Help others by sharing your honest feedback.</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rate Product</label>
                                            <div className="flex">
                                                <StarRating 
                                                    initialRating={Number(newRating)} 
                                                    onRate={(r) => setNewRating(r)}
                                                    size="md" 
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Comment</label>
                                                <span className={`text-[9px] font-bold ${comment.length > 500 ? 'text-red-500' : 'text-gray-300'}`}>
                                                    {comment.length} / 500
                                                </span>
                                            </div>
                                            <textarea
                                                required
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value.slice(0, 500))}
                                                placeholder="What did you like or dislike?..."
                                                rows={4}
                                                className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:border-pink-500 focus:bg-white rounded-2xl outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting || comment.length < 5}
                                            className="w-full py-4 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-all disabled:opacity-30 active:scale-[0.98] shadow-lg shadow-pink-100"
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Post Review'}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Reviews List */}
                        <div className="space-y-6">
                            {reviews.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6">
                                    {reviews.map((review, idx) => (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.05 }}
                                            key={review.id} 
                                            className="bg-white p-6 sm:p-8 rounded-[1.5rem] border border-gray-50 hover:border-gray-200 transition-colors group/card shadow-sm"
                                        >
                                            <div className="flex justify-between items-start gap-4 mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover/card:bg-pink-50 group-hover/card:text-pink-500 transition-colors">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-sm mb-0.5">
                                                            {review.user_name || 'Customer'}
                                                        </h4>
                                                        <div className="flex items-center gap-2">
                                                            <StarRating initialRating={review.rating} readOnly size="xs" />
                                                            {review.is_verified && (
                                                                <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                                                                    Verified
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter bg-gray-50 px-2 py-1 rounded">
                                                    {new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(review.created_at))}
                                                </span>
                                            </div>
                                            
                                            <p className="text-gray-600 leading-relaxed text-sm">
                                                {review.comment}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-16 bg-gray-50/30 rounded-[2rem] border border-dashed border-gray-200"
                                >
                                    <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">Be the First to Spark!</h3>
                                    <p className="text-xs text-gray-400 max-w-[200px] mx-auto">Help others shop smarter by sharing your feedback.</p>
                                    {!showForm && (
                                        <button 
                                            onClick={() => isAuthenticated ? setShowForm(true) : toast.error('Please login to write a review')}
                                            className="mt-6 px-6 py-2.5 bg-white border border-gray-200 text-gray-900 text-xs font-bold rounded-full hover:bg-gray-50 transition-all shadow-sm"
                                        >
                                            Drop a Review
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
