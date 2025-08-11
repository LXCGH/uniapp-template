import { request, uploadFile } from "@/tools/request";
import type { ReqLoginData, ApiResponse, LoginResponse } from "@/api/interface/";

export function login(data: ReqLoginData): Promise<ApiResponse<LoginResponse>> {
  return request<LoginResponse>({
    url: "auth/login/",
    method: "POST",
    data,
  });
}

export function commonFileUpload(data: { file: string }) {
  return uploadFile({
    url: "medias/upload/",
    filePath: data.file,
    name: "file",
  });
}

export function attendanceCreate(data: any) {
  return request({
    url: `attendance/leave-records/`,
    method: "POST",
    data,
  });
}

export function attendanceMine(data: { page: number; page_size: number }) {
  return request({
    url: `attendance/leave-records/mine/`,
    method: "GET",
    data,
  });
}
