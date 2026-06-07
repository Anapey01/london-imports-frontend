import Reviews from '@/components/Reviews';

// ISR: Revalidate reviews page every 24 hours
export const revalidate = 86400;

export default function ReviewsPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24">
            <Reviews />
        </div>
    );
}
