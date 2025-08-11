// 基础类型定义
export interface ApiResponse<T> {
    resultCode: string;
    data: T;
    resultMsg?: string;
}

export interface ListData<T> {
    list: T[];
}

export interface ApiError {
    code: number;
    message: string;
}

export interface Pagination {
    page: number;
    pageSize: number;
    total: number;
}

export type WifiItemProps = {
    auth?: number;
    channel?: number;
    rssi?: number;
    ssid: string;
    traceId?: string;
    password: string;
    bssid: string;
    base64ssid: string;
    accessToken: string | null;
    unSetPsd?: boolean;
};

export interface ReqLoginCode {
    email: string;
    mac: string;
}



