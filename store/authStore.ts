import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import eventBus, { EventTypes } from '@/lib/eventBus';

// 用户类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

// 认证状态
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // 登录
  login: (credentials: { username: string; password: string }) => Promise<void>;
  // 登出
  logout: () => void;
  // 设置用户
  setUser: (user: User | null) => void;
  // 设置token
  setToken: (token: string | null) => void;
  // 设置加载状态
  setLoading: (isLoading: boolean) => void;
  // 设置错误信息
  setError: (error: string | null) => void;
}

// 创建认证存储
const useAuthStore = create(
  persist(
    (set, get): AuthState => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // 登录 - 目前是模拟实现，后续接入真实API
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          // 模拟API请求延迟
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // 模拟成功登录
          // 注意：这里只是示例，实际应该调用真实的登录API
          const mockUser: User = {
            id: '1',
            username: credentials.username,
            email: `${credentials.username}@example.com`,
            avatar: 'https://image.vastsea.cc/avatar.jpg',
          };
          
          const mockToken = 'mock-jwt-token';
          
          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
          });
          
          // 发布登录成功事件
          eventBus.emit(EventTypes.AUTH_LOGIN, mockUser);
          
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '登录失败',
            isLoading: false,
          });
        }
      },
      
      // 登出
      logout: () => {
        const { user } = get();
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        
        // 发布登出事件
        eventBus.emit(EventTypes.AUTH_LOGOUT, user);
      },
      
      // 设置用户
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },
      
      // 设置token
      setToken: (token) => {
        set({ token });
      },
      
      // 设置加载状态
      setLoading: (isLoading) => {
        set({ isLoading });
      },
      
      // 设置错误信息
      setError: (error) => {
        set({ error });
      },
    }),
    {
      name: 'auth-storage', // localStorage的key
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }), // 只持久化这些字段
    }
  )
);

export default useAuthStore;