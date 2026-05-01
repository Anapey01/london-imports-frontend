'use client';

import { useAuthStore } from '@/stores/authStore';
import SettingsView from '@/components/profile/SettingsView';

export default function ProfileSettingsPage() {
    const { user } = useAuthStore();
    if (!user) return null;
    return <SettingsView user={user} />;
}
