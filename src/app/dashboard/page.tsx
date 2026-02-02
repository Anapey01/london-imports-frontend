'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRoot() {
    const router = useRouter();

    useEffect(() => {
        router.push('/profile');
    }, [router]);

    return null;
}
