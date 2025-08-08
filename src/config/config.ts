import { config as h5 } from "@/config/config.dev.h5";
import { config as test } from "@/config/config.dev.mp-weixin";
import { config as prod } from "@/config/config.prod.mp-weixin";

export interface Config {
  env: string;
  apiUrl: string;
}

export function getConfig() {
  const env = process.env.NODE_ENV;
  const platform = process.env.UNI_PLATFORM;
  console.log(platform);
  // 本地开发，用H5
  if (env == "development" && platform == "h5") {
    return h5;
  }
  // 测试环境，微信小程序17
  if (platform == "mp-weixin") {
    const envVersion = uni.getAccountInfoSync().miniProgram.envVersion;
    console.log("envVersion", envVersion);
    if (envVersion == "develop") {
      return test;
    } else if (envVersion == "trial") {
      return test;
    } else if (envVersion == "release") {
      return prod;
    }
  }

  return h5;
}
