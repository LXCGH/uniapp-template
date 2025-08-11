import { defineStore } from 'pinia';

export const useModalStatus = defineStore('modalStatus', {
    // 定义要状态数据
    state: () => {
        return {
            modalStatus: false,
        }
    },
    // 定义方法
    actions: {
        setStatus(date: boolean) {
            this.modalStatus = date
        }
    },
});