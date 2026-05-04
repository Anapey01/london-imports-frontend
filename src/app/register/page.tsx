import { Metadata } from 'next';
import RegisterForm from './RegisterForm';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Create Account | London\'s Imports',
    description: 'Join London\'s Imports Ghana and start your mini-importation journey today. Track your orders, save items to your wishlist, and get exclusive pre-order deals.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function RegisterPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterForm />
        </Suspense>
    );
}
