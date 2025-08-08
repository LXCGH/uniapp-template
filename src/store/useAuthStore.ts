import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface User {
    email?: string;
    name?: string;
    avatar?: string;
    // 其他用户信息字段
}

// 为 pinia-plugin-persistedstate 定义 UniApp 存储适配器
const uniStorage = {
    setItem: (key: string, value: string) => {
        try {
            uni.setStorageSync(key, value);
        } catch (e) {
            console.error("uni.setStorageSync failed", e);
        }
    },
    getItem: (key: string): string | null => {
        try {
            const value = uni.getStorageSync(key);
            return value ? String(value) : null; // 确保返回 string 或 null
        } catch (e) {
            console.error("uni.getStorageSync failed", e);
            return null;
        }
    },
    removeItem: (key: string) => { // 插件可能需要 removeItem
        try {
            uni.removeStorageSync(key);
        } catch (e) {
            console.error("uni.removeStorageSync failed", e);
        }
    }
};


export const useAuthStore = defineStore(
    'auth',
    () => {
        const token = ref<string | null>(null);
        const user = ref<User | null>(null);
        const isAuthenticated = ref<boolean>(false);

        function setToken(val: string) {
            token.value = val;
            isAuthenticated.value = !!val;
        }

        function setUser(val: User) {
            user.value = val;
        }

        function clearAuth() {
            token.value = null;
            user.value = null;
            isAuthenticated.value = false;
        }

        function logout() {
            clearAuth();
            uni.removeStorageSync('auth-storage');
        }

        return {
            token,
            user,
            isAuthenticated,
            setToken,
            setUser,
            clearAuth,
            logout,
        };
    }
);
