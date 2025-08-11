export const buf2hex = (buffer: ArrayBuffer) => {
  return Array.prototype.map.call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2)).join("");
};

/**
 * 将十六进制字符串转换为普通字符串
 * @param {string} hex - 十六进制字符串
 * @returns {string} - 转换后的普通字符串
 */
export const hexToStr = (hex: string) => {
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
};
