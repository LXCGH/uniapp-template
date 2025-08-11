import { defineStore } from 'pinia';
import type { ChildProfile } from '@/api/interface/profile';


const child: ChildProfile | null = null;

export const useProfileStore = defineStore('profile', {
  // 定义要状态数据
  state: () => {
    return {
      child: child as ChildProfile | null,
      lang: 'ZH_CN' // 中文，英文
    }
  },
  getters: {
  },
  // 定义方法
  actions: {
    changeChild(child: ChildProfile) {
      this.child = { ...child };
    },
    changeLang(lang: string) {
      this.lang = lang
    }
  },
});