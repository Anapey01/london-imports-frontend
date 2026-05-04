import { Metadata } from 'next';
import LoginForm from './LoginForm';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Customer Login | London\'s Imports',
    description: 'Sign in to your London\'s Imports account to track orders, manage your wishlist, and access exclusive pre-order deals.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
