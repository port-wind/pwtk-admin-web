<script setup lang="ts" name="Zodiac12WuxingPage">
import { useStore } from '@nanostores/vue'

import { computed, reactive, onMounted } from 'vue'
import type { IDatas } from './type'
import { gameStore, getShengXiaoToNumber, getWuXingToNumber, getPlayTypes, getChongOfRule } from '../store/gameStore'
import {
  defaultKillMapData,
  defaultZodiacData,
  defaultWuxingData,
  defaultWaveColorData,
  defaultOddEvenData,
  defaultZodiacAttributesMap,
  type ZodiacItem,
  type WuxingItem,
  type WaveColorItem,
  type OddEvenItem,
  type AttributeItem,
  type ZodiacAttributeConfig
} from './defaultData'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()
const gameStoreData = useStore(gameStore)

// 格式化生肖数据的辅助函数
const formatZodiacData = (data: any): string => {
  if (Array.isArray(data)) {
    return data.join('')
  }
  return String(data || '')
}

// 构建琴棋书画字符串
const buildQinqishuhuaString = (playTypes: any[]): string => {
  const playType = playTypes.find((item) => item.code === '8131')
  if (playType?.options) {
    const parts: string[] = []
    if (playType.options['琴']) {
      parts.push(`琴：${formatZodiacData(playType.options['琴'])}`)
    }
    if (playType.options['棋']) {
      parts.push(`棋：${formatZodiacData(playType.options['棋'])}`)
    }
    if (playType.options['书']) {
      parts.push(`书：${formatZodiacData(playType.options['书'])}`)
    }
    if (playType.options['画']) {
      parts.push(`画：${formatZodiacData(playType.options['画'])}`)
    }
    return parts.join('　')
  }
  return ''
}

// 构建女肖字符串（特殊处理五宫肖）
const buildFemaleZodiacString = (playTypes: any[]): string => {
  const playType = playTypes.find((item) => item.code === '8069')
  if (playType?.options && playType.options['女肖']) {
    const femaleZodiacs = Array.isArray(playType.options['女肖'])
      ? playType.options['女肖'].join('、')
      : playType.options['女肖']
    return `${femaleZodiacs}（五宫肖）`
  }
  return ''
}

// 通用数据获取函数
const getRegularData = (playTypes: any[], code: string, key: string): string => {
  const playType = playTypes.find((item) => item.code === code)
  if (playType?.options && playType.options[key]) {
    const zodiacArray = playType.options[key]
    return Array.isArray(zodiacArray) ? zodiacArray.join('、') : zodiacArray
  }
  return ''
}

// 生肖冲突映射 - 初始化为空对象，在onMounted中从gameStore加载
const killMap = reactive<Record<string, string>>({})

// 生肖图片映射
const zodiacImageMap = {
  蛇: 'she.gif',
  龙: 'long.gif',
  兔: 'tu.gif',
  虎: 'hu.gif',
  牛: 'niu.gif',
  鼠: 'shu.gif',
  猪: 'zhu.gif',
  狗: 'gou.gif',
  鸡: 'ji.gif',
  猴: 'hou.gif',
  羊: 'yang.gif',
  马: 'ma.gif'
}

// 生肖数据映射 - 初始化为空数组，在onMounted中从mockData加载
const zodiacList = reactive<ZodiacItem[]>([])

// 五行颜色映射
const wuxingColorMap = {
  金: '#ffcc00',
  木: '#33cc33',
  水: '#3399ff',
  火: '#ff6600',
  土: '#cc9900'
}

// 五行数据 - 初始化为空数组，在onMounted中从gameStore加载
const wuxingList = reactive<WuxingItem[]>([])

// 波色颜色映射
const waveColorMap = {
  红波: '#ff0000',
  蓝波: '#3366ff',
  绿波: '#009933'
}

// 波色数据 - 初始化为空数组，在onMounted中从gameStore加载
const waveColorList = reactive<WaveColorItem[]>([])

// 合数单双颜色映射
const oddEvenColorMap = {
  合数单: '#3366ff',
  合数双: '#3366ff'
}

// 合数单双数据 - 初始化为空数组，在onMounted中从gameStore加载
const oddEvenList = reactive<OddEvenItem[]>([])

// Strategy Pattern: 生肖属性标签到数据获取策略的映射
const zodiacAttributeCodeMap: Record<string, ZodiacAttributeConfig> = {
  家禽: { getData: (playTypes) => getRegularData(playTypes, '8061', '家禽') },
  野兽: { getData: (playTypes) => getRegularData(playTypes, '8061', '野兽') },
  吉美: { getData: (playTypes) => getRegularData(playTypes, '8075', '吉美') },
  凶丑: { getData: (playTypes) => getRegularData(playTypes, '8075', '凶丑') },
  阴性: { getData: (playTypes) => getRegularData(playTypes, '8067', '阴肖') },
  阳性: { getData: (playTypes) => getRegularData(playTypes, '8067', '阳肖') },
  单笔: { getData: (playTypes) => getRegularData(playTypes, '8093', '单笔肖') },
  双笔: { getData: (playTypes) => getRegularData(playTypes, '8093', '双笔肖') },
  天肖: { getData: (playTypes) => getRegularData(playTypes, '8089', '天肖') },
  地肖: { getData: (playTypes) => getRegularData(playTypes, '8089', '地肖') },
  白边: { getData: (playTypes) => getRegularData(playTypes, '8079', '白肖') },
  黑中: { getData: (playTypes) => getRegularData(playTypes, '8079', '黑肖') },
  女肖: { getData: (playTypes) => buildFemaleZodiacString(playTypes) },
  男肖: { getData: (playTypes) => getRegularData(playTypes, '8069', '男肖') },
  三合: { getData: () => '鼠龙猴、牛蛇鸡、虎马狗、兔羊猪' },
  六合: { getData: () => '鼠牛、龙鸡、虎猪、蛇猴、兔狗、马羊' },
  琴棋书画: { getData: (playTypes) => buildQinqishuhuaString(playTypes) },
  五福肖: { getData: () => '鼠、虎、兔、蛇、猴[龙]' },
  红肖: { getData: (playTypes) => getRegularData(playTypes, '8114', '红肖') },
  蓝肖: { getData: (playTypes) => getRegularData(playTypes, '8114', '蓝肖') },
  绿肖: { getData: (playTypes) => getRegularData(playTypes, '8114', '绿肖') }
}

// 获取默认生肖属性（fallback）
const getDefaultZodiacAttributes = (label: string): string => {
  return defaultZodiacAttributesMap[label] || ''
}

// Vue 3最佳实践：使用Strategy Pattern动态生成生肖属性数据
const zodiacAttributesList = computed<AttributeItem[]>(() => {
  const playTypes = getPlayTypes()
  const result: AttributeItem[] = []

  Object.entries(zodiacAttributeCodeMap).forEach(([label, config]) => {
    // 使用Strategy Pattern：每个配置项都有自己的getData方法
    let animals = config.getData(playTypes)

    // 如果Strategy没有返回数据，使用默认值作为fallback
    if (!animals) {
      animals = getDefaultZodiacAttributes(label)
    }

    result.push({ label, animals })
  })

  return result
})

// 波色名称到CSS类名的映射
const waveColorToCssClassMap = {
  红波: 'red',
  蓝波: 'blue',
  绿波: 'green'
}

// Vue 3最佳实践：基于动态数据的响应式计算属性
const numberToColorClassMap = computed(() => {
  const map = new Map<string, string>()

  // 基于动态加载的waveColorList构建映射
  waveColorList.forEach((waveColor) => {
    const cssClass = waveColorToCssClassMap[waveColor.name as keyof typeof waveColorToCssClassMap]
    if (cssClass && waveColor.numbers) {
      waveColor.numbers.forEach((number) => {
        map.set(number, cssClass)
      })
    }
  })

  return map
})

// 获取数字颜色类名 - 现在基于动态数据
const getNumberColorClass = (number: string): string => {
  return numberToColorClassMap.value.get(number) || ''
}

// 获取图片路径
const getImagePath = (imageName: string) => {
  try {
    return new URL(`./shengxiao/${imageName}`, import.meta.url).href
  } catch (error) {
    console.error('Error loading image:', imageName, error)
    return ''
  }
}

// 图片加载错误处理
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (target) {
    target.style.display = 'none'
  }
}

// 计算样式
const containerStyle = computed(() => ({
  backgroundColor: props.datas.configParamJson.styleMain?.backgroundColor || '#edeff0',
  padding: `0px`
}))

const headerStyle = computed(() => {
  const header = props.datas.configParamJson.styleHeader
  if (header?.isGradient) {
    return {
      background: `linear-gradient(to right, ${header.headerBg || '#d11717'}, ${header.headerBg2 || '#d12525'})`
    }
  }
  return {
    backgroundColor: header?.headerBgColor || '#d11717'
  }
})

// 加载生肖数据的函数
const loadZodiacData = () => {
  try {
    // 从gameStore的playRules加载生肖数据
    const shengXiaoToNumber = getShengXiaoToNumber()

    if (shengXiaoToNumber && Object.keys(shengXiaoToNumber).length > 0) {
      // 按照playRules中shengXiaoToNumber的键顺序构建zodiacList - Vue 3最佳实践
      const newZodiacData = Object.keys(shengXiaoToNumber).map((zodiacName) => ({
        name: zodiacName,
        image: zodiacImageMap[zodiacName as keyof typeof zodiacImageMap] || `${zodiacName}.gif`,
        clash: killMap[zodiacName as keyof typeof killMap] || '',
        numbers: shengXiaoToNumber[zodiacName]
      }))

      // Vue 3 最佳实践：直接替换数组内容
      Object.assign(zodiacList, newZodiacData)

      console.log('Zodiac data loaded from gameStore playRules:', zodiacList)
    } else {
      console.warn('playRules.shengXiaoToNumber not found, using default data')
      // 如果playRules不存在，使用默认数据作为fallback
      Object.assign(zodiacList, defaultZodiacData)
    }
  } catch (error) {
    console.error('Error loading zodiac data:', error)
  }
}

// 加载五行数据的函数
const loadWuxingData = () => {
  try {
    // 从gameStore的playRules加载五行数据
    const wuXingToNumber = getWuXingToNumber()

    if (wuXingToNumber && Object.keys(wuXingToNumber).length > 0) {
      // 按照playRules中wuXingToNumber的键顺序构建wuxingList - Vue 3最佳实践
      const newWuxingData = Object.keys(wuXingToNumber).map((wuxingName) => ({
        name: wuxingName,
        color: wuxingColorMap[wuxingName as keyof typeof wuxingColorMap] || '#333333',
        numbers: wuXingToNumber[wuxingName]
      }))

      // Vue 3 最佳实践：直接替换数组内容
      Object.assign(wuxingList, newWuxingData)

      console.log('Wuxing data loaded from gameStore playRules:', wuxingList)
    } else {
      console.warn('playRules.wuXingToNumber not found, using default data')
      // 如果playRules不存在，使用默认数据作为fallback
      Object.assign(wuxingList, defaultWuxingData)
    }
  } catch (error) {
    console.error('Error loading wuxing data:', error)
  }
}

// 加载波色数据的函数
const loadWaveColorData = () => {
  try {
    // 从gameStore的playTypes加载波色数据 (code: '8007')
    const playTypes = getPlayTypes()
    const waveColorData = playTypes.find((item) => item.code === '8007')?.options || {}

    if (waveColorData && Object.keys(waveColorData).length > 0) {
      // 按照playTypes中波色数据的键顺序构建waveColorList - Vue 3最佳实践
      const newWaveColorData = Object.keys(waveColorData).map((waveColorName) => ({
        name: waveColorName,
        color: waveColorMap[waveColorName as keyof typeof waveColorMap] || '#333333',
        numbers: waveColorData[waveColorName]
      }))

      // Vue 3 最佳实践：直接替换数组内容
      Object.assign(waveColorList, newWaveColorData)

      console.log('Wave color data loaded from gameStore playTypes:', waveColorList)
    } else {
      console.warn('playTypes code 8007 not found, using default data')
      // 如果playTypes不存在，使用默认数据作为fallback
      Object.assign(waveColorList, defaultWaveColorData)
    }
  } catch (error) {
    console.error('Error loading wave color data:', error)
  }
}

// 加载生肖冲突数据的函数
const loadKillMapData = () => {
  try {
    // 从gameStore的playRules加载生肖冲突数据
    const chongOfRule = getChongOfRule()

    if (chongOfRule && Object.keys(chongOfRule).length > 0) {
      // Vue 3 最佳实践：直接替换对象内容
      Object.assign(killMap, chongOfRule)

      console.log('Kill map data loaded from gameStore playRules:', killMap)
    } else {
      console.warn('playRules.chong not found, using default data')
      // 如果playRules不存在，使用默认数据作为fallback
      Object.assign(killMap, defaultKillMapData)
    }
  } catch (error) {
    console.error('Error loading kill map data:', error)
  }
}

// 加载合数单双数据的函数
const loadOddEvenData = () => {
  try {
    // 从gameStore的playTypes加载合数单双数据 (code: '8018')
    const playTypes = getPlayTypes()
    const oddEvenData = playTypes.find((item) => item.code === '8018')?.options || {}

    if (oddEvenData && Object.keys(oddEvenData).length > 0) {
      // 按照playTypes中合数单双数据的键顺序构建oddEvenList - Vue 3最佳实践
      const newOddEvenData = Object.keys(oddEvenData).map((oddEvenName) => ({
        name: oddEvenName,
        color: oddEvenColorMap[oddEvenName as keyof typeof oddEvenColorMap] || '#3366ff',
        numbers: oddEvenData[oddEvenName]
      }))

      // Vue 3 最佳实践：直接替换数组内容
      Object.assign(oddEvenList, newOddEvenData)

      console.log('Odd even data loaded from gameStore playTypes:', oddEvenList)
    } else {
      console.warn('playTypes code 8018 not found, using default data')
      // 如果playTypes不存在，使用默认数据作为fallback
      Object.assign(oddEvenList, defaultOddEvenData)
    }
  } catch (error) {
    console.error('Error loading odd even data:', error)
  }
}

onMounted(async () => {
  try {
    console.log('gameStoreData:', gameStoreData.value)

    // 加载生肖冲突数据 (需要在loadZodiacData之前加载)
    loadKillMapData()

    // 加载生肖数据
    loadZodiacData()

    // 加载五行数据
    loadWuxingData()

    // 加载波色数据
    loadWaveColorData()

    // 加载合数单双数据
    loadOddEvenData()
  } catch (error) {
    console.error('Error in onMounted:', error)
  }
})
</script>

<template>
  <div class="sxsx p-all" :style="containerStyle" v-if="datas.configParamJson.enable">
    <div class="bg br-12">
      <div class="pb-head sxsx-head" :style="headerStyle">
        <div class="pb-tit sxsx-tit">
          {{ datas.configParamJson.title || '香港赛马会【2025生肖属性】' }}
        </div>
      </div>
      <div class="sxsx-content br-12">
        <div class="sx">
          <!-- 生肖号码对照表 -->
          <table class="data-table">
            <tbody>
              <tr>
                <th class="text-center">2025蛇年（十二生肖号码对照）</th>
              </tr>
              <tr>
                <td>
                  <ul class="sx1 clearfix">
                    <li v-for="zodiac in zodiacList" :key="zodiac.name">
                      <dl>
                        <dt>
                          {{ zodiac.name }}
                          <img
                            :src="getImagePath(zodiac.image)"
                            width="40"
                            height="40"
                            draggable="false"
                            @error="handleImageError"
                            alt="zodiac.name"
                          />
                          [冲 {{ zodiac.clash }}]
                        </dt>
                        <dd :class="zodiac.name === '蛇' ? 'tm01' : ''">
                          <span v-for="number in zodiac.numbers" :key="number" :class="getNumberColorClass(number)">
                            {{ number }}
                          </span>
                        </dd>
                      </dl>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- 五行对照表 -->
          <table class="data-table two-column">
            <colgroup>
              <col class="narrow-col" />
              <col class="wide-col" />
            </colgroup>
            <tbody>
              <tr>
                <th colspan="2" class="text-center">五行对照</th>
              </tr>
              <tr v-for="wuxing in wuxingList" :key="wuxing.name">
                <td class="text-center">
                  <span class="wuxing-label" :style="{ color: wuxing.color }">{{ wuxing.name }}</span>
                </td>
                <td class="a-left">
                  <span v-for="number in wuxing.numbers" :key="number" :class="getNumberColorClass(number)">
                    {{ number }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- 波色表 -->
          <table class="data-table two-column">
            <colgroup>
              <col class="narrow-col" />
              <col class="wide-col" />
            </colgroup>
            <tbody>
              <tr>
                <th colspan="2" class="text-center">波色</th>
              </tr>
              <tr v-for="wave in waveColorList" :key="wave.name">
                <td class="text-center">
                  <span class="wave-label" :style="{ color: wave.color }">{{ wave.name }}</span>
                </td>
                <td class="a-left">
                  <span v-for="number in wave.numbers" :key="number" :class="getNumberColorClass(number)">
                    {{ number }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- 合数单双表 -->
          <table class="data-table two-column">
            <colgroup>
              <col class="narrow-col" />
              <col class="wide-col" />
            </colgroup>
            <tbody>
              <tr>
                <th colspan="2" class="text-center">合数单双</th>
              </tr>
              <tr v-for="item in oddEvenList" :key="item.name">
                <td class="text-center">
                  <span class="odd-even-label" :style="{ color: `${item.color} !important` }">{{ item.name }}</span>
                </td>
                <td class="a-left">
                  <span v-for="number in item.numbers" :key="number" :class="getNumberColorClass(number)">
                    {{ number }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- 生肖属性表 -->
          <table class="data-table attributes-table">
            <colgroup>
              <col class="full-width" />
            </colgroup>
            <tbody>
              <tr>
                <th class="text-center">生肖属性</th>
              </tr>
              <tr v-for="attribute in zodiacAttributesList" :key="attribute.label">
                <td class="text-center">
                  <template v-if="attribute.label === '琴棋书画'">
                    <span class="attribute-label" :style="{ color: '#3366ff' }">琴</span>
                    ：兔蛇鸡
                    <span class="attribute-label" :style="{ color: '#3366ff' }">棋</span>
                    ：鼠牛狗
                    <span class="attribute-label" :style="{ color: '#3366ff' }">书</span>
                    ：虎龙马
                    <span class="attribute-label" :style="{ color: '#3366ff' }">画</span>
                    ：羊猴猪
                  </template>
                  <template v-else>
                    <span class="attribute-label" :style="{ color: '#3366ff' }">{{ attribute.label }}：</span>
                    {{ attribute.animals }}
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 必需的删除按钮插槽 -->
    <slot name="deles" />
  </div>
</template>

<style scoped lang="scss">
// 引入原有的CSS样式
.sxsx {
  &.p-all {
    padding: 0 8px 8px 8px;
  }
}

.bg {
  &.br-12 {
    border-radius: 12px;
    overflow: hidden;
  }
}

.pb-head {
  &.sxsx-head {
    padding: 8px 16px 8px 16px;
  }
}

.pb-tit {
  &.sxsx-tit {
    font-size: 22px;
    color: #fff;
    font-weight: 600;
    margin: 0;
    text-align: center;
  }
}

.sxsx-content {
  font-size: 20px;
  background: #fff;
}

// 现代化表格样式
.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  text-align: center;
  color: rgb(229 35 5);
  word-break: break-word;
  margin-bottom: 16px;
  border: 0;

  // 列宽定义
  &.two-column {
    .narrow-col {
      width: 50px;
    }

    .wide-col {
      width: auto;
    }
  }

  &.attributes-table {
    .full-width {
      width: 100%;
    }
  }

  th {
    background: #f5f5f5;
    padding: 12px 8px;
    font-size: 18px;
    font-weight: bold;
    border: 1px solid #e5e5e5;
  }

  td {
    padding: 6px 4px;
    line-height: 22px;
    border: 1px solid #e5e5e5;

    &.a-left {
      text-align: left;
      padding: 8px;
    }
  }

  span {
    height: 18px;
    line-height: 18px;
    margin: 0 2px;
    padding: 0 3px;
    font-size: 16px;
    color: #000;
    display: inline-block;
    border-radius: 2px;

    &.red {
      background-color: #f00;
      color: #fff;
    }

    &.blue {
      background-color: #3366ff;
      color: #fff;
    }

    &.green {
      background-color: #009933;
      color: #fff;
    }
  }
}

// 文本对齐工具类
.text-center {
  text-align: center;
}

// 专用标签样式
.wuxing-label,
.wave-label,
.odd-even-label,
.attribute-label {
  font-weight: bold;
}

.sx1 {
  display: block;
  list-style-type: none;
  margin: 0;
  padding: 0;

  li {
    float: left;
    width: 33.333333%;
    padding: 5px 0;
    text-align: center;

    @media (min-width: 320px) and (max-width: 359px) {
      width: 50%;
    }

    @media (min-width: 360px) and (max-width: 374px) {
      width: 50%;
    }

    @media (min-width: 768px) {
      width: 25%;
    }

    dl {
      margin: 0;
      padding: 0;

      dt {
        font-size: 14px;
        margin-bottom: 4px;

        img {
          vertical-align: middle;
          border: 0;
          width: 40px;
          height: 40px;
          display: block;
          margin: 4px auto;
        }
      }

      dd {
        margin: 0;
        padding: 0;

        &.tm01 span {
          @media (min-width: 375px) and (max-width: 392px) {
            margin: 0 1px;
            padding: 0 2px;
          }

          @media (min-width: 393px) and (max-width: 413px) {
            margin: 0 1px;
            padding: 0 2px;
          }
        }
      }
    }
  }
}

.clearfix:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  overflow: hidden;
  visibility: hidden;
}

.clearfix {
  /* IE6/7 clearfix hack - replaced with modern clearfix above */
}
</style>
