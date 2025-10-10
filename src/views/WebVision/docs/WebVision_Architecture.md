# WebVision 模块架构文档

## 1. 概述

`WebVision` 是一个功能强大的可视化页面构建器，采用 Vue 3 + Composition API + TypeScript 技术栈。其核心设计思想是提供一个直观、可扩展的界面，让用户通过拖拽和配置的方式快速构建页面。

它遵循着一个清晰的层级关系：**组件 (Component) -> 模板 (Template) -> 站点 (Website)**。

## 2. 核心架构与层级关系

系统采用经典的三栏式布局，并围绕"组件-模板-站点"的层级进行设计，不同层级的编辑在不同的构建器中完成。

- **组件 (Component)**: 是构成页面的最基本、可复用的原子单元。
- **模板 (Template)**: 是由多个**组件**组合而成的布局方案。模板定义了组件的种类、顺序和基础配置。
- **站点 (Website)**: 是模板的一个具体实例。站点引用一个模板来获得基础布局，并可以在此之上进行个性化修改和内容填充。

### 构建器分工

- **`pageBuilder.vue` (组件编辑器)**:

  - **职责**: 这是最基础的编辑器，用于创建和编辑**系统组件 (Component)**。在这里定义的组件是构成模板和站点的基本"积木"。
  - **模式**: `componentMode`

- **`templatePageBuilder.vue` (模板编辑器)**:

  - **职责**: 用于将多个**系统组件**组合成一个**模板 (Template)**。它定义了页面的基础布局和组件的初始配置。
  - **模式**: `templateMode`

- **`websitePageBuilder.vue` (站点编辑器)**:
  - **职责**: 用于编辑一个**站点 (Website)**。站点通常引用一个已有的模板，并允许用户覆盖模板的组件配置、填充具体内容，但不能改变由模板定义的基础组件顺序。
  - **模式**: `websiteMode`

## 3. 布局与核心逻辑

所有构建器（组件、模板、站点）都共享相似的三栏式布局：

- **左侧组件库 (`sliderassembly`)**:

  - **功能**: 展示所有可用的系统组件。
  - **交互**: 用户从此处拖拽组件到中间画布。
  - **实现**: `src/views/WebVision/components/sliderassembly/index.vue`

- **中间画布/预览区 (`phone`)**:

  - **功能**: 实时预览页面效果，模拟手机环境。
  - **交互**:
    - 接收从左侧拖入的组件。
    - 使用 `vuedraggable` 对已有组件进行拖拽排序。
    - 点击组件以激活，并在右侧面板显示其配置。
  - **实现**: 核心拖拽逻辑位于 `src/views/WebVision/index.vue`。

- **右侧配置面板 (`decorateAll` / `component-settings`)**:
  - **功能**: 提供对页面/模板/站点全局设置和单个组件属性的精细化配置。
  - **实现**: `src/views/WebVision/components/rightslider/` 目录下，通常包含三个主 Tab：
    1.  **站点/模板设置**: 配置页面全局属性，如标题、背景色等。
    2.  **组件管理**: 以列表形式管理画布中的所有组件，支持排序和删除。
    3.  **组件设置**: 显示当前激活组件的详细配置项，支持 **视图模式** 和 **JSON 模式** 切换。

## 4. 状态管理 (State Management)

`WebVision` 的核心状态管理利用了 Vue 3 的 `reactive` API。

- **`datas: reactive<IDatas>`**: 存储页面的核心数据。

  - `datas.page`: 包含当前页面（组件/模板/站点）的全局设置。
  - `datas.pageComponents`: 一个数组，包含了画布上所有组件的实例数据和配置。

- **`choose: reactive<ChooseData>`**: 存储当前用户与编辑器交互的状态。
  - `choose.index`: 当前选中组件在 `pageComponents` 数组中的索引。
  - `choose.rightcom`: 决定右侧配置面板应渲染哪个配置组件。
  - `choose.setStyle`: 指向当前选中组件的 `setStyle` 对象，实现配置面板与组件数据的双向绑定。

## 5. 关键数据结构 (`type.ts`)

`src/views/WebVision/type.ts` 文件定义了所有关键的 TypeScript 接口，如 `IDatas`, `ComponentItem`, `ChooseData` 等，为不同模式下的构建器提供类型支持。

## 6. 双映射机制

为了实现动态渲染，系统采用了双映射机制：

- **`componentMap` (`middleComponent.ts`)**: 键为组件类型字符串，值为中间画布要渲染的 Vue 组件。
- **`componentRightMap` (`rightComponent.ts`)**: 键为组件类型字符串，值为右侧配置面板要渲染的 Vue 组件。

当添加一个新组件时，必须同时更新这两个映射文件，以确保其在画布和配置面板中都能正常工作。

## 7. 目录结构

```
WebVision/
├── components/
│   ├── componentsbiz/      # 业务组件
│   │   └── componentProperties/ # 业务组件的默认属性定义
│   ├── componentscom/      # 通用组件
│   ├── rightslider/        # 右侧配置面板的所有组件 (*style.vue)
│   └── sliderassembly/     # 左侧组件库
├── const/
│   ├── middleComponent.ts  # 中间组件映射
│   └── rightComponent.ts   # 右侧组件映射
├── docs/                   # 模块文档 (此文件所在位置)
├── page/
│   ├── template/
│   │   └── templatePageBuilder.vue # 模板构建器
│   └── website/
│       └── websitePageBuilder.vue  # 站点构建器
├── pageBuilder.vue         # 系统组件构建器
└── type.ts                 # 核心类型定义
```

## 8. 开发范式：如何添加一个新组件 (以 HighLightText 为例)

`WebVision` 拥有良好的扩展性。遵循以下步骤，可以规范地添加一个新组件。

### 第 1 步：创建组件的类型定义

1. **创建类型文件**: 在 `src/views/WebVision/components/componentsbiz/HighLightText/type.ts` 中定义组件的类型。

```typescript
export interface HighLightTextConfig {
  // 高亮样式类型
  highlightType: 'background' | 'underline' | 'marker' | 'gradient'
  // 文本内容
  text: string
  // 字体大小
  fontSize: number
  // 字体粗细
  fontWeight: 'normal' | 'bold' | 'bolder'
  // 文本颜色
  textColor: string
  // 高亮颜色
  highlightColor: string
  // 渐变色（当 highlightType 为 gradient 时使用）
  gradientColors?: {
    from: string
    to: string
  }
  // 动画效果
  animation?: 'none' | 'flash' | 'pulse'
  // 对齐方式
  textAlign: 'left' | 'center' | 'right'
  // 行高
  lineHeight: number
  // 内边距
  padding: {
    top: number
    right: number
    bottom: number
    left: number
  }
}

// 组件数据接口
export interface IDatas {
  componentType: string
  configParamJson: HighLightTextConfig
}
```

### 第 2 步：创建组件的 UI 实现

1. **创建组件文件**: 在 `src/views/WebVision/components/componentsbiz/HighLightText/index.vue` 中实现组件。

```vue
<template>
  <div
    class="highlight-text"
    :class="[
      `highlight-text--${datas.configParamJson.highlightType}`,
      datas.configParamJson.animation !== 'none' ? `highlight-text--${datas.configParamJson.animation}` : ''
    ]"
    :style="computedStyles"
  >
    {{ datas.configParamJson.text }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { HighLightTextConfig } from './type'

interface Props {
  datas: {
    configParamJson: HighLightTextConfig
  }
}

const props = defineProps<Props>()

const computedStyles = computed(() => {
  const { configParamJson } = props.datas
  const styles: Record<string, string> = {
    fontSize: `${configParamJson.fontSize}px`,
    fontWeight: configParamJson.fontWeight,
    color: configParamJson.textColor,
    textAlign: configParamJson.textAlign,
    lineHeight: `${configParamJson.lineHeight}`,
    padding: `${configParamJson.padding.top}px ${configParamJson.padding.right}px ${configParamJson.padding.bottom}px ${configParamJson.padding.left}px`
  }

  switch (configParamJson.highlightType) {
    case 'background':
      styles.backgroundColor = configParamJson.highlightColor
      break
    case 'underline':
      styles.borderBottom = `2px solid ${configParamJson.highlightColor}`
      break
    case 'marker':
      styles.background = `linear-gradient(transparent 60%, ${configParamJson.highlightColor} 40%)`
      break
    case 'gradient':
      if (configParamJson.gradientColors) {
        styles.background = `linear-gradient(45deg, ${configParamJson.gradientColors.from}, ${configParamJson.gradientColors.to})`
        styles.webkitBackgroundClip = 'text'
        styles.webkitTextFillColor = 'transparent'
      }
      break
  }

  return styles
})
</script>

<style lang="scss" scoped>
.highlight-text {
  display: block;
  word-break: break-word;

  // 动画效果
  &--flash {
    animation: flash 2s infinite;
  }

  &--pulse {
    animation: pulse 2s infinite;
  }
}

@keyframes flash {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>
```

### 第 3 步：创建组件的配置面板

1. **创建配置组件**: 在 `src/views/WebVision/components/rightslider/HighLightTextStyle/index.vue` 中实现配置面板。

```vue
<template>
  <div class="highlight-text-style">
    <shareComponent :datas="datas" />
    <componentHeadTitle
      :datas="{ componentType: datas.componentType }"
      title="高亮文本设置"
    />

    <el-form label-position="top">
      <!-- 文本内容 -->
      <el-form-item label="文本内容">
        <el-input
          v-model="datas.configParamJson.text"
          type="textarea"
          :rows="3"
          placeholder="请输入文本内容"
        />
      </el-form-item>

      <!-- 高亮样式 -->
      <el-form-item label="高亮样式">
        <el-select
          v-model="datas.configParamJson.highlightType"
          class="w-full"
        >
          <el-option
            label="背景高亮"
            value="background"
          />
          <el-option
            label="下划线"
            value="underline"
          />
          <el-option
            label="记号笔"
            value="marker"
          />
          <el-option
            label="渐变文字"
            value="gradient"
          />
        </el-select>
      </el-form-item>

      <!-- 其他配置项... -->
    </el-form>
  </div>
</template>

<script setup lang="ts">
import shareComponent from '../shareComponent/index.vue'
import componentHeadTitle from '../componentHeadTitle/index.vue'
import type { IDatas } from '../../componentsbiz/HighLightText/type'

interface Props {
  datas: IDatas
}

defineProps<Props>()
</script>
```

### 第 4 步：定义组件的默认属性

1. **创建属性文件**: 在 `src/views/WebVision/components/componentsbiz/componentProperties/HighLightText.ts` 中定义默认属性。

```typescript
import type { HighLightTextConfig } from '../HighLightText/type'
import type { IComponentProperty, ISetStyle } from './index'

const componentProperties = new Map<string, IComponentProperty<ISetStyle<HighLightTextConfig>>>()

componentProperties.set('HighLightText', {
  component: 'HighLightText',
  text: '高亮文本',
  active: false,
  style: 'HighLightTextStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '高亮文本',
    componentType: 'HighLightText',
    componentSort: '',
    status: 'y',
    isView: 'y',
    memo: '支持多种高亮样式的文本组件',
    pageCode: '',
    configParamJson: {
      text: '这是一段高亮文本',
      highlightType: 'background',
      fontSize: 16,
      fontWeight: 'normal',
      textColor: '#333333',
      highlightColor: '#FFE58F',
      gradientColors: {
        from: '#FF9A9E',
        to: '#FAD0C4'
      },
      animation: 'none',
      textAlign: 'left',
      lineHeight: 1.5,
      padding: {
        top: 10,
        right: 15,
        bottom: 10,
        left: 15
      }
    }
  }
})

export default componentProperties
```

### 第 5 步：注册组件属性

1. **导入并注册**: 在 `src/views/WebVision/components/componentsbiz/componentProperties/index.ts` 中注册组件。

```typescript
import HighLightTextProperties from './HighLightText'

// ... 其他导入 ...

// 注册组件属性
HighLightTextProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})
```

## 9. 组件开发最佳实践

1. **类型定义**:

   - 为组件的所有配置项定义清晰的类型
   - 使用联合类型限制可选值范围
   - 导出必要的接口供其他文件使用

2. **组件实现**:

   - 使用 Composition API 和 `<script setup>`
   - 通过计算属性处理复杂的样式逻辑
   - 使用 SCSS 和 BEM 命名规范
   - 实现响应式设计

3. **配置面板**:

   - 复用通用组件（shareComponent、componentHeadTitle）
   - 使用 Element Plus 组件库
   - 保持一致的布局和交互方式

4. **属性配置**:

   - 提供合理的默认值
   - 完整填写所有必要的字段
   - 添加清晰的组件描述

5. **性能优化**:
   - 使用计算属性缓存复杂计算
   - 避免不必要的响应式转换
   - 合理使用 v-show 和 v-if

## 10. 注意事项

1. **类型安全**:

   - 确保所有组件都有完整的类型定义
   - 使用 TypeScript 的严格模式
   - 避免使用 any 类型

2. **组件通信**:

   - 通过 props 传递数据
   - 使用 emit 发送事件
   - 保持单向数据流

3. **样式隔离**:

   - 使用 scoped 样式
   - 遵循 BEM 命名规范
   - 避免全局样式污染

4. **错误处理**:

   - 添加适当的类型检查
   - 处理可能的空值情况
   - 提供友好的错误提示

5. **文档维护**:
   - 及时更新组件文档
   - 添加必要的注释
   - 记录重要的实现决策

通过遵循这些规范和最佳实践，我们可以确保 WebVision 系统的可维护性和可扩展性，同时提供良好的开发体验。
