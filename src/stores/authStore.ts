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
    ghana_post_gps: string;
    vendor_profile?: Record<string, unknown>;
    is_staff?: boolean;
    is_superuser?: boolean;
    date_joined?: string;
    order_count?: number;
    email_verified?: boolean;
    date_of_birth?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;

    login: (username: string, password: string) => Promise<void>;
    register: (data: Record<string, unknown>) => Promise<void>;
    googleLogin: (idToken: string) => Promise<void>;
    logout: () => void;
    fetchUser: () => Promise<void>;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            accessToken: null,
            refreshToken: null,
            isLoading: false,

            login: async (username: string, password: string) => {
                set({ isLoading: true });
                try {
                    const response = await authAPI.login({ username, password });

                    const { access, refresh } = response.data.tokens || response.data;
                    if (access) {
                        set({ accessToken: access, refreshToken: refresh });
                    }

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
                        set({ accessToken: tokens.access, refreshToken: tokens.refresh });
                    }

                    set({ user, isAuthenticated: true });
                } finally {
                    set({ isLoading: false });
                }
            },

            googleLogin: async (idToken: string) => {
                set({ isLoading: true });
                try {
                    const response = await authAPI.googleLogin(idToken);
                    const { access, refresh } = response.data.tokens || response.data;
                    if (access) {
                        set({ accessToken: access, refreshToken: refresh });
                    }
                    await get().fetchUser();
                } finally {
                    set({ isLoading: false });
                }
            },

            logout: async () => {
                try {
                    await authAPI.logout();
                } catch { }

                set({ user: null, isAuthenticated: false, accessToken: null, refreshToken: null });
            },

            fetchUser: async () => {
                try {
                    const response = await authAPI.me();
                    set({ user: response.data, isAuthenticated: true });
                } catch (error: any) {
                    // SILENT CLEANUP: If 401/403, just logout and don't throw a scary error
                    if (error.response && (error.response.status === 401 || error.response.status === 403 || error.response.status === 400)) {
                        console.debug('[AuthStore] Session invalid or expired. Cleaning up.');
                        get().logout();
                        return; // Don't re-throw for expected auth failures
                    }
                    throw error;
                }
            },

            setUser: (user) => set({ user, isAuthenticated: !!user }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken
            }),
        }
    )
);
