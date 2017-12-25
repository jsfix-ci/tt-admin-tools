/**
 * 格式化查询参数
 * @param obj 查询对象
 * @returns 查询字符串
 */
export function getQueryString(obj) {
  let str = '';
  if (!obj) {
    return str;
  }
  Object.keys(obj).forEach(key => {
    str += `${key}=${obj[key]}&`;
  });
  str = str.replace(/\&$/, '');

  return str;
}

/**
 * 获取图片的base64
 * @param img 图片
 * @param callback {result: 带头部的base64 , base64: 没有头部的base64} 
 */
export function getBase64(img, callback: (result: string, base64: string) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    callback(reader.result, reader.result.split(',')[1]);
  });
  reader.readAsDataURL(img);
}

/**
 * 判断是不是图片文件
 * @param fileType 图片类型
 */
export function isImage(fileType: string) {
  return fileType === 'image/jpeg' || fileType === 'image/png';
}

/**
 * 分转元
 * @param money 分
 * @param precision 精度 
 */
export function fen2yuan(money, precision = 2) {
  return (money / 100).toFixed(precision);
}