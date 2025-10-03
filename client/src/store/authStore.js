import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Initialize from localStorage
      initialize: () => {
        try {
          const token = localStorage.getItem('token');
          const user = localStorage.getItem('user');
          
          if (token && user && user !== 'null' && user !== 'undefined') {
            set({
              token,
              user: JSON.parse(user)
            });
          }
        } catch (error) {
          console.error('Error initializing auth store:', error);
          // Clear invalid localStorage data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      },

      // Login action
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authService.login(credentials);
          
          if (response.success && response.data) {
            const { _id, name, email, role, token } = response.data;
            
            // Save to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ _id, name, email, role }));
            
            // Update state
            set({
              user: { _id, name, email, role },
              token,
              isLoading: false,
              error: null
            });
            
            return { success: true, user: { _id, name, email, role } };
          } else {
            throw new Error(response.message || 'Login failed');
          }
        } catch (error) {
          const errorMessage = error.message || 'Login failed';
          set({
            isLoading: false,
            error: errorMessage
          });
          throw error;
        }
      },

      // Register action
      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authService.register(userData);
          
          if (response.success && response.data) {
            const { _id, name, email, role, token } = response.data;
            
            // Save to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ _id, name, email, role }));
            
            // Update state
            set({
              user: { _id, name, email, role },
              token,
              isLoading: false,
              error: null
            });
            
            return { success: true, user: { _id, name, email, role } };
          } else {
            throw new Error(response.message || 'Registration failed');
          }
        } catch (error) {
          const errorMessage = error.message || 'Registration failed';
          set({
            isLoading: false,
            error: errorMessage
          });
          throw error;
        }
      },

      // Logout action
      logout: () => {
        authService.logout();
        set({
          user: null,
          token: null,
          isLoading: false,
          error: null
        });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Check if user is authenticated
      isAuthenticated: () => {
        const { token, user } = get();
        return !!(token && user);
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token
      })
    }
  )
);

export default useAuthStore;

