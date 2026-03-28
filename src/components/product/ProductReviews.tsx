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
    CheckCircle2, 
    User, 
    Calendar, 
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
        <section className="py-24 border-t border-gray-100 bg-white" id="reviews">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-16">
                    
                    {/* Left: Rating Summary Card */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-32">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Customer Experience</h2>
                            
                            <div className="bg-gradient-to-br from-gray-50 to-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 transform group-hover:rotate-0 transition-transform duration-700">
                                    <MessageSquare className="w-32 h-32 text-black" />
                                </div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="text-7xl font-black text-gray-900 leading-none">
                                            {Number(rating || 0).toFixed(1)}
                                        </div>
                                        <div>
                                            <StarRating initialRating={Number(rating || 0)} readOnly size="md" />
                                            <p className="text-sm font-medium text-gray-500 mt-2 uppercase tracking-widest">
                                                Based on {ratingCount || reviews.length} reviews
                                            </p>
                                        </div>
                                    </div>

                                    {/* Premium Distribution Bars */}
                                    <div className="space-y-4 mb-10">
                                        {distribution.map((item) => (
                                            <div key={item.star} className="flex items-center gap-4">
                                                <div className="flex items-center gap-1 w-8">
                                                    <span className="text-xs font-bold text-gray-900">{item.star}</span>
                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                </div>
                                                <div className="flex-1 h-2 bg-gray-200/50 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${item.percentage}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className="h-full bg-black rounded-full"
                                                    />
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 min-w-[30px] text-right">
                                                    {Math.round(item.percentage)}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {!showForm && (
                                        <button 
                                            onClick={() => isAuthenticated ? setShowForm(true) : toast.error('Please login to write a review')}
                                            className="w-full flex items-center justify-center gap-3 py-4 bg-pink-600 text-white rounded-2xl font-bold hover:bg-pink-700 transition-all hover:shadow-lg hover:shadow-pink-500/20 active:scale-[0.98] group/btn"
                                        >
                                            Write a Review
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
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-pink-100/50 border-2 border-pink-50 mb-16 relative"
                                >
                                    <button 
                                        onClick={() => setShowForm(false)} 
                                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
                                        aria-label="Close"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    <div className="mb-8">
                                        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Post Your Review</h3>
                                        <p className="text-sm text-gray-500 mt-1">We value your honest feedback !</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Rating</label>
                                            <div className="p-4 bg-gray-50 rounded-2xl inline-block">
                                                <StarRating 
                                                    initialRating={Number(newRating)} 
                                                    onRate={(r) => setNewRating(r)}
                                                    size="lg" 
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Comment</label>
                                                <span className={`text-[10px] font-bold ${comment.length > 500 ? 'text-red-500' : 'text-gray-300'}`}>
                                                    {comment.length} / 500
                                                </span>
                                            </div>
                                            <textarea
                                                required
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value.slice(0, 500))}
                                                placeholder="Describe your experience with this product..."
                                                rows={5}
                                                className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-pink-500 focus:bg-white rounded-[1.5rem] outline-none transition-all text-gray-900 placeholder:text-gray-400 ring-offset-2"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting || comment.length < 5}
                                            className="w-full py-5 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-gray-200/50 active:scale-[0.98]"
                                        >
                                            {isSubmitting ? 'Publishing...' : 'Publish Review'}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Reviews List */}
                        <div className="space-y-8">
                            {reviews.length > 0 ? (
                                <div className="grid grid-cols-1 gap-8">
                                    {reviews.map((review, idx) => (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.05, duration: 0.5 }}
                                            key={review.id} 
                                            className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow group/card"
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-gradient-to-tr from-pink-500 to-pink-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-200 transition-transform group-hover/card:scale-110">
                                                        <User className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-lg leading-none mb-2">
                                                            {review.user_name || 'Valued Customer'}
                                                        </h4>
                                                        <div className="flex flex-wrap items-center gap-3">
                                                            <StarRating initialRating={review.rating} readOnly size="sm" />
                                                            {review.is_verified && (
                                                                <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-sm border border-emerald-100/50">
                                                                    <CheckCircle2 className="w-3 h-3" />
                                                                    Verified Buyer
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-gray-400 shrink-0">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-bold uppercase tracking-tight">
                                                        {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(review.created_at))}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="pl-0 sm:pl-[72px]">
                                                <p className="text-gray-600 leading-relaxed text-base italic line-clamp-4 group-hover/card:line-clamp-none transition-all">
                                                    &ldquo;{review.comment}&rdquo;
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200"
                                >
                                    <div className="flex justify-center mb-6">
                                        <div className="p-6 bg-white rounded-full shadow-inner">
                                            <Star className="w-12 h-12 text-gray-200" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Be the First to Spark!</h3>
                                    <p className="text-gray-400 max-w-sm mx-auto font-medium">No reviews yet for this product. Share your experience and help others shop smarter.</p>
                                    <button 
                                        onClick={() => isAuthenticated ? setShowForm(true) : toast.error('Please login to write a review')}
                                        className="mt-8 px-8 py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-all shadow-lg shadow-pink-100"
                                    >
                                        Drop a Review
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
