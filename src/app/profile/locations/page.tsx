'use client';

import { useAuthStore } from '@/stores/authStore';
import AddressesView from '@/components/profile/AddressesView';

export default function ProfileLocationsPage() {
    const { user } = useAuthStore();
    if (!user) return null;
    return <AddressesView user={user} />;
}
