export default function vitePluginCustomMade(options) {
  // 默认配置
  const defaultOptions = {
    appidMap: {
      default: 'default'
    },
    // 默认处理所有 Vue 文件
    include: /\.vue$/,
    // 排除目录
    exclude: /(node_modules|dist|\.hbuilderx)/,
  };

  // 合并用户配置和默认配置
  const finalOptions = {
    ...defaultOptions,
    ...options,
  };

  // 当前构建的目标 appid
  const currentAppid = finalOptions.appid;

  // 验证配置
  if (!currentAppid) {
    throw new Error("必须提供当前构建的 appid");
  }

  if (!finalOptions.appidMap[currentAppid]) {
    throw new Error(`未找到 ${currentAppid} 对应的 appid 映射`);
  }
       // 获取当前 appid 对应的值
       const currentAppidValue = finalOptions.appidMap[currentAppid];

  return {
    name: "vite-plugin-CustomMade",
    enforce: "pre",

    // 转换文件内容
    transform(code, id) {
      // 排除不需要处理的文件
      if (finalOptions.exclude.test(id)) return;

      // 检查是否在包含的文件类型中
      if (finalOptions.include.test(id)) {
        // 处理条件编译指令
        const processedCode = processConditionalBlocks(code, currentAppidValue);

        // 如果是 App.vue 文件，注入额外的导入语句
        if (id.includes("App.vue")) {
          return {
            code: processedCode.replace(
              /<script\b[^>]*>/,
              `$&\n${finalOptions.importStatement}\n`
            ),
            map: null,
          };
        }

        return {
          code: processedCode,
          map: null,
        };
      }
    },

    // 构建开始时的钩子
    buildStart() {
      console.log(`🚀 开始构建，目标 appid: ${currentAppid}`);
      console.log(`📋 配置信息:`, JSON.stringify(finalOptions, null, 2));
    },

    // 构建结束时的钩子
    closeBundle() {
      console.log(`✅ 构建完成，目标 appid: ${currentAppid}`);
      console.log(`⏱️ 完成时间: ${new Date().toLocaleString()}`);
    },
  };
}

// 优化后的条件编译处理函数
function processConditionalBlocks(code, currentAppid) {
  const conditionalBlockRegex =
    /(\s*)#\s*if\s+appid\s*==\s*(\w+| \d)([\s\S]*?)((?:#\s*elseif\s+appid\s*==\s*[\w+|\d+][\s\S]*?)*)(?:#\s*else([\s\S]*?))?\s*#\s*endif/g;

  return code.replace(conditionalBlockRegex, (match, indent, firstAppid, firstContent, elseifBlock, elseContent) => {
    let contentToKeep = "";
    // 检查 if 条件是否命中
    if (firstAppid == currentAppid) {
      contentToKeep = firstContent;
    } else {
      // 处理 elseif 块
      const elseifRegex = /#\s*elseif\s+appid\s*==\s*(\w+)([\s\S]*?)(?=#\s*elseif|#\s*else|$)/g;
      let elseifMatch;
      while ((elseifMatch = elseifRegex.exec(elseifBlock)) !== null) {
        const [_, elseifAppid, elseifContent] = elseifMatch;
        if (elseifAppid == currentAppid) {
          contentToKeep = elseifContent;
          break;
        }
      }

      // 如果 elseif 也不匹配，考虑 else
      if (!contentToKeep && elseContent) {
        contentToKeep = elseContent;
      }
    }

    // 保留缩进
    return contentToKeep
      .split("\n")
      .map((line) => (line.trim() ? indent + line : line))
      .join("\n");
  });
}


