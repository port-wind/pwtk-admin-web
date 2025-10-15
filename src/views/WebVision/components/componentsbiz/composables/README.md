# 🎮 useGameTypeFields Composable

## 📋 描述

`useGameTypeFields` 是一个 Vue 3 Composition API 组合式函数，用于处理 WebVision 可视化页面构建器中的动态彩种字段管理。

## 🎯 功能特性

- **动态字段生成**：根据游戏商店数据自动生成彩种字段
- **响应式更新**：监听彩种列表变化，自动更新配置
- **数据持久化**：保持现有配置数据不丢失
- **安全访问**：提供安全的图片 URL 和跳转 URL 双向绑定
- **类型安全**：完整的 TypeScript 类型支持
- **代码复用**：使用通用函数创建自定义数据字段，避免重复代码

## 📦 使用方法

### 基础用法

```typescript
import { useGameTypeFields } from '../composables/useGameTypeFields'
import type { IDatas } from '@/views/WebVision/components/componentsbiz/ImageForGameType/type'

const datas = computed(() => props.datas)
const { currentGameTypeImageUrl, turnToUrl } = useGameTypeFields(datas.value)
```

### 完整示例

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useGameTypeFields } from '../composables/useGameTypeFields'
import type { IDatas } from '@/views/WebVision/components/componentsbiz/ImageForGameType/type'

interface IProps {
  datas: IDatas
}

const props = defineProps<IProps>()
const datas = computed(() => props.datas)

// 🎮 使用 GameType Fields Composable
const { gameType, currentGameTypeImageUrl, turnToUrl, generateGameTypeFields, initializeGameTypeFields } =
  useGameTypeFields(datas.value)
</script>

<template>
  <el-form-item label="上传图片">
    <FileImageUpload
      v-model="currentGameTypeImageUrl"
      type="info"
      :upload-from="EUploadFrom.BBS_MAINBOARD_ICON"
    />
  </el-form-item>
  <el-form-item label="跳转链接">
    <el-input
      v-model="turnToUrl"
      placeholder="请输入跳转链接URL"
    />
  </el-form-item>
</template>
```

## 🔧 返回值

| 属性                       | 类型                  | 描述                        |
| -------------------------- | --------------------- | --------------------------- |
| `gameType`                 | `ComputedRef<string>` | 当前选中的彩种类型          |
| `gList`                    | `ComputedRef<any[]>`  | 彩种列表数据                |
| `currentGameTypeImageUrl`  | `ComputedRef<string>` | 当前彩种图片 URL 的双向绑定 |
| `turnToUrl`                | `ComputedRef<string>` | 当前彩种跳转 URL 的双向绑定 |
| `generateGameTypeFields`   | `Function`            | 生成彩种字段的函数          |
| `initializeGameTypeFields` | `Function`            | 初始化彩种字段的函数        |

## 📋 参数

| 参数    | 类型     | 必填 | 描述                               |
| ------- | -------- | ---- | ---------------------------------- |
| `datas` | `IDatas` | ✅   | 组件数据对象，包含 configParamJson |

## 🎯 生成的字段结构

```typescript
{
  "2032": {
    gameTypeName: "澳彩",
    gameTypeCode: "a6",
    gameTypeLongName: "澳门六合彩",
    gameTypeShortName: "澳彩",
    enabled: true,
    customData: {
      imageUrl: "",
      url: ""
    }
  },
  // ... 其他彩种字段
}
```

## 🔄 生命周期

1. **立即初始化**：组件创建时立即生成默认字段
2. **挂载时初始化**：onMounted 时重新初始化字段
3. **响应式更新**：监听彩种列表变化自动更新

## 🏗️ 内部架构

### 代码复用模式

使用 `createGameTypeCustomDataField` 通用函数创建自定义数据字段，避免重复代码：

```typescript
// 🔧 通用函数 - 创建彩种自定义数据字段
const createGameTypeCustomDataField = (
  fieldName: keyof (typeof datas.configParamJson)[string]['customData'],
  defaultValue = ''
) => {
  return computed({
    get: () => {
      // 统一的获取逻辑
      const currentGameType = gameType.value
      if (!currentGameType || !datas.configParamJson[currentGameType]) {
        return defaultValue
      }
      return datas.configParamJson[currentGameType].customData?.[fieldName] || defaultValue
    },
    set: (value: string) => {
      // 统一的设置逻辑
      const currentGameType = gameType.value
      if (currentGameType && datas.configParamJson[currentGameType]) {
        if (!datas.configParamJson[currentGameType].customData) {
          datas.configParamJson[currentGameType].customData = { imageUrl: '', url: '' }
        }
        datas.configParamJson[currentGameType].customData[fieldName] = value
      }
    }
  })
}

// 🎯 使用通用函数创建具体字段
const currentGameTypeImageUrl = createGameTypeCustomDataField('imageUrl', 'https://img.yzcdn.cn/vant/cat.jpeg')
const currentGameTypeUrl = createGameTypeCustomDataField('url', '')
```

### 优势

- **DRY 原则**：避免重复代码
- **类型安全**：TypeScript 类型检查确保字段名正确
- **一致性**：统一的验证和错误处理逻辑
- **可扩展性**：新增 customData 字段只需一行代码

## 🚀 最佳实践

1. **数据安全**：总是使用 `currentGameTypeImageUrl` 和 `turnToUrl` 进行数据绑定
2. **性能优化**：避免频繁调用 `generateGameTypeFields`
3. **错误处理**：组合式函数已内置错误处理
4. **类型安全**：使用 TypeScript 类型定义确保类型安全
5. **URL 验证**：在使用 `turnToUrl` 时建议添加 URL 格式验证
6. **代码复用**：内部使用 `createGameTypeCustomDataField` 通用函数避免重复代码

## 🐛 常见问题

### Q: 为什么会出现 "Cannot read properties of undefined" 错误？

A: 已通过立即初始化和安全访问解决，使用 `currentGameTypeImageUrl` 即可。

### Q: 如何添加新的彩种字段？

A: 组合式函数会自动根据 `gameStore.gameTypeList` 生成字段，无需手动添加。

### Q: 如何保持现有的配置数据？

A: 组合式函数会自动保留现有的 `enabled` 和 `customData` 配置。

## 📄 更新日志

- **v1.0.0**: 初始版本，提供基础的彩种字段管理功能
- **v1.1.0**: 添加数据持久化和安全访问功能
- **v1.2.0**: 优化性能，添加类型安全支持
- **v1.3.0**: 新增跳转 URL 功能，支持彩种图片点击跳转
- **v1.4.0**: 重构代码，使用通用函数消除重复代码，提高可维护性
