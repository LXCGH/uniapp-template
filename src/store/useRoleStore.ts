import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface RoleInfo {
  bindStatus?: number;
  code: string;
  image?: string;
  name?: string;
  avatar?: string;
  thumbnailImg?: string;
  introduce?: string;
}

export const useRoleStore = defineStore(
  'role',
  () => {
    // 状态
    const roleList = ref<RoleInfo[]>([]);
    const roleInfo = ref<RoleInfo | null>(null);
    const roleDetailPageHeader = ref<string>('');

    // 动作
    function setRoleList(list: RoleInfo[]) {
      roleList.value = list;
    }

    function setRole(role: RoleInfo) {
      roleInfo.value = role;
    }

    function clearRole() {
      roleInfo.value = null;
    }

    function setRoleDetailPageHeader(header: string) {
      roleDetailPageHeader.value = header;
    }

    return {
      roleList,
      roleInfo,
      roleDetailPageHeader,
      setRoleList,
      setRole,
      clearRole,
      setRoleDetailPageHeader,
    };
  }
);
