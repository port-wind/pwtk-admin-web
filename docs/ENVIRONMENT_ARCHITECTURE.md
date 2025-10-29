# 环境架构与配置系统说明

## 📚 目录

- [核心架构概述](#核心架构概述)
- [双层配置系统](#双层配置系统)
- [三层环境架构](#三层环境架构)
- [配置优先级逻辑](#配置优先级逻辑)
- [启动方式](#启动方式)
- [部署流程](#部署流程)
- [代码实现](#代码实现)

---

## 🎯 核心架构概述

本项目采用 **双层配置系统** + **三层环境架构** 的设计，实现了：

- ✅ 一次构建，多次部署（SaaS 多租户架构）
- ✅ 开发环境多项目并行开发（6gallery / 49gallery）
- ✅ 测试环境固定域名部署
- ✅ 生产环境灵活配置（无需重新构建）

---

## 🏗️ 双层配置系统

### 第一层：编译时配置

#### **开发模式（多项目并行）**

```
.env.development.6gallery   → 6gallery 项目开发配置
.env.development.49gallery  → 49gallery 项目开发配置
```

**特点：**

- 支持同一代码库开发多个项目
- 每个项目独立配置
- 通过不同的启动命令切换

#### **生产构建（基础配置）**

```
.env.production  → 生产环境基础配置
```

**特点：**

- 基础、不可变的配置
- 打包时编译进代码
- 所有客户通用的基础设施配置

### 第二层：运行时配置

```javascript
// public/webConfigApi.js
window.webConfigApi = {
  apiPath: '...', // 客户 API 地址
  logoPath: '...', // 客户 logo
  phone: '...', // 客户电话
  appName: '6gallery' // 项目名称
  // ... 其他客户特定配置
}
```

**特点：**

- 打包后可热替换，无需重新构建
- 包含客户/部署特定的配置
- **优先级高于** `.env.production`

---

## 🌍 三层环境架构

### 1️⃣ 开发环境（Localhost）

**环境特征：**

```
域名：localhost / 127.0.0.1
配置来源：import.meta.env.VITE_APP_NAME
控制方：开发者本地
```

**启动方式：**

```bash
# 启动 6gallery 开发环境
pnpm run dev:6gallery

# 启动 49gallery 开发环境
pnpm run dev:49gallery

# 默认启动（49gallery）
pnpm run dev
```

**配置文件：**

- `.env.development.6gallery`
- `.env.development.49gallery`

---

### 2️⃣ 测试环境（Test Server）

**环境特征：**

```
域名：
  - dev-web.pwtk.cc    → 6gallery 测试服务器
  - dev-web49.pwtk.cc  → 49gallery 测试服务器
配置来源：通过域名判断（硬编码映射）
控制方：团队完全控制
```

**特点：**

- 固定域名部署
- 通过域名区分不同项目
- 团队内部测试使用

---

### 3️⃣ 生产环境（Production / Customer Server）

**环境特征：**

```
域名：未知（客户自己的域名）
配置来源：webConfigApi.appName（运行时配置）
控制方：客户部署
```

**特点：**

- 客户自己部署
- 域名不可预知
- 完全依赖 `webConfigApi.js` 配置
- 可随时替换配置无需重新构建

---

## 🔄 配置优先级逻辑

### 整体优先级流程

```
判断当前域名
    │
    ├─ 是 localhost?
    │   └─ 使用 import.meta.env.VITE_APP_NAME
    │      （开发环境配置）
    │
    ├─ 是 dev-web*.pwtk.cc?
    │   └─ 通过域名映射
    │      ├─ dev-web49.pwtk.cc → "49gallery"
    │      └─ dev-web.pwtk.cc   → "6gallery"
    │
    └─ 其他域名（客户服务器）
        └─ 使用 window.webConfigApi.appName
           （运行时配置，可热替换）
```

### 配置来源对照表

| 环境     | 域名示例          | 配置来源           | 可修改性     |
| -------- | ----------------- | ------------------ | ------------ |
| 开发环境 | localhost:8000    | `import.meta.env`  | 需要重启服务 |
| 测试环境 | dev-web49.pwtk.cc | 域名映射（硬编码） | 需要修改代码 |
| 生产环境 | customer.com      | `webConfigApi.js`  | 可热替换 ✅  |

---

## 🚀 启动方式

### package.json 配置

```json
{
  "scripts": {
    "dev": "vite --mode development.49gallery",
    "dev:6gallery": "vite --mode development.6gallery",
    "dev:49gallery": "vite --mode development.49gallery",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "build:test": "vite build --mode test"
  }
}
```

### 开发环境启动

**启动 6gallery：**

```bash
pnpm run dev:6gallery
```

- 加载 `.env.development.6gallery`
- `VITE_APP_NAME = "6gallery"`
- `VITE_PROXY_DOMAIN = "https://dev197.pwtk.cc"`

**启动 49gallery：**

```bash
pnpm run dev:49gallery
```

- 加载 `.env.development.49gallery`
- `VITE_APP_NAME = "49gallery"`
- `VITE_PROXY_DOMAIN = "https://dev197.pwtk.cc"`

### 启动信息输出

**终端输出（vite.config.mjs）：**

```
🚀 启动配置信息:
  Mode: development.6gallery
  环境文件: .env.development.6gallery
  当前时间: 2025/10/17 14:30:00
─────────────────────────────────
```

**浏览器控制台（main.ts）：**

```
📦 应用配置信息:
  应用名称: 6gallery
  环境标识: development
  代理域名: https://dev197.pwtk.cc
  版本号: 1.2.31
─────────────────────────────────
```

---

## 📦 部署流程

### 开发阶段

```bash
# 本地开发（多项目并行）
pnpm run dev:6gallery   # 或 dev:49gallery
```

### 构建阶段

```bash
# 使用 .env.production 构建
pnpm run build
```

**输出目录：** `dist/`

### 部署阶段

#### **测试环境部署**

```
dist/ → 部署到测试服务器
├─ dev-web.pwtk.cc    （自动识别为 6gallery）
└─ dev-web49.pwtk.cc  （自动识别为 49gallery）
```

#### **生产环境部署**

```
1. 复制 dist/ 到客户服务器
2. 根据客户需求修改 dist/webConfigApi.js
   {
     apiPath: '客户API地址',
     logoPath: '客户logo',
     appName: '6gallery',  // 或 '49gallery'
     phone: '客户电话',
     // ... 其他客户配置
   }
3. 完成部署（无需重新构建）
```

**优势：**

- ✅ 一次构建
- ✅ 多次部署
- ✅ 灵活配置
- ✅ 降低维护成本

---

## 💻 代码实现

### useAppInfo.ts 实现逻辑

```typescript
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const useAppInfo = () => {
  const { t } = useI18n()
  const domainName = ref(window.location.hostname)

  // 三层环境判断逻辑
  const appName = computed(() => {
    const isLocalhost = domainName.value === 'localhost' || domainName.value === '127.0.0.1'
    const isTestServer = domainName.value.includes('dev-web.pwtk.cc') || domainName.value.includes('dev-web49.pwtk.cc')

    // 1️⃣ 开发环境（localhost）：使用环境变量
    if (isLocalhost) {
      const envAppName = import.meta.env.VITE_APP_NAME
      console.info('🏷️ AppName [开发环境]:', envAppName)
      return envAppName || '6gallery'
    }

    // 2️⃣ 测试环境（测试服务器）：通过域名判断
    if (isTestServer) {
      const testAppName = domainName.value.includes('dev-web49.pwtk.cc') ? '49gallery' : '6gallery'
      console.info('🏷️ AppName [测试环境]:', testAppName, '(域名:', domainName.value + ')')
      return testAppName
    }

    // 3️⃣ 生产环境（客户服务器）：使用 webConfigApi
    const prodAppName = window.webConfigApi?.appName || '6gallery'
    console.info('🏷️ AppName [生产环境]:', prodAppName, '(来源: webConfigApi)')
    return prodAppName
  })

  // 根据 appName 返回对应的 titleName
  const titleName = computed(() => {
    switch (appName.value) {
      case '49gallery':
        return t('TK49 管端')
      case '6gallery':
        return t('login.titleName')
      default:
        return t('login.titleName')
    }
  })

  return {
    appName,
    titleName,
    domainName
  }
}
```

### vite.config.mjs 配置信息输出

```javascript
export default ({ mode }) => {
  console.info('\n🚀 启动配置信息:')
  console.info('  Mode:', mode)
  console.info('  环境文件:', `.env.${mode}`)
  console.info('  当前时间:', new Date().toLocaleString('zh-CN'))
  console.info('─────────────────────────────────\n')

  return {
    // ... vite 配置
  }
}
```

### main.ts 配置信息输出

```typescript
console.info('\n📦 应用配置信息:')
console.info('  应用名称:', import.meta.env.VITE_APP_NAME)
console.info('  环境标识:', import.meta.env.VITE_NODE_ENV)
console.info('  代理域名:', import.meta.env.VITE_PROXY_DOMAIN)
console.info('─────────────────────────────────\n')
```

---

## 📊 环境对照表

### 完整环境配置对照

| 项目      | 环境 | 域名              | 配置来源                     | 启动/访问方式            |
| --------- | ---- | ----------------- | ---------------------------- | ------------------------ |
| 6gallery  | 开发 | localhost:8000    | `.env.development.6gallery`  | `pnpm run dev:6gallery`  |
| 49gallery | 开发 | localhost:8000    | `.env.development.49gallery` | `pnpm run dev:49gallery` |
| 6gallery  | 测试 | dev-web.pwtk.cc   | 域名映射                     | 直接访问                 |
| 49gallery | 测试 | dev-web49.pwtk.cc | 域名映射                     | 直接访问                 |
| 6gallery  | 生产 | 客户域名          | `webConfigApi.js`            | 客户部署                 |
| 49gallery | 生产 | 客户域名          | `webConfigApi.js`            | 客户部署                 |

---

## 🎯 设计优势

### 1. 灵活性

- 开发环境快速切换项目
- 生产环境无需重新构建即可配置

### 2. 可维护性

- 统一的配置管理
- 清晰的优先级逻辑
- 便于问题排查

### 3. 可扩展性

- 易于添加新项目
- 支持更多环境部署
- 配置信息可追溯

### 4. 团队协作

- 明确的环境划分
- 新成员快速上手
- 减少配置冲突

---

## 📝 注意事项

### 开发时注意

1. **启动前确认项目**

   ```bash
   # 查看 package.json scripts
   # 选择正确的启动命令
   ```

2. **检查配置信息**

   - 终端查看：Mode 和环境文件
   - 浏览器查看：应用名称和域名

3. **配置修改后**
   - 需要重启开发服务器
   - 清除浏览器缓存

### 部署时注意

1. **测试环境**

   - 确认域名配置正确
   - 测试域名映射逻辑

2. **生产环境**

   - 修改 `webConfigApi.js` 配置
   - 验证配置生效
   - 不要直接修改编译后的代码

3. **版本管理**
   - 配置信息输出保留（使用 console.info）
   - 便于追踪和排查问题

---

## 🔗 相关文件

- `package.json` - 启动脚本配置
- `vite.config.mjs` - Vite 配置和启动信息
- `src/main.ts` - 应用入口和配置输出
- `src/composables/useAppInfo.ts` - AppName 判断逻辑
- `.env.development.6gallery` - 6gallery 开发配置
- `.env.development.49gallery` - 49gallery 开发配置
- `.env.production` - 生产环境基础配置
- `public/webConfigApi.js` - 运行时配置（可替换）

---

**文档版本：** 1.0  
**最后更新：** 2025-10-17  
**维护者：** 开发团队
