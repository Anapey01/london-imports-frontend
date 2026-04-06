import { create } from 'zustand';

interface UIState {
  isSearchModalOpen: boolean;
  isMobileMenuOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleSearchModal: () => void;
  toggleMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSearchModalOpen: false,
  isMobileMenuOpen: false,
  setSearchModalOpen: (open) => set({ isSearchModalOpen: open }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  toggleSearchModal: () => set((state) => ({ isSearchModalOpen: !state.isSearchModalOpen })),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
}));
