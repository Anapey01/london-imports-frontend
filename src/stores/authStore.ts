/**
 * London's Imports - Auth Store
 * Zustand store for authentication state
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '@/lib/api';

interface User {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: 'CUSTOMER' | 'VENDOR' | 'ADMIN' | 'RIDER';
    phone: string;
    address: string;
    city: string;
    region: string;
    vendor_profile?: Record<string, unknown>;
    is_staff?: boolean;
    is_superuser?: boolean;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    login: (username: string, password: string) => Promise<void>;
    register: (data: Record<string, unknown>) => Promise<void>;
    logout: () => void;
    fetchUser: () => Promise<void>;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (username: string, password: string) => {
                set({ isLoading: true });
                try {
                    const response = await authAPI.login({ username, password });

                    // Save tokens if returned (New robust flow)
                    const { access, refresh } = response.data.tokens || response.data;
                    if (access) {
                        localStorage.setItem('access_token', access);
                        localStorage.setItem('refresh_token', refresh);
                    }

                    // Fetch user info to confirm auth
                    await get().fetchUser();
                } finally {
                    set({ isLoading: false });
                }
            },

            register: async (data: Record<string, unknown>) => {
                set({ isLoading: true });
                try {
                    const response = await authAPI.register(data);
                    const { user, tokens } = response.data;

                    if (tokens?.access) {
                        localStorage.setItem('access_token', tokens.access);
                        localStorage.setItem('refresh_token', tokens.refresh);
                    }

                    set({ user, isAuthenticated: true });
                } finally {
                    set({ isLoading: false });
                }
            },

            logout: async () => {
                try {
                    await authAPI.logout();
                } catch { }

                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                set({ user: null, isAuthenticated: false });
            },

            fetchUser: async () => {
                try {
                    const response = await authAPI.me();
                    set({ user: response.data, isAuthenticated: true });
                } catch {
                    set({ user: null, isAuthenticated: false });
                }
            },

            setUser: (user) => set({ user, isAuthenticated: !!user }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);
