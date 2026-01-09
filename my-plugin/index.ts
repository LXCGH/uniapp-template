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

// 优化后的条件编译处理函数：支持嵌套和 HTML 注释包裹
function processConditionalBlocks(code, currentAppid) {
  // 匹配所有指令关键词，捕获整个条件表达式
  // 支持 # if appid == 102 || appid == 108
  // 注意：使用 [ \t] 避免跨行，使用 .*? 非贪婪匹配防止吞掉 -->
  const keywordRegex = /#\s*(if|elseif|else|endif)((?:[ \t]+).*?)?(?=\s*(?:-->|\*\/|[\r\n]|$))/g;

  const tokens = [];
  let match;

  while ((match = keywordRegex.exec(code)) !== null) {
    const type = match[1].toLowerCase();
    const value = match[2];
    let start = match.index;
    let end = match.index + match[0].length;

    // 向前查找前缀
    const beforeStr = code.slice(0, start);
    // 向后查找后缀（只查找当前行或紧邻的闭合符）
    const afterStr = code.slice(end);

    // 1. 检查 <!-- 前缀
    if (/<!--\s*$/.test(beforeStr)) {
      const prefixMatch = beforeStr.match(/<!--\s*$/);
      start -= prefixMatch[0].length;

      // 查找对应的 -->
      // 注意：这里简单假设 --> 在指令后，且不应跨越多行（通常指令独占一行或在同一行注释内）
      // 但为了兼容多行注释写法，我们向后查找最近的 -->
      const closeIndex = afterStr.search(/-->/);
      if (closeIndex !== -1) {
        end += closeIndex + 3; // 3 is length of -->
      }
    }
    // 2. 检查 /* 前缀
    else if (/\/\*\s*$/.test(beforeStr)) {
      const prefixMatch = beforeStr.match(/\/\*\s*$/);
      start -= prefixMatch[0].length;

      const closeIndex = afterStr.search(/\*\//);
      if (closeIndex !== -1) {
        end += closeIndex + 2; // 2 is length of */
      }
    }
    // 3. 检查 // 前缀
    else if (/\/\/\s*$/.test(beforeStr)) {
      const prefixMatch = beforeStr.match(/\/\/\s*$/);
      start -= prefixMatch[0].length;

      // // 注释到行尾结束，自然包括了指令本身
      // 不需要额外扩展 end，除非我们需要吞掉换行符
      // 这里保持 end 在指令末尾即可，后续逻辑会处理掉整行内容(如果刚好整行就是指令)
    }

    // 扩展 end 到行尾 (如果后面只有空白)
    const remainingLine = code.slice(end).split('\n')[0];
    if (/^\s*$/.test(remainingLine)) {
      // 如果这一行剩下都是空白，可以吞掉，或者保留换行
    }

    tokens.push({
      type,
      value,
      start,
      end
    });
  }

  if (tokens.length === 0) return code;

  // 2. 标记需要删除的区域
  const removeRanges = [];
  // 所有指令行本身都需要被删除
  tokens.forEach(t => removeRanges.push([t.start, t.end]));

  // 递归处理逻辑块
  function processTokens(tokenList, parentActive) {
    for (let i = 0; i < tokenList.length; i++) {
      const token = tokenList[i];

      if (token.type === 'if') {
        let depth = 1;
        let endTokenIndex = -1;
        const branches = [{ token: token, index: i }];

        let j = i + 1;
        for (; j < tokenList.length; j++) {
          const t = tokenList[j];
          if (t.type === 'if') depth++;
          if (t.type === 'endif') depth--;

          if (depth === 0) {
            endTokenIndex = j;
            break;
          }
          if (depth === 1) {
            if (t.type === 'elseif' || t.type === 'else') {
              branches.push({ token: t, index: j });
            }
          }
        }

        if (endTokenIndex === -1) continue;

        let satisfiedBranchIndex = -1;
        if (parentActive) {
          for (let b = 0; b < branches.length; b++) {
            const br = branches[b];
            if (br.token.type === 'if' || br.token.type === 'elseif') {
              if (checkCondition(br.token.value, currentAppid)) {
                satisfiedBranchIndex = b;
                break;
              }
            } else {
              satisfiedBranchIndex = b; // else
              break;
            }
          }
        }

        for (let b = 0; b < branches.length; b++) {
          const branch = branches[b];
          const nextBranchStart = (b < branches.length - 1)
            ? branches[b + 1].token.start
            : tokenList[endTokenIndex].start;

          const contentStart = branch.token.end;
          const contentEnd = nextBranchStart;

          const subTokens = tokenList.filter(t => t.start >= contentStart && t.end <= contentEnd);

          if (b === satisfiedBranchIndex) {
            processTokens(subTokens, true);
          } else {
            removeRanges.push([contentStart, contentEnd]);
          }
        }
        i = endTokenIndex;
      }
    }
  }

  processTokens(tokens, true);

  // 3. 执行删除
  removeRanges.sort((a, b) => a[0] - b[0]);

  let finalCode = '';
  let lastPos = 0;
  for (const [start, end] of removeRanges) {
    if (start > lastPos) {
      finalCode += code.slice(lastPos, start);
    }
    lastPos = Math.max(lastPos, end);
  }
  if (lastPos < code.length) {
    finalCode += code.slice(lastPos);
  }

  return finalCode;
}

// 辅助函数：解析并检查条件表达式
function checkCondition(expression, currentAppid) {
  console.log(`[Plugin Debug] checkCondition: "${expression}", appid: ${currentAppid}`);
  if (!expression) return false;

  // 支持 || 逻辑分割
  const parts = expression.split('||');

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // 匹配 "appid == value"
    // 允许 value 带引号或不带引号
    const match = trimmed.match(/appid\s*==\s*['"]?([^'"\s]+)['"]?/);
    if (match) {
      console.log(`[Plugin Debug] Comparison: ${match[1]} == ${currentAppid} => ${match[1] == currentAppid}`);
      // 弱类型比较，因为 currentAppid 可能是数字或字符串
      if (match[1] == currentAppid) {
        return true;
      }
    }
  }

  return false;
}