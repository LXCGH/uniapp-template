export enum Gender {
  Unknown = 0,
  Male = 1,
  Female = 2,
}
export interface UserInfo {
  id: number;
  nickname: string;
  avatar: string;
  gender: Gender; // 0: 未知, 1: 男, 2: 女
  birthdate: string;
  language: string;
  first_name: string;
  last_name: string;
  username: string;
  employee: {
    name: string;
    id: number;
    gender: number;
    position: string;
    phone: number;
    department_info: {
      dept_id: string;
      name: string;
      status: boolean;
    };
    user: number;
    emp_id: string;
    emergency_contact: string;
    emergency_phone: string;
    is_active: boolean;
    avatar_url: string;
    work_status: number;
    entry_date: string;
    leave_days: number;
  };
}


