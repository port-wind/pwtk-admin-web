#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

// 创建读取接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// 提示用户输入组件信息
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

// 组件类型选择
function askComponentType() {
  return new Promise((resolve) => {
    console.log('\n📋 请选择组件类型:')
    console.log('1. 静态组件 (Static Component) - 纯展示型，不依赖游戏数据')
    console.log('2. 动态组件 (Dynamic Component) - 依赖游戏类型数据，与 gameType store 集成')
    rl.question('请输入选择 (1 或 2): ', (answer) => {
      const choice = answer.trim()
      if (choice === '1') {
        resolve('static')
      } else if (choice === '2') {
        resolve('dynamic')
      } else {
        console.log('❌ 无效选择，默认选择静态组件')
        resolve('static')
      }
    })
  })
}

// 转换为 PascalCase
function toPascalCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return word.toUpperCase()
    })
    .replace(/\s+/g, '')
}

// 转换为 camelCase
function toCamelCase(str) {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

// 生成静态组件文件
function generateStaticComponent(componentName, componentDisplayName, componentDescription) {
  return `<script setup lang="ts" name="${componentName}">
import { computed, defineProps } from 'vue'
import type { IDatas } from './type'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()
const styleHeader = computed(() => props.datas.configParamJson.styleHeader)
const styleMain = computed(() => props.datas.configParamJson.styleMain)

// style 样式
const containerStyle = computed(() => {
  return {
    borderRadius: \`\${styleMain.value?.borderRadius || 0}px\`,
    padding: \`\${styleMain.value?.padding || 0}px\`,
    backgroundColor: styleMain.value?.backgroundColor || '#ffffff'
  }
})

const titleHeaderStyle = computed(() => {
  if (styleHeader.value.isGradient) {
    return {
      background: \`linear-gradient(to right,  \${styleHeader.value.headerBg}, \${styleHeader.value.headerBg2})\`
    }
  }
  return {
    backgroundColor: styleHeader.value?.headerBgColor || '#4a90e2'
  }
})

const mainTitleStyle = computed(() => {
  return {
    color: styleHeader.value?.titleColor || '#333333'
  }
})

const subTitleStyle = computed(() => {
  return {
    color: styleHeader.value?.subTitleColor || '#333333'
  }
})

const contentStyle = computed(() => {
  return {
    color: styleMain.value?.textColor || '#333333',
    fontSize: \`\${styleMain.value?.fontSize || 14}px\`,
    fontWeight: styleMain.value?.fontWeight || 400,
    textAlign: styleMain.value?.textAlign || 'center'
  }
})
</script>

<template>
  <div class="${componentName}">
    <div class="${componentName}-content" :style="containerStyle">
      <!-- 头部标题 -->
      <div class="title-header" :style="titleHeaderStyle">
        <h2 class="main-title" :style="mainTitleStyle">{{ datas.configParamJson.title }}</h2>
        <span class="sub-title" :style="subTitleStyle">{{ datas.configParamJson.subtitle }}</span>
      </div>
      <!-- 内容区域 -->
      <div class="content-area" :style="contentStyle">
        {{ datas.configParamJson.content }}
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<style scoped lang="scss">
.${componentName} {
  position: relative;
}

.title-header {
  padding: 12px 16px;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .main-title {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
  }

  .sub-title {
    font-size: 14px;
    opacity: 0.9;
  }
}

.content-area {
  padding: 16px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>`
}

// 生成动态组件文件
function generateDynamicComponent(componentName, componentDisplayName, componentDescription) {
  return `<script setup lang="ts" name="${componentName}">
import { computed, ref, watch, onMounted, reactive } from 'vue'
import { useStore } from '@nanostores/vue'
import { Loading } from '@element-plus/icons-vue'
import { gameStore } from '../store/index'
import type { IDatas } from './type'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()

// 🎮 gameType Store 集成 - 动态组件必需
const gameStoreData = useStore(gameStore)
const gameType = computed(() => gameStoreData.value.gameType)
const currentGame = computed(() => gameStoreData.value.currentGame)
const currentGameName = computed(() => currentGame.value?.name || '未知游戏')

// 🔄 响应式参数对象，与配置同步
const componentParams = reactive({
  gameType: props.datas.configParamJson.gameType || gameType.value,
  size: props.datas.configParamJson.size || 10,
  forumId: props.datas.configParamJson.forumId || '10'
})

// 组件状态
const loading = ref(false)
const gameData = ref([])
const error = ref(null)

// 样式计算
const styleHeader = computed(() => props.datas.configParamJson.styleHeader)
const styleMain = computed(() => props.datas.configParamJson.styleMain)

const containerStyle = computed(() => ({
  backgroundColor: styleMain.value?.backgroundColor || '#ffffff',
  borderRadius: \`\${styleMain.value?.borderRadius || 0}px\`,
  padding: \`\${styleMain.value?.padding || 16}px\`,
  margin: \`\${styleMain.value?.margin || 0}px\`
}))

const titleHeaderStyle = computed(() => {
  if (styleHeader.value?.isGradient) {
    return {
      background: \`linear-gradient(to right, \${styleHeader.value.headerBg}, \${styleHeader.value.headerBg2})\`
    }
  }
  return {
    backgroundColor: styleHeader.value?.headerBgColor || '#4a90e2'
  }
})

const mainTitleStyle = computed(() => ({
  color: styleHeader.value?.titleColor || '#ffffff'
}))

const subTitleStyle = computed(() => ({
  color: styleHeader.value?.subTitleColor || '#ffffff'
}))

const contentStyle = computed(() => ({
  color: styleMain.value?.textColor || '#333333',
  fontSize: \`\${styleMain.value?.fontSize || 14}px\`,
  fontWeight: styleMain.value?.fontWeight || 400,
  textAlign: styleMain.value?.textAlign || 'center',
  lineHeight: '1.5'
}))

// 🎮 游戏相关数据获取
const fetchGameData = async (gameType: string) => {
  if (!gameType) return
  
  loading.value = true
  error.value = null
  
  try {
    // TODO: 根据具体需求实现数据获取逻辑
    console.log(\`🎮 获取游戏数据: \${gameType}\`)
    
    // 模拟API调用
    // const response = await fetchSpecificGameData(gameType)
    // gameData.value = response.data || []
    
    // 临时数据
    gameData.value = [
      { id: 1, title: \`\${currentGameName.value}数据1\`, content: '示例内容' },
      { id: 2, title: \`\${currentGameName.value}数据2\`, content: '示例内容' }
    ]
  } catch (err) {
    error.value = err
    console.error('获取游戏数据失败:', err)
  } finally {
    loading.value = false
  }
}

// 🎯 监听游戏类型变化 - 全局store变化
watch(gameType, (newGameType) => {
  if (newGameType) {
    componentParams.gameType = newGameType
    console.log(\`🎮 全局游戏类型变化: \${newGameType}\`)
    fetchGameData(newGameType)
  }
}, { immediate: true })

// 📊 监听组件配置变化
watch(
  () => [props.datas.configParamJson.gameType, props.datas.configParamJson.size, props.datas.configParamJson.forumId],
  ([newGameType, newSize, newForumId]) => {
    if (newGameType) componentParams.gameType = newGameType
    if (newSize) componentParams.size = Number(newSize)
    if (newForumId) componentParams.forumId = String(newForumId)
    
    // 当配置的gameType变化时，重新获取数据
    if (newGameType && newGameType !== componentParams.gameType) {
      fetchGameData(newGameType)
    }
  },
  { deep: true }
)

// 🎮 游戏切换监听
watch(currentGame, (newGame) => {
  if (newGame) {
    fetchGameData(newGame.type || gameType.value)
  }
})

onMounted(() => {
  if (gameType.value) {
    fetchGameData(gameType.value)
  }
})
</script>

<template>
  <div class="${componentName}">
    <div 
      class="${componentName.toLowerCase()}-content" 
      :style="containerStyle"
      v-if="datas.configParamJson.enable"
    >
      <!-- 标题区域 - 支持动态游戏名称 -->
      <div v-if="datas.configParamJson.title" class="title-header" :style="titleHeaderStyle">
        <h2 class="main-title" :style="mainTitleStyle">
          {{ datas.configParamJson.title }} - {{ currentGameName }}
        </h2>
        <span v-if="datas.configParamJson.subtitle" class="sub-title" :style="subTitleStyle">
          {{ datas.configParamJson.subtitle }}
        </span>
      </div>
      
      <!-- 动态内容区域 -->
      <div class="content-area" :style="contentStyle">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>正在加载{{ currentGameName }}数据...</span>
        </div>
        
        <!-- 数据展示 -->
        <div v-else-if="gameData && gameData.length > 0" class="game-data-list">
          <div 
            v-for="(item, index) in gameData" 
            :key="item.id || index"
            class="game-data-item"
          >
            <div class="item-title">{{ item.title }}</div>
            <div class="item-content">{{ item.content }}</div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-else class="empty-state">
          <el-empty :description="\`暂无\${currentGameName}数据\`" />
        </div>
      </div>
    </div>
    
    <!-- 必需的删除按钮插槽 -->
    <slot name="deles" />
  </div>
</template>

<style scoped lang="scss">
.${componentName} {
  position: relative;
  
  .${componentName.toLowerCase()}-content {
    // 动态样式通过 computed 属性控制
  }
  
  .title-header {
    padding: 12px 16px;
    border-radius: 8px 8px 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .main-title {
      margin: 0;
      font-size: 18px;
      font-weight: bold;
    }
    
    .sub-title {
      font-size: 14px;
      opacity: 0.9;
    }
  }
  
  .content-area {
    padding: 16px;
    min-height: 120px;
    
    .loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 40px;
      color: #666;
    }
    
    .game-data-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .game-data-item {
        padding: 12px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        transition: all 0.3s ease;
        
        &:hover {
          border-color: #4a90e2;
          box-shadow: 0 2px 8px rgba(74, 144, 226, 0.1);
        }
        
        .item-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }
        
        .item-content {
          color: #666;
          font-size: 14px;
        }
      }
    }
    
    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }
  }
  
  // 响应式设计
  @media (max-width: 768px) {
    .title-header {
      padding: 8px 12px;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
    
    .content-area {
      padding: 12px;
      
      .game-data-item {
        padding: 8px;
      }
    }
  }
}
</style>`
}

// 生成类型定义文件
function generateTypeFile(componentName, componentDisplayName, componentType) {
  return `import type { ISetStyle } from '../componentProperties/index'

export interface IDatas extends ISetStyle<${componentName}Config> {}

export interface ${componentName}Config {
  title: string
  subtitle: string
  content: string
  enable: boolean
  ${
    componentType === 'dynamic'
      ? `showGameType: boolean
  gameType: string
  gameTypeCode: string
  forumId: string
  size: number`
      : ''
  }
  styleHeader: IStyleHeader
  styleMain: IStyleMain
}

export interface IStyleMain {
  padding: number
  borderRadius: number
  backgroundColor: string
  textAlign: 'left' | 'center' | 'right'
  fontSize: number
  fontWeight: number
  textColor: string
}

export interface IStyleHeader {
  backgroundColor: string
  isGradient: boolean
  headerBgColor: string
  headerBg: string
  headerBg2: string
  subTitleColor: string
  titleColor: string
}`
}

// 生成配置面板文件
function generateStyleComponent(componentName, componentDisplayName, componentType) {
  return `<script setup lang="ts" name="${componentName}Style">
import { ref, computed, defineProps } from 'vue'
import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'
import componentHeadTitle from '@/views/WebVision/components/rightslider/componentHeadTitle/index.vue'
import headerTitle from '@/views/WebVision/components/rightslider/headerTitle/index.vue'
${
  componentType === 'dynamic'
    ? "import StoreGameTypeList from '@/views/WebVision/components/rightslider/StoreGameTypeList/index.vue'"
    : ''
}

import type { FormInstance } from 'element-plus'
import type { IDatas } from '@/views/WebVision/components/componentsbiz/${componentName}/type'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()

const rules = ref({})
const ruleFormRef = ref<FormInstance>()

const textAlignOptions = ref([
  {
    label: '左对齐',
    value: 'left'
  },
  {
    label: '居中',
    value: 'center'
  },
  {
    label: '右对齐',
    value: 'right'
  }
])
</script>

<template>
  <div class="${componentName}Style">
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />
      <!-- 以下是组件的样式、数据配置 -->
      <componentHeadTitle :datas="datas" />
      <!-- Header样式配置 -->
      <header-title :datas="datas" />
      
      ${
        componentType === 'dynamic'
          ? `<!-- 游戏类型选择配置 - 动态组件必需 -->
      <StoreGameTypeList :datas="datas" />`
          : ''
      }

      <el-form-item label="内容文本" prop="content">
        <el-input 
          v-model="datas.configParamJson.content" 
          type="textarea"
          :rows="3"
          placeholder="请输入内容文本" 
        />
      </el-form-item>

      <el-form-item label="是否启用" prop="enable">
        <el-switch v-model="datas.configParamJson.enable" />
      </el-form-item>

      ${
        componentType === 'dynamic'
          ? `<el-form-item label="显示游戏类型" prop="showGameType">
        <el-switch v-model="datas.configParamJson.showGameType" />
      </el-form-item>

      <el-form-item label="数据条数" prop="size">
        <el-input-number 
          v-model="datas.configParamJson.size" 
          :min="1" 
          :max="50" 
          placeholder="请输入数据条数" 
        />
      </el-form-item>

      <el-form-item label="论坛ID" prop="forumId">
        <el-input 
          v-model="datas.configParamJson.forumId" 
          placeholder="请输入论坛ID" 
        />
      </el-form-item>`
          : ''
      }

      <!-- 样式设置 -->
      <el-divider content-position="left">样式配置</el-divider>

      <el-form-item label="背景颜色" prop="backgroundColor">
        <el-color-picker v-model="datas.configParamJson.styleMain.backgroundColor" show-alpha />
      </el-form-item>

      <el-form-item label="文字颜色" prop="textColor">
        <el-color-picker v-model="datas.configParamJson.styleMain.textColor" show-alpha />
      </el-form-item>

      <el-form-item label="文字大小" prop="fontSize">
        <el-slider
          v-model="datas.configParamJson.styleMain.fontSize"
          :min="12"
          :max="32"
          show-input
        />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="文字粗细" prop="fontWeight">
        <el-select v-model="datas.configParamJson.styleMain.fontWeight" placeholder="请选择文字粗细">
          <el-option :value="400" label="正常 (400)" />
          <el-option :value="500" label="中等 (500)" />
          <el-option :value="600" label="较粗 (600)" />
          <el-option :value="700" label="粗体 (700)" />
          <el-option :value="800" label="特粗 (800)" />
        </el-select>
      </el-form-item>

      <el-form-item label="文字对齐" prop="textAlign">
        <el-radio-group v-model="datas.configParamJson.styleMain.textAlign">
          <el-radio v-for="item in textAlignOptions" :key="item.value" :value="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="圆角" prop="borderRadius">
        <el-slider
          v-model="datas.configParamJson.styleMain.borderRadius"
          :min="0"
          :max="30"
          show-input
        />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="内边距" prop="padding">
        <el-slider
          v-model="datas.configParamJson.styleMain.padding"
          :min="0"
          :max="50"
          show-input
        />
        <span style="margin-left: 8px">px</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.${componentName}Style {
  .content-preview {
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 16px;
    margin-top: 12px;
    background: #fafafa;
    
    .preview-label {
      font-size: 12px;
      color: #909399;
      margin-bottom: 8px;
    }
    
    .preview-content {
      border: 1px dashed #d3d3d3;
      padding: 20px;
      border-radius: 4px;
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #909399;
    }
  }
}
</style>`
}

// 生成属性配置文件
function generatePropertiesFile(componentName, componentDisplayName, componentDescription, componentType) {
  return `import type { ${componentName}Config } from '../${componentName}/type'
import type { IComponentProperty, ISetStyle } from './index'

const componentProperties = new Map<string, IComponentProperty<ISetStyle<${componentName}Config>>>()

componentProperties.set('${componentName}', {
  component: '${componentName}',
  text: '${componentDisplayName}',
  active: false,
  style: '${componentName}Style',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '${componentDisplayName}',
    componentType: '${componentName}',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      title: '${componentDisplayName}',
      subtitle: '这是一个${componentDisplayName}',
      content: '这里是内容区域，您可以在此处添加任何文本内容。',
      enable: true,
      ${
        componentType === 'dynamic'
          ? `showGameType: false,
      gameType: '2032',
      gameTypeCode: 'a6',
      forumId: '10',
      size: 10,`
          : ''
      }
      styleHeader: {
        backgroundColor: '#f8f9fa',
        isGradient: true,
        headerBgColor: '#4a90e2',
        headerBg: '#4a90e2',
        headerBg2: '#5aa5f0',
        subTitleColor: '#ffffff',
        titleColor: '#ffffff'
      },
      styleMain: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 400,
        textColor: '#333333'
      }
    }
  }
})

export default componentProperties`
}

// 创建目录
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

// 写入文件
function writeFile(filePath, content) {
  ensureDirectoryExists(path.dirname(filePath))
  fs.writeFileSync(filePath, content, 'utf8')
}

// 更新组件属性索引文件
function updateComponentPropertiesIndex(componentName) {
  const indexPath = path.join(
    process.cwd(),
    'src/views/WebVision/components/componentsbiz/componentProperties/index.ts'
  )

  if (!fs.existsSync(indexPath)) {
    throw new Error(`组件属性索引文件不存在: ${indexPath}`)
  }

  const content = fs.readFileSync(indexPath, 'utf8')

  // 检查是否已经导入了该组件
  const importPattern = new RegExp(`import\\s+${componentName}Properties\\s+from`, 'g')
  if (importPattern.test(content)) {
    console.log(`⚠️  组件 ${componentName} 已经存在于索引文件中，跳过导入`)
    return
  }

  const importLine = `import ${componentName}Properties from './${componentName}'`
  const mergeCode = `${componentName}Properties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})`

  let newContent = content

  // 1. 添加导入语句 - 在所有 import 语句之后
  const lastImportPattern = /(import\s+.*Properties\s+from\s+.*\n)(?!import)/
  const importMatches = [...content.matchAll(/import\s+.*Properties\s+from\s+.*\n/g)]

  if (importMatches.length > 0) {
    const lastImport = importMatches[importMatches.length - 1]
    const insertIndex = lastImport.index + lastImport[0].length
    newContent = newContent.slice(0, insertIndex) + importLine + '\n' + newContent.slice(insertIndex)
  } else {
    // 如果没有找到其他 Properties 导入，在 '// 合并所有组件配置' 注释前添加
    const beforeMergeComment = newContent.indexOf('// 合并所有组件配置')
    if (beforeMergeComment !== -1) {
      newContent = newContent.slice(0, beforeMergeComment) + importLine + '\n\n' + newContent.slice(beforeMergeComment)
    } else {
      throw new Error('无法找到合适的位置插入导入语句')
    }
  }

  // 2. 添加合并代码 - 在 export 语句之前
  const exportPattern = /(\n)(export\s+default\s+allComponentProperties)/
  if (!exportPattern.test(newContent)) {
    throw new Error('无法找到 export default allComponentProperties 语句')
  }

  newContent = newContent.replace(exportPattern, `\n${mergeCode}\n\n$2`)

  fs.writeFileSync(indexPath, newContent, 'utf8')
}

// 更新左侧组件库
function updateSliderAssembly(componentName, componentDisplayName, iconName = 'icon-zidingyimokuai') {
  const sliderPath = path.join(process.cwd(), 'src/views/WebVision/components/sliderassembly/index.vue')

  if (!fs.existsSync(sliderPath)) {
    throw new Error(`左侧组件库文件不存在: ${sliderPath}`)
  }

  const content = fs.readFileSync(sliderPath, 'utf8')

  // 检查组件是否已经存在于左侧组件库中
  const componentPattern = new RegExp(`name:\\s*['"\`]${componentName}['"\`]`, 'g')
  if (componentPattern.test(content)) {
    console.log(`⚠️  组件 ${componentName} 已经存在于左侧组件库中，跳过添加`)
    return
  }

  // 创建新组件项
  const newComponentItem = `      {
        text: '${componentDisplayName}',
        icon: '${iconName}',
        name: '${componentName}'
      }`

  // 更健壮的方法：找到"页面组件"分组，然后在其 comList 数组末尾插入
  // 1. 找到 "页面组件" 标题
  // 2. 找到对应的 comList 数组结尾
  // 3. 在最后一个组件后添加新组件

  const pageComponentsPattern = /(title: '页面组件',\s*comList: \[[\s\S]*?)(\n\s*\]\s*\})/

  if (!pageComponentsPattern.test(content)) {
    throw new Error('无法找到"页面组件"分组，请检查 sliderassembly/index.vue 文件结构')
  }

  const newContent = content.replace(pageComponentsPattern, (match, beforeClosing, closing) => {
    // 检查最后一个组件是否有逗号
    const trimmedBefore = beforeClosing.trim()
    const needsComma = !trimmedBefore.endsWith(',')

    return beforeClosing + (needsComma ? ',' : '') + '\n' + newComponentItem + closing
  })

  if (newContent === content) {
    throw new Error('组件添加失败，请检查文件格式是否正确')
  }

  fs.writeFileSync(sliderPath, newContent, 'utf8')
}

// 检查组件是否已存在
function checkComponentExists(componentName) {
  const basePath = path.join(process.cwd(), 'src/views/WebVision/components')
  const componentPath = path.join(basePath, 'componentsbiz', componentName)
  const stylePath = path.join(basePath, 'rightslider', `${componentName}Style`)
  const propertiesPath = path.join(basePath, 'componentsbiz/componentProperties', `${componentName}.ts`)

  const existingFiles = []
  if (fs.existsSync(componentPath)) existingFiles.push(`componentsbiz/${componentName}/`)
  if (fs.existsSync(stylePath)) existingFiles.push(`rightslider/${componentName}Style/`)
  if (fs.existsSync(propertiesPath)) existingFiles.push(`componentProperties/${componentName}.ts`)

  return existingFiles
}

// 验证输入
function validateInputs(componentName, componentDisplayName, componentDescription) {
  const errors = []

  if (!componentName || componentName.trim() === '') {
    errors.push('组件名称不能为空')
  } else if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
    errors.push('组件名称必须是有效的 PascalCase 格式 (如: MyComponent)')
  } else if (componentName.length < 2) {
    errors.push('组件名称至少需要2个字符')
  } else if (componentName.length > 50) {
    errors.push('组件名称不能超过50个字符')
  }

  if (!componentDisplayName || componentDisplayName.trim() === '') {
    errors.push('组件显示名称不能为空')
  } else if (componentDisplayName.length > 20) {
    errors.push('组件显示名称不能超过20个字符')
  }

  if (!componentDescription || componentDescription.trim() === '') {
    errors.push('组件描述不能为空')
  } else if (componentDescription.length > 100) {
    errors.push('组件描述不能超过100个字符')
  }

  return errors
}

// 主函数
async function main() {
  console.log('🚀 WebVision 空白组件生成器')
  console.log('================================')

  try {
    // 检查当前是否在正确的目录
    const packageJsonPath = path.join(process.cwd(), 'package.json')
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('请在项目根目录下运行此脚本 (package.json 不存在)')
    }

    // 获取用户输入
    const componentName = await askQuestion('请输入组件名称 (PascalCase, 例如: MyCustomComponent): ')
    const componentDisplayName = await askQuestion('请输入组件显示名称 (例如: 我的自定义组件): ')
    const componentDescription = await askQuestion('请输入组件描述 (例如: 一个自定义的业务组件): ')
    const componentType = await askComponentType()
    const iconName = (await askQuestion('请输入图标名称 (例如: icon-zidingyimokuai) [可选]: ')) || 'icon-zidingyimokuai'

    // 验证输入
    const validationErrors = validateInputs(
      componentName.trim(),
      componentDisplayName.trim(),
      componentDescription.trim()
    )
    if (validationErrors.length > 0) {
      console.log('❌ 输入验证失败:')
      validationErrors.forEach((error) => console.log(`   - ${error}`))
      process.exit(1)
    }

    const trimmedComponentName = componentName.trim()
    const trimmedDisplayName = componentDisplayName.trim()
    const trimmedDescription = componentDescription.trim()
    const trimmedIconName = iconName.trim()

    // 检查组件是否已存在
    const existingFiles = checkComponentExists(trimmedComponentName)
    if (existingFiles.length > 0) {
      console.log('⚠️  警告: 以下文件/目录已存在:')
      existingFiles.forEach((file) => console.log(`   - ${file}`))
      const overwrite = await askQuestion('是否要覆盖现有文件? (y/N): ')
      if (!overwrite.toLowerCase().startsWith('y')) {
        console.log('❌ 操作已取消')
        process.exit(0)
      }
    }

    console.log('\n🔧 正在生成组件文件...')

    // 生成文件路径
    const basePath = path.join(process.cwd(), 'src/views/WebVision/components')
    const componentPath = path.join(basePath, 'componentsbiz', trimmedComponentName)
    const stylePath = path.join(basePath, 'rightslider', `${trimmedComponentName}Style`)
    const propertiesPath = path.join(basePath, 'componentsbiz/componentProperties')

    // 生成文件内容
    const mainComponentContent =
      componentType === 'dynamic'
        ? generateDynamicComponent(trimmedComponentName, trimmedDisplayName, trimmedDescription)
        : generateStaticComponent(trimmedComponentName, trimmedDisplayName, trimmedDescription)
    const typeContent = generateTypeFile(trimmedComponentName, trimmedDisplayName, componentType)
    const styleContent = generateStyleComponent(trimmedComponentName, trimmedDisplayName, componentType)
    const propertiesContent = generatePropertiesFile(
      trimmedComponentName,
      trimmedDisplayName,
      trimmedDescription,
      componentType
    )

    // 写入文件
    writeFile(path.join(componentPath, 'index.vue'), mainComponentContent)
    writeFile(path.join(componentPath, 'type.ts'), typeContent)
    writeFile(path.join(stylePath, 'index.vue'), styleContent)
    writeFile(path.join(propertiesPath, `${trimmedComponentName}.ts`), propertiesContent)

    console.log('✅ 组件文件生成完成')

    // 更新索引文件
    console.log('🔄 更新配置文件...')
    updateComponentPropertiesIndex(trimmedComponentName)
    updateSliderAssembly(trimmedComponentName, trimmedDisplayName, trimmedIconName)

    console.log('✅ 配置文件更新完成')
    console.log('\n🎉 组件生成成功!')
    console.log('================================')
    console.log(`组件名称: ${trimmedComponentName}`)
    console.log(`显示名称: ${trimmedDisplayName}`)
    console.log(`组件类型: ${componentType === 'dynamic' ? '动态组件 (Dynamic)' : '静态组件 (Static)'}`)
    console.log(`描述: ${trimmedDescription}`)
    console.log(`图标: ${trimmedIconName}`)
    console.log('================================')
    console.log('📁 生成的文件:')
    console.log(`  - src/views/WebVision/components/componentsbiz/${trimmedComponentName}/index.vue`)
    console.log(`  - src/views/WebVision/components/componentsbiz/${trimmedComponentName}/type.ts`)
    console.log(`  - src/views/WebVision/components/rightslider/${trimmedComponentName}Style/index.vue`)
    console.log(`  - src/views/WebVision/components/componentsbiz/componentProperties/${trimmedComponentName}.ts`)
    console.log('\n🔄 更新的文件:')
    console.log('  - src/views/WebVision/components/componentsbiz/componentProperties/index.ts')
    console.log('  - src/views/WebVision/components/sliderassembly/index.vue')
    console.log('\n💡 提示: 请重启开发服务器以查看新组件')
  } catch (error) {
    console.error('❌ 生成过程中出现错误:', error.message)
    if (error.stack) {
      console.error('错误详情:', error.stack)
    }
    process.exit(1)
  } finally {
    rl.close()
  }
}

// 运行主函数
main()
