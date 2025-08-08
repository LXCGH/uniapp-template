import { getConfig } from "@/config/config";
import type { ApiResponse } from "@/api/interface/";

// 定义请求选项接口
interface RequestOptions {  
  url: string;
  method?: "GET" | "OPTIONS" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | "PATCH" | any;
  data?: any;
}

// 定义 uni.request 的响应类型
interface UniRequestResponse {
  statusCode: number;
  data: any;
  header: any;
  cookies: string[];
}

export const request = <T>(options: RequestOptions = {} as RequestOptions): Promise<ApiResponse<T>> => {
  return new Promise<ApiResponse<T>>((resolve, reject) => {
    handleRequest<T>(options, resolve, reject);
  });
};

// 发起请求
function handleRequest<T>(
  options: RequestOptions, 
  resolve: (value: ApiResponse<T>) => void, 
  reject: (reason?: any) => void
) {
  const config = getConfig();
  let BASEURL = config.apiUrl;
  const token = uni.getStorageSync("token");
  console.log("token", token);
  
  if (whiteList(options)) {
    uni.request({
      url: BASEURL + options.url,
      method: options.method || 'GET',
      data: options.data,
      success: (response: UniRequestResponse) => {
        return resolve(response.data);
      },
      fail: (err: any) => {
        return reject(err);
      },
      complete() {
        // uni.hideLoading();
      },
    });
    return;
  }
  
  uni.request({
    url: options.url.includes("http") ? options.url : BASEURL + options.url,
    method: options.method || 'GET',
    header: {
      Authorization: `Bearer ${token}`,
    },
    data: options.data,
    success: (response: UniRequestResponse) => {
      console.log("response", response);
      if (response.statusCode == 401) {
        uni.showToast({
          icon: "none",
          title: response?.data?.resultMsg || "用户未登录",
          duration: 2000,
        });
        uni.removeStorageSync("token");
        return;
      }

      if (response.statusCode !== 200) {
        uni.showToast({
          icon: "none",
          title: response?.data?.message || response?.data?.detail || "请求失败",
          duration: 2000,
        });
      }

      console.log("response.statusCode", response.statusCode);
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return resolve(response.data);
      }
      uni.showToast({
        icon: "none",
        title: response?.data?.resultMsg || response?.data?.detail || response?.data?.message || "请求失败",
        duration: 2000,
      });
      reject(response);
    },
    fail: (err: any) => {
      console.log("error", err);
      return reject(err);
    },
    complete() {
      // uni.hideLoading();
    },
  });
}

// token 白名单
function whiteList(config: RequestOptions): boolean {
  let list = [config.url == "/api/v1/toystory/wechat/login/session" && config.method == "POST"];
  let bol = false;
  for (const item of list) {
    if (item) {
      bol = true;
    }
  }
  return bol;
}

// 定义上传文件选项接口
interface UploadOptions {
  url: string;
  filePath: string;
  name: string;
  formData?: Record<string, any>;
}

/**
 * 上传文件封装
 * @param {Object} options
 * options.url: 上传接口地址
 * options.filePath: 要上传文件资源的本地路径
 * options.name: 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
 * options.formData: HTTP 请求中其他额外的 form data
 */
export const uploadFile = (options: UploadOptions) => {
  return new Promise<any>((resolve, reject) => {
    const config = getConfig();
    let BASEURL = config.apiUrl;
    const token = uni.getStorageSync("token");

    uni.uploadFile({
      url: options.url.includes("http") ? options.url : BASEURL + options.url,
      filePath: options.filePath,
      name: options.name,
      formData: options.formData || {},
      header: {
        Authorization: `Bearer ${token}`,
      },
      success: (res: any) => {
        console.log("res upload", res);
        try {
          const data = JSON.parse(res.data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            return resolve(data);
          }
          uni.showToast({
            icon: "none",
            title: data?.resultMsg || "上传失败",
            duration: 2000,
          });
          reject(data);
        } catch (e) {
          reject(e);
        }
      },
      fail: (err: any) => {
        uni.showToast({
          icon: "none",
          title: "上传失败",
          duration: 2000,
        });
        reject(err);
      },
    });
  });
};
