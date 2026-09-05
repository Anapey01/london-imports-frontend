import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { checkersAPI } from '@/lib/api';

interface Agent {
  id: string;
  email?: string;
  store_name: string;
  slug: string;
  momo_network: string;
  momo_number: string;
  is_approved: boolean;
  user?: {
    email: string;
    phone: string;
  };
}

interface AgentAuthState {
  agent: Agent | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  fetchAgent: () => Promise<void>;
  setAgent: (agent: Agent | null) => void;
}

export const useAgentAuthStore = create<AgentAuthState>()(
  persist(
    (set, get) => ({
      agent: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await checkersAPI.agentLogin(credentials);
          const agentObj = response.data.agent;
          if (agentObj) {
            set({
              agent: agentObj,
              isAuthenticated: true
            });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const response = await checkersAPI.agentRegister(data);
          const agentObj = response.data.agent;
          if (agentObj) {
            set({
              agent: agentObj,
              isAuthenticated: true
            });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await checkersAPI.agentLogout();
        } catch {}
        set({ agent: null, isAuthenticated: false, isLoading: false });
      },

      fetchAgent: async () => {
        try {
          const response = await checkersAPI.agentProfile();
          set({ agent: response.data, isAuthenticated: true });
        } catch (error: any) {
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            set({ agent: null, isAuthenticated: false });
          }
        }
      },

      setAgent: (agent) => set({ agent, isAuthenticated: !!agent }),
    }),
    {
      name: 'agent-auth-storage',
      partialize: (state) => ({
        agent: state.agent,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
