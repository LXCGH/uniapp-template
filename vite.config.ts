import { defineConfig } from "vite";
import tailwindcss from "tailwindcss";
import uni from "@dcloudio/vite-plugin-uni";
import uniTailwind from "@uni-helper/vite-plugin-uni-tailwind";
import vitePluginCustomMade from "./my-plugin/index";
import productConfig from "./config/product";

const manifest = require("./src/manifest.json");
const pagesConfig = require("./src/pages.json");
const customAppid = process.argv.includes("--appid") ? process.argv[process.argv.indexOf("--appid") + 1].replace("--appid=", "") : "photo";

// console.log('appid', customAppid);
// console.log('productConfig', productConfig);
// console.log('customAppid', customAppid);

// 安全检查：如果配置不存在，使用默认配置
const config = productConfig[customAppid] || productConfig.photo;
const wxId = config.appid;
const wxName = config.name;
const tabBar = config.tabBarConfig;
// console.log('wxId', wxId);
// console.log('wxName', wxName);
// 替换 App.vue 文件中的内容
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "src/manifest.json");
manifest["mp-weixin"].appid = wxId;
manifest.name = wxName;
// console.log('manifest', JSON.stringify(manifest, null, 4));
fs.writeFileSync(filePath, JSON.stringify(manifest, null, 4), "utf8");
const appidMap = {};
for (const key in productConfig) {
  if (productConfig.hasOwnProperty(key)) {
    const appid = key;
    appidMap[appid] = productConfig[key].mapNum;
  }
}

const pagesfilePath = path.join(__dirname, "src/pages.json");
pagesConfig["tabBar"] = tabBar;
fs.writeFileSync(pagesfilePath, JSON.stringify(pagesConfig, null, 4), "utf8");

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  plugins: [
    uni(),
    uniTailwind(),
    vitePluginCustomMade({
      appid: customAppid, // 当前构建的目标 appid
      appidMap: appidMap,
      targetFile: "/src/App.vue",
      importStatement: `import \'@/common/styles/global.scss\'; import \'@/common/styles/global_${customAppid}.scss\';`,
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".vue"],
    alias: {
      "@": "/src",
    },
  },
});
