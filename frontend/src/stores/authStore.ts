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
    vendor_profile?: any;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    login: (username: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
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
                    await authAPI.login({ username, password });
                    // No manual token storage

                    // Fetch user info to confirm auth
                    await get().fetchUser();
                } finally {
                    set({ isLoading: false });
                }
            },

            register: async (data: any) => {
                set({ isLoading: true });
                try {
                    const response = await authAPI.register(data);
                    const { user } = response.data;

                    // No manual token storage

                    set({ user, isAuthenticated: true });
                } finally {
                    set({ isLoading: false });
                }
            },

            logout: async () => {
                try {
                    await authAPI.logout();
                } catch { }

                set({ user: null, isAuthenticated: false });
                // No manual token removal (cookies cleared by server)
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
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);
