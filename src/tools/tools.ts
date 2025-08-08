// 防抖函数
export const debounce = (fn: (...args: any[]) => void, delay: number) => {
  let timer: number | null = null;
  return function (this: any, ...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

// 节流函数
export const throttle = (fn: (...args: any[]) => void, delay: number) => {
  let flag = true;
  return function (this: any, ...args: any[]) {
    if (!flag) return;
    flag = false;
    setTimeout(() => {
      fn.apply(this, args);
      flag = true;
    }, delay);
  };
};

export const arrayBufferToString = (arr: any) => {
  if (typeof arr === "string") {
    return arr;
  }
  const dataview = new DataView(arr);
  const ints = new Uint8Array(arr.byteLength);
  for (let i = 0; i < ints.length; i++) {
    ints[i] = dataview.getUint8(i);
  }
  arr = ints;
  let str = "";
  const _arr = arr;
  for (let i = 0; i < _arr.length; i++) {
    const one = _arr[i].toString(2);
    const v = one.match(/^1+?(?=0)/);
    if (v && one.length === 8) {
      const bytesLength = v[0].length;
      let store = _arr[i].toString(2).slice(7 - bytesLength);
      for (let st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(_arr[i]);
    }
  }
  return str;
};
