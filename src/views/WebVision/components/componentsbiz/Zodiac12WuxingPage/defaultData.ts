// 类型定义
export interface ZodiacItem {
  name: string
  image: string
  clash: string
  numbers: string[]
}

export interface WuxingItem {
  name: string
  color: string
  numbers: string[]
}

export interface WaveColorItem {
  name: string
  color: string
  numbers: string[]
}

export interface OddEvenItem {
  name: string
  color: string
  numbers: string[]
}

export interface AttributeItem {
  label: string
  animals: string
}

export interface ZodiacAttributeConfig {
  getData: (_: any[]) => string
}
// 默认生肖冲突映射
export const defaultKillMapData: Record<string, string> = {
  蛇: '猪',
  龙: '狗',
  兔: '鸡',
  虎: '猴',
  牛: '羊',
  鼠: '马',
  猪: '蛇',
  狗: '龙',
  鸡: '兔',
  猴: '虎',
  羊: '牛',
  马: '鼠'
}

// 默认生肖数据
export const defaultZodiacData: ZodiacItem[] = [
  { name: '蛇', image: 'she.gif', clash: '猪', numbers: ['01', '13', '25', '37', '49'] },
  { name: '龙', image: 'long.gif', clash: '狗', numbers: ['02', '14', '26', '38'] },
  { name: '兔', image: 'tu.gif', clash: '鸡', numbers: ['03', '15', '27', '39'] },
  { name: '虎', image: 'hu.gif', clash: '猴', numbers: ['04', '16', '28', '40'] },
  { name: '牛', image: 'niu.gif', clash: '羊', numbers: ['05', '17', '29', '41'] },
  { name: '鼠', image: 'shu.gif', clash: '马', numbers: ['06', '18', '30', '42'] },
  { name: '猪', image: 'zhu.gif', clash: '蛇', numbers: ['07', '19', '31', '43'] },
  { name: '狗', image: 'gou.gif', clash: '龙', numbers: ['08', '20', '32', '44'] },
  { name: '鸡', image: 'ji.gif', clash: '兔', numbers: ['09', '21', '33', '45'] },
  { name: '猴', image: 'hou.gif', clash: '虎', numbers: ['10', '22', '34', '46'] },
  { name: '羊', image: 'yang.gif', clash: '牛', numbers: ['11', '23', '35', '47'] },
  { name: '马', image: 'ma.gif', clash: '鼠', numbers: ['12', '24', '36', '48'] }
]

// 默认五行数据
export const defaultWuxingData: WuxingItem[] = [
  { name: '金', color: '#ffcc00', numbers: ['03', '04', '11', '12', '25', '26', '33', '34', '41', '42'] },
  { name: '木', color: '#33cc33', numbers: ['07', '08', '15', '16', '23', '24', '37', '38', '45', '46'] },
  { name: '水', color: '#3399ff', numbers: ['13', '14', '21', '22', '29', '30', '43', '44'] },
  {
    name: '火',
    color: '#ff6600',
    numbers: ['01', '02', '09', '10', '17', '18', '31', '32', '39', '40', '47', '48']
  },
  { name: '土', color: '#cc9900', numbers: ['05', '06', '19', '20', '27', '28', '35', '36', '49'] }
]

// 默认波色数据
export const defaultWaveColorData: WaveColorItem[] = [
  {
    name: '红波',
    color: '#ff0000',
    numbers: ['01', '02', '07', '08', '12', '13', '18', '19', '23', '24', '29', '30', '34', '35', '40', '45', '46']
  },
  {
    name: '蓝波',
    color: '#3366ff',
    numbers: ['03', '04', '09', '10', '14', '15', '20', '25', '26', '31', '36', '37', '41', '42', '47', '48']
  },
  {
    name: '绿波',
    color: '#009933',
    numbers: ['05', '06', '11', '16', '17', '21', '22', '27', '28', '32', '33', '38', '39', '43', '44', '49']
  }
]

// 默认合数单双数据
export const defaultOddEvenData: OddEvenItem[] = [
  {
    name: '合数单',
    color: '#3366ff',
    numbers: [
      '01',
      '03',
      '05',
      '07',
      '09',
      '10',
      '12',
      '14',
      '16',
      '18',
      '21',
      '23',
      '25',
      '27',
      '29',
      '30',
      '32',
      '34',
      '36',
      '38',
      '41',
      '43',
      '45',
      '47',
      '49'
    ]
  },
  {
    name: '合数双',
    color: '#3366ff',
    numbers: [
      '02',
      '04',
      '06',
      '08',
      '11',
      '13',
      '15',
      '17',
      '19',
      '20',
      '22',
      '24',
      '26',
      '28',
      '31',
      '33',
      '35',
      '37',
      '39',
      '40',
      '42',
      '44',
      '46',
      '48'
    ]
  }
]

// 默认生肖属性映射
export const defaultZodiacAttributesMap: Record<string, string> = {
  家禽: '牛、马、羊、鸡、狗、猪',
  野兽: '鼠、虎、兔、龙、蛇、猴',
  吉美: '兔、龙、蛇、马、羊、鸡',
  凶丑: '鼠、牛、虎、猴、狗、猪',
  阴性: '鼠、龙、蛇、马、狗、猪',
  阳性: '牛、虎、兔、羊、猴、鸡',
  单笔: '鼠、龙、马、蛇、鸡、猪',
  双笔: '虎、猴、狗、兔、羊、牛',
  天肖: '兔、马、猴、猪、牛、龙',
  地肖: '蛇、羊、鸡、狗、鼠、虎',
  白边: '鼠、牛、虎、鸡、狗、猪',
  黑中: '兔、龙、蛇、马、羊、猴',
  女肖: '兔、蛇、羊、鸡、猪（五宫肖）',
  男肖: '鼠、牛、虎、龙、马、猴、狗',
  三合: '鼠龙猴、牛蛇鸡、虎马狗、兔羊猪',
  六合: '鼠牛、龙鸡、虎猪、蛇猴、兔狗、马羊',
  琴棋书画: '琴：兔蛇鸡　棋：鼠牛狗　书：虎龙马　画：羊猴猪',
  五福肖: '鼠、虎、兔、蛇、猴[龙]',
  红肖: '马、兔、鼠、鸡',
  蓝肖: '蛇、虎、猪、猴',
  绿肖: '羊、龙、牛、狗'
}
