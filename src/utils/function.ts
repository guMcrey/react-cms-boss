import pinyin from 'tiny-pinyin'

// convert string to url
export function convertToUrl(value: string) {
  if (!value) {
    return
  }
  // filter special characters (no spaces)
  const pattern = /[`~!@#_$%^&*()=|{}':;',\\\[\\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]/g
  let finalValueChar = value.replace(pattern, '')
  const regExp = new RegExp('[\\u4E00-\\u9FFF]', 'g')

  // chinese
  if (regExp.test(finalValueChar)) {
    finalValueChar = pinyin.convertToPinyin(finalValueChar)
  }
  return finalValueChar.toLocaleLowerCase().split(' ').join('-')
}

// debounce: wait 1s
// TODO: bug
export function debounce<Params extends any[]>(func: (...args: Params) => any, delay = 1000): (...args: Params) => void {
  let timer: NodeJS.Timeout
  return (...args: Params) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, delay)
  }
}
