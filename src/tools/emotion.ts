// const emotionMap = new Map([
//   ['悲伤', '@/static/emotion/悲伤@2x.png'],
//   ['烦躁', '@/static/emotion/烦躁@2x.png'],
//   ['愤怒', '@/static/emotion/愤怒@2x.png'],
//   ['害怕', '@/static/emotion/害怕@2x.png'],
//   ['好奇', '@/static/emotion/好奇@2x.png'],
//   ['嫉妒', '@/static/emotion/嫉妒@2x.png'],
//   ['紧张', '@/static/emotion/紧张@2x.png'],
//   ['快乐', '@/static/emotion/快乐@2x.png'],
//   ['满足', '@/static/emotion/满足@2x.png'],
//   ['同情', '@/static/emotion/同情@2x.png'],
//   ['兴奋', '@/static/emotion/兴奋@2x.png'],
//   ['自信', '@/static/emotion/自信@2x.png'],
// ]);
const emotionMap = new Map([
  ['悲伤', '😢'],
  ['烦躁', '😣'],
  ['愤怒', '😡'],
  ['害怕', '😨'],
  ['好奇', '😲'],
  ['嫉妒', '😕'],
  ['紧张', '😓'],
  ['快乐', '😄'],
  ['满足', '😊'],
  ['同情', '😞'],
  ['兴奋', '😆'],
  ['自信', '😎'],
]);
const getEmotion = (key: string): string => {
  if (emotionMap.has(key)) {
    return emotionMap.get(key)!;
  }
  return '';
}

export { getEmotion }


