# Jenkins CI/CD 配置文档

本项目使用 Jenkins Pipeline 进行自动化构建和部署，包含开发环境和生产发布两套流程。

## 目录结构

```
jenkins/
├── lib/                    # 工具函数库
│   ├── logger.sh          # 日志记录
│   ├── time-utils.sh      # 时间处理
│   ├── telegram.sh        # Telegram 通知
│   └── lark.sh           # Lark (飞书) 通知
├── test-fix-extraction.sh # 测试脚本
└── README.md             # 本文档

Jenkinsfile.dev            # 开发环境构建
Jenkinsfile.release        # 生产发布
```

## Pipeline 配置

### 1. 开发环境 (Jenkinsfile.dev)

**功能**：

- 自动构建 `dev` 分支
- 提取并通知修复提交
- 发送 Telegram 进度通知
- 发送 Lark 修复汇总

**触发方式**：

- Poll SCM (定时检查代码更新)
- 手动触发

**通知规则**：

- Telegram: 所有构建状态
- Lark: 仅当有 `fix:` 提交时

**Jenkins 配置**：

```
Job Type: Pipeline
Definition: Pipeline script from SCM
SCM: Git
Repository URL: https://zr-svn8300.cccqx.com/pwtk/pwtk-admin-web.git
Credentials: pw.wangyibut123/*****
Branches: */dev
Script Path: Jenkinsfile.dev
Additional Behaviours: Clean before checkout
```

### 2. 生产发布 (Jenkinsfile.release)

**功能**：

- 检测新的 Git tag
- 自动构建并打包
- 更新版本文件
- 提取版本间的修复信息
- 归档发布产物

**触发方式**：

- Poll SCM (检测新 tag)
- 手动触发

**通知内容**：

- 发布信息 (版本、tag、构建时间)
- 本次发布的所有修复 (fix:提交)
- 版本范围 (previous tag → current tag)

**Jenkins 配置**：

```
Job Type: Pipeline
Definition: Pipeline script from SCM
SCM: Git
Repository URL: https://zr-svn8300.cccqx.com/pwtk/pwtk-admin-web.git
Credentials: pw.wangyibut123/*****
Branches: */master (或 */main)
Script Path: Jenkinsfile.release
Poll SCM: H/5 * * * * (每5分钟检查一次)
Additional Behaviours: Clean before checkout
```

## 修复提取功能

### 提交规范

为了让修复信息被正确提取，提交消息需要遵循以下格式：

```bash
# 基础格式
fix: 修复描述

# 带作用域
fix(scope): 修复描述

# 带 issue 编号
fix: 修复描述 #123
fix(ui): 按钮对齐问题 #456
```

### 示例提交

```bash
# 好的示例 ✓
git commit -m "fix: resolve login timeout issue"
git commit -m "fix(api): correct date format in reports #789"
git commit -m "fix: button alignment on mobile devices"

# 不会被提取 ✗
git commit -m "Fixed login issue"  # 没有冒号
git commit -m "bugfix: login"      # 使用 bugfix 而不是 fix
git commit -m "Fix login"          # Fix 首字母大写
```

### 开发环境 (Jenkinsfile.dev)

**提取范围**: 上次成功构建 → 当前构建

**工作原理**:

1. 每次构建成功后，保存当前 commit hash 到 `.last_success_commit`
2. 下次构建时，提取两次构建之间的所有 `fix:` 提交
3. 如果有修复，发送 Lark 通知

**通知示例**:

```
🔧 pwtk-admin-web - 发现 3 个修复

**构建时间:** 2025-10-15 15:30:00
**分支:** dev
**环境:** development
**提交:** abc12345
**修复数量:** 3

---

**修复内容:**
• #456 fix: resolve login timeout issue
• fix: correct date format in reports
• #789 fix(ui): button alignment on mobile

---
✅ 构建成功并已部署
```

### 生产发布 (Jenkinsfile.release)

**提取范围**: 上一个 tag → 当前 tag

**工作原理**:

1. 检测到新 tag 后，查找上一个 tag
2. 提取两个 tag 之间的所有 `fix:` 提交
3. 包含在 Telegram 发布通知中

**通知示例**:

```
✅ 发布成功
时间: 2025-10-15 16:00:00
项目名称: pwtk-admin-web
Tag: v1.2.13
版本: 1.2.13
发布包: pwtk-admin-web-1.2.13.zip
文件大小: 2.5M
耗时: 5分30秒

📋 本次修复内容:
• #456 fix: resolve login timeout issue
• fix: correct date format in reports
• #789 fix(ui): button alignment on mobile

版本范围: v1.2.12 → v1.2.13
```

## 配置指南

### 1. Telegram Bot 配置

Telegram 配置在 `jenkins/lib/telegram.sh`:

```bash
TELEGRAM_BOT_TOKEN="your_bot_token"
TELEGRAM_CHAT_ID="your_chat_id"
```

**获取方式**:

1. 与 @BotFather 对话创建机器人
2. 获取 Bot Token
3. 将机器人添加到群组
4. 使用 `/getUpdates` API 获取 Chat ID

### 2. Lark Webhook 配置

Lark 配置在 `jenkins/lib/lark.sh`:

```bash
LARK_WEBHOOK_URL="https://open.feishu.cn/open-apis/bot/v2/hook/YOUR_KEY"
```

或设置环境变量:

```bash
export LARK_WEBHOOK_URL="your_webhook_url"
```

**获取方式**:

1. 在飞书群聊中点击 "设置" → "群机器人"
2. 添加 "自定义机器人"
3. 复制 Webhook 地址
4. 配置到上述位置

### 3. Git 凭证配置

在 Jenkins 中配置 Git 凭证：

#### 主仓库凭证

1. Jenkins → Credentials → System → Global credentials
2. Add Credentials
3. Kind: Username with password
4. Username: `pw.wangyibut123`
5. Password: `******`
6. ID: 记录下来，用于 Pipeline 配置

#### 子模块凭证（必需）

项目使用 Git 子模块来管理 `src/views/WebVision/components/componentsbiz`，需要单独配置：

1. Jenkins → Credentials → System → Global credentials
2. Add Credentials
3. Kind: Username with password
4. **ID: `sg-git-credentials`** (必须使用这个 ID)
5. Username: 有权访问 `https://sg-git.pwtk.cc` 的用户名
6. Password: 对应密码或访问令牌
7. Description: `Git submodule credentials for sg-git.pwtk.cc`

**重要**:

- 凭证 ID 必须是 `sg-git-credentials`，因为 Jenkinsfile 中硬编码了这个 ID
- 该凭证用于访问子模块仓库: `https://sg-git.pwtk.cc/pwtk/pwtk-admin-web-submodule.git`
- 如果没有配置此凭证，构建会在"更新子模块"阶段失败

## 测试

### 测试修复提取功能

```bash
# 运行测试脚本
bash jenkins/test-fix-extraction.sh
```

测试脚本会：

1. ✓ 提取最近的 fix 提交
2. ✓ 验证消息格式化
3. ✓ 检查 Lark Webhook 配置
4. 可选：发送真实的 Lark 通知

### 创建测试提交

```bash
# 创建空提交用于测试
git commit --allow-empty -m "fix: test notification feature #123"

# 运行测试
bash jenkins/test-fix-extraction.sh
```

## 发布流程

### 开发环境部署

1. 提交代码到 `dev` 分支
2. Jenkins 自动检测并触发构建
3. 构建成功后自动部署
4. 如果有 fix 提交，发送 Lark 通知

### 生产发布

1. 打 tag:

   ```bash
   git tag -a v1.2.13 -m "Release v1.2.13"
   git push origin v1.2.13
   ```

2. Jenkins 检测到新 tag
3. 自动执行发布流程：
   - 检出 tag
   - 提取修复信息
   - 更新版本文件
   - 构建生产版本
   - 打包发布产物
   - 发送通知（包含修复列表）

## Git 子模块配置

### 子模块信息

本项目使用 Git 子模块管理 WebVision 的业务组件：

- **子模块路径**: `src/views/WebVision/components/componentsbiz`
- **仓库地址**: `https://sg-git.pwtk.cc/pwtk/pwtk-admin-web-submodule.git`
- **当前分支**: `master`

### Jenkins Pipeline 中的子模块处理

#### 自动更新机制

`Jenkinsfile.dev` 和 `Jenkinsfile.release` 都包含了"更新子模块"阶段，该阶段会：

1. 清理旧的子模块目录
2. 使用临时凭证文件配置 Git 认证
3. 初始化并更新子模块
4. 验证子模块更新成功
5. 清理临时凭证

#### 子模块更新阶段示例

```groovy
stage('更新子模块') {
    steps {
        script {
            withCredentials([
                usernamePassword(
                    credentialsId: 'sg-git-credentials',
                    usernameVariable: 'GIT_USERNAME',
                    passwordVariable: 'GIT_PASSWORD'
                )
            ]) {
                sh '''
                    # 初始化和更新子模块
                    git submodule init
                    git submodule update --recursive
                '''
            }
        }
    }
}
```

### 本地开发中的子模块操作

#### 首次克隆项目

```bash
# 方法 1: 克隆时同时获取子模块
git clone --recursive https://zr-svn8300.cccqx.com/pwtk/pwtk-admin-web.git

# 方法 2: 先克隆，后初始化子模块
git clone https://zr-svn8300.cccqx.com/pwtk/pwtk-admin-web.git
cd pwtk-admin-web
git submodule init
git submodule update
```

#### 更新子模块

```bash
# 更新到子模块仓库的最新提交
git submodule update --remote

# 递归更新所有子模块
git submodule update --recursive --remote
```

#### 切换分支后更新子模块

```bash
git checkout <branch-name>
git submodule update --init --recursive
```

### 配置 Jenkins SCM 自动处理子模块（可选）

虽然当前 Pipeline 已经通过脚本处理子模块，但将来如果升级 Git 版本（推荐 2.x+），可以配置 Jenkins SCM 自动处理：

1. 进入 Jenkins Job 配置
2. Source Code Management → Git → Additional Behaviours
3. 添加 "Advanced sub-modules behaviours"
4. 配置选项：
   - ✅ Recursively update submodules
   - ✅ Update tracking submodules to tip of branch
   - Credentials: 选择 `sg-git-credentials`
   - Timeout: 10 (分钟)

**注意**:

- Git 1.8.3.1 对 HTTPS 子模块的支持较差，不推荐使用此方式
- 建议优先使用当前的脚本方式（更可靠）

## 故障排查

### 问题 1: Git 子模块更新失败

**错误信息**:

```
ERROR: Error fetching remote repo 'origin'
Fetching submodule src/views/WebVision/components/componentsbiz
```

**可能原因**:

1. Jenkins 缺少 `sg-git-credentials` 凭证
2. 凭证用户名/密码错误
3. 网络无法访问 `sg-git.pwtk.cc`
4. 子模块仓库不存在或已迁移

**解决步骤**:

1. **检查凭证配置**:

   ```
   Jenkins → Credentials → System → Global credentials
   确认存在 ID 为 'sg-git-credentials' 的凭证
   ```

2. **验证凭证有效性**: 在 Jenkins 服务器上手动测试：

   ```bash
   git ls-remote https://USERNAME:PASSWORD@sg-git.pwtk.cc/pwtk/pwtk-admin-web-submodule.git
   ```

3. **检查网络连通性**:

   ```bash
   ping sg-git.pwtk.cc
   curl -I https://sg-git.pwtk.cc
   ```

4. **查看详细日志**: 在 Jenkins 构建日志中搜索 "更新子模块" 阶段的输出

### 问题 2: 构建失败 - Git 版本过旧

**错误**: `fatal: unknown date format`

**解决**: 已使用兼容 Git 1.8 的格式，确保使用最新的 Jenkinsfile

**推荐**: 升级 Git 到 2.x 版本以获得更好的子模块支持

### 问题 3: Lark 通知未发送

**检查**:

1. 是否有 fix 提交？（无修复不发送）
2. Webhook URL 是否正确配置？
3. 运行测试脚本验证

### 问题 4: 修复提取为空

**原因**: 提交消息不符合格式

**解决**: 确保提交消息以 `fix:` 或 `fix(` 开头

### 问题 5: 子模块版本不一致

**症状**: 本地和 Jenkins 构建出的子模块内容不同

**原因**: 子模块指向的 commit 不同

**解决**:

```bash
# 查看当前子模块状态
git submodule status

# 更新子模块到最新
cd src/views/WebVision/components/componentsbiz
git pull origin master
cd ../../../../

# 提交子模块更新
git add src/views/WebVision/components/componentsbiz
git commit -m "chore: update componentsbiz submodule"
git push
```

## 环境要求

- Jenkins 2.x+
- Git 1.8.3+
- Node.js 16.20.2
- Bash 4.0+
- 常用工具: curl, jq, zip, rsync

## 更新日志

### v1.0.0 (2025-10-15)

- ✨ 初始版本
- ✨ 支持 Telegram 通知
- ✨ 支持 Lark 通知
- ✨ 自动提取修复信息
- ✨ 开发/生产双流程
- ✨ Git 1.8 兼容性
