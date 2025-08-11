import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { UserInfo } from '@/api/modules/user';

/**
 * 用户信息状态管理
 */
export const useUserInfoStore = defineStore('userInfo', () => {
  const userInfo = ref<UserInfo | null>(null);

  /** 设置用户信息 */
  function setUserInfo(info: UserInfo | null) {
    userInfo.value = info;
  }

  return {
    userInfo,
    setUserInfo,
  };
});
