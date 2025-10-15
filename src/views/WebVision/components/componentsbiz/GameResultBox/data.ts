import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

import am from '../assets/country/am.png'
import tw from '../assets/country/tw-96.png'
import xg from '../assets/country/xg.png'
import xjp from '../assets/country/xjp-96.png'
import kl8 from '../assets/country/kl8.png'
import tabGif from '../assets/gfkj.gif'

export const display = import.meta.env.PUBLIC_DISPLAY

// 彩种图标 特殊处理 display 为 true 时，使用 src 属性，否则使用图片路径
export const GAME_ICONS = {
  '3995': display ? xjp.src : xjp,
  '2032': display ? am.src : am,
  '1': display ? xg.src : xg,
  '84': display ? tw.src : tw,
  '5': display ? am.src : am,
  '6': display ? kl8.src : kl8
}

export const convertDataFormat = (data: string) => {
  // 设置中文本地化
  dayjs.locale('zh-cn')
  const date = dayjs(data)

  // 格式化为：06月20日 星期五 21点32分
  const month = date.format('MM')
  const day = date.format('DD')
  const weekday = date.format('dddd')
  const hour = date.format('HH')
  const minute = date.format('mm')

  return `${month}月${day}日 ${weekday} ${hour}点${minute}分`
}

export const truncateString = (str: string): string => {
  let newStr = str.toString()
  if (newStr.length > 4) {
    return newStr.slice(4)
  }
  return newStr
}
