'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { productsAPI } from '@/lib/api';
import StarRating from '@/components/StarRating';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

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
        <section className="py-16 border-t border-gray-100 bg-gray-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Left: Rating Summary */}
                    <div className="lg:w-1/3">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
                        
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="text-5xl font-bold text-gray-900">
                                    {Number(rating || 0).toFixed(1)}
                                </div>
                                <div>
                                    <StarRating initialRating={Number(rating || 0)} readOnly size="md" />
                                    <p className="text-sm text-gray-500 mt-1">Based on {ratingCount || reviews.length} reviews</p>
                                </div>
                            </div>

                            {/* Distribution bars */}
                            <div className="space-y-3 mb-8">
                                {distribution.map((item) => (
                                    <div key={item.star} className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-gray-600 w-3">{item.star}</span>
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.percentage}%` }}
                                                className="h-full bg-yellow-400 rounded-full"
                                            />
                                        </div>
                                        <span className="text-xs text-gray-400 w-8">{Math.round(item.percentage)}%</span>
                                    </div>
                                ))}
                            </div>

                            {!showForm && (
                                <button 
                                    onClick={() => isAuthenticated ? setShowForm(true) : toast.error('Please login to write a review')}
                                    className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-95"
                                >
                                    Write a Review
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right: Reviews List & Form */}
                    <div className="lg:w-2/3">
                        <AnimatePresence>
                            {showForm && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-white p-8 rounded-3xl shadow-md border border-pink-100 mb-12"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-gray-900">How would you rate this?</h3>
                                        <button 
                                            onClick={() => setShowForm(false)} 
                                            className="text-gray-400 hover:text-gray-600"
                                            title="Close review form"
                                            aria-label="Close review form"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <button
                                                        key={s}
                                                        type="button"
                                                        onClick={() => setNewRating(s)}
                                                        className={`p-1 transition-transform hover:scale-110 ${s <= newRating ? 'text-yellow-400' : 'text-gray-200'}`}
                                                        title={`Rate ${s} stars`}
                                                        aria-label={`Rate ${s} stars`}
                                                    >
                                                        <svg className="w-8 h-8 fill-current" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Comment</label>
                                            <textarea
                                                required
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="What did you think of the product?"
                                                rows={4}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-4 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-all disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Reviews List */}
                        <div className="space-y-6">
                            {reviews.length > 0 ? (
                                reviews.map((review, idx) => (
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        key={review.id} 
                                        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold">
                                                    {review.user_name?.charAt(0) || 'A'}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{review.user_name || 'Anonymous User'}</h4>
                                                    <div className="flex items-center gap-2">
                                                        <StarRating initialRating={review.rating} readOnly size="sm" />
                                                        {review.is_verified && (
                                                            <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                                Verified Buyer
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(review.created_at))}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed italic">
                                            &ldquo;{review.comment}&rdquo;
                                        </p>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                                    <p className="text-gray-400">No reviews yet. Be the first to review this product!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
