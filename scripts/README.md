# WebVision 组件生成器

这是一个自动化工具，用于快速生成 WebVision 系统的空白组件框架。

## 🚀 使用方法

```bash
# 运行组件生成器
pnpm run gen-empty

# 或者直接使用 Node.js 运行
node scripts/generate-empty-component.js
```

## 📋 交互式设置

工具会提示您输入以下信息：

1. **组件名称** (必填)

   - 格式：PascalCase (如: `MyCustomComponent`)
   - 示例：`ProductCard`, `UserProfile`, `DataTable`

2. **组件显示名称** (必填)

   - 格式：中文显示名称
   - 示例：`商品卡片`, `用户资料`, `数据表格`

3. **组件描述** (必填)

   - 格式：组件功能描述
   - 示例：`用于展示商品信息的卡片组件`

4. **图标名称** (可选)
   - 格式：iconfont 图标名称
   - 默认：`icon-zidingyimokuai`

## 📁 生成的文件结构

```
src/views/WebVision/components/
├── componentsbiz/
│   ├── {ComponentName}/
│   │   ├── index.vue        # 主组件
│   │   └── type.ts         # 类型定义
│   └── componentProperties/
│       └── {ComponentName}.ts # 属性配置
└── rightslider/
    └── {ComponentName}Style/
        └── index.vue        # 配置面板
```

## 🔧 自动更新的文件

- `src/views/WebVision/components/componentsbiz/componentProperties/index.ts`
- `src/views/WebVision/components/sliderassembly/index.vue`

## ✨ 生成的组件功能

每个生成的组件都包含以下标准功能：

### 主组件 (`index.vue`)

- Vue 3 + Composition API + TypeScript
- 响应式样式计算
- 标准的 slot 支持
- 完整的 props 类型定义

### 配置面板 (`{ComponentName}Style/index.vue`)

- 基础文本内容编辑
- 颜色配置（背景色、文字色）
- 尺寸配置（内边距、高度、圆角）
- 字体配置（大小、粗细、对齐）
- 快速样式预设
- 表单验证

### 类型定义 (`type.ts`)

- 完整的 TypeScript 接口定义
- 配置参数类型约束
- 数据结构定义

### 属性配置 (`{ComponentName}.ts`)

- 组件默认属性
- 初始配置值
- 组件元信息

## 📝 使用示例

```bash
$ pnpm run gen-empty
🚀 WebVision 空白组件生成器
================================
请输入组件名称 (PascalCase, 例如: MyCustomComponent): ProductCard
请输入组件显示名称 (例如: 我的自定义组件): 商品卡片
请输入组件描述 (例如: 一个自定义的业务组件): 用于展示商品信息的卡片组件
请输入图标名称 (例如: icon-zidingyimokuai) [可选]: icon-goods

🔧 正在生成组件文件...
✅ 组件文件生成完成
🔄 更新配置文件...
✅ 配置文件更新完成

🎉 组件生成成功!
```

## 🔄 下一步操作

1. **重启开发服务器**：`pnpm run dev`
2. **查看左侧组件库**：在"页面组件"分组中找到新组件
3. **自定义组件**：根据需求修改生成的组件代码
4. **测试组件**：拖拽到画布中测试功能

## 📄 注意事项

- 组件名称必须使用 PascalCase 格式
- 生成后请重启开发服务器以加载新组件
- 所有生成的组件都会自动注册到系统中
- 可以在生成后根据需求修改组件代码
- 工具会自动检查重复组件，避免覆盖现有文件
- 支持输入验证，确保生成组件的质量

## 🔧 改进功能

### v1.1.0 更新

- ✅ **智能重复检查**: 自动检测现有组件，避免意外覆盖
- ✅ **健壮的文件定位**: 不再依赖特定组件名称，更可靠的插入逻辑
- ✅ **输入验证**: 完整的输入验证和错误提示
- ✅ **更好的错误处理**: 详细的错误信息和调试输出
- ✅ **确认覆盖**: 发现重复文件时询问用户确认
- ✅ **项目目录检查**: 确保在正确的项目根目录运行

## 🛠️ 自定义修改

生成的组件提供了完整的基础框架，您可以根据实际需求进行以下修改：

1. **修改主组件**：在 `index.vue` 中添加自定义逻辑
2. **扩展配置面板**：在 `{ComponentName}Style/index.vue` 中添加更多配置选项
3. **更新类型定义**：在 `type.ts` 中添加新的配置项类型
4. **调整默认属性**：在 `{ComponentName}.ts` 中修改默认值

## 🤝 贡献

如果您有改进建议或发现问题，请提交 Issue 或 Pull Request。
