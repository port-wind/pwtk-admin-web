#!/bin/bash

# ============================================================================
# 禅道 Bug 追踪模块 - DEV 开发环境专用版本
# ============================================================================
# ⚠️ 重要提示:
#   此文件仅供 Jenkinsfile.dev 使用
#   Jenkinsfile.release 严禁使用此文件,必须使用 zentao.sh
#
# 功能说明:
#   1. 从 Git 提交历史中提取 Bug 修复信息
#   2. 调用禅道 API 自动更新 Bug 状态为 "resolved"
#   3. 发送飞书(Lark)通知 - 每个 Bug 单独发送绿色卡片
#   4. 发送飞书版本发布汇总通知 - 蓝色卡片汇总所有已解决Bug
#   5. 发送 Telegram 汇总通知
#
# 使用场景:
#   - dev 环境: 每次代码推送自动执行
#   - 分析范围: 从上次成功构建到当前 HEAD 的所有提交
#   - 自动更新: 将 active/wait 状态的 Bug 更新为 resolved
#   - 即时通知: 每解决一个 Bug 立即发送飞书通知
#
# 环境隔离:
#   ✅ 仅用于开发环境 (Jenkinsfile.dev)
#   ❌ 不得用于生产发布 (Jenkinsfile.release)
# ============================================================================

# ----------------------------------------------------------------------------
# 配置部分
# ----------------------------------------------------------------------------

# 禅道产品 ID
PRODUCT_ID=1

# 禅道 API 地址
ZENTAO_API_URL="https://zentao.pwtk.cc/zentao/api.php/v1"

# 禅道 Bug 详情页基础 URL
ZENTAO_BUG_BASE_URL="https://zentao.pwtk.cc/zentao/bug-view-"

COMMIT_BASE_URL="https://zr-svn8300.cccqx.com/pwtk/pwtk-admin-web/commit/"
# https://zr-svn8300.cccqx.com/pwtk/pwtk-admin-web/commit/36f499356687278708ba2a6322a24d1acd206f02

# ----------------------------------------------------------------------------
# 函数: 发送单个 Bug 解决通知到飞书
# ----------------------------------------------------------------------------
# 参数:
#   $1: bug_id         - Bug ID (例如: 2262)
#   $2: bug_title      - Bug 标题 (例如: "登录页面404错误")
#   $3: old_status     - 旧状态 (例如: "active")
#   $4: commit_info    - 提交信息 (例如: "[abc123] 修复登录问题")
#   $5: bug_url        - Bug 详情页 URL
#
# 功能:
#   发送一个绿色的飞书卡片,显示单个 Bug 的解决信息,包含查看详情按钮
# ----------------------------------------------------------------------------
send_bug_resolved_notification() {
    local bug_id="$1"
    local bug_title="$2"
    local old_status="$3"
    local commit_info="$4"
    local bug_url="$5"
    local code_url="$6"
    # 发送 POST 请求到飞书 Webhook
    curl -s -X POST "${LARK_WEBHOOK_URL}" \
        -H "Content-Type: application/json" \
        -d "{
            \"msg_type\": \"interactive\",
            \"card\": {
                \"header\": {
                    \"title\": {
                        \"tag\": \"plain_text\",
                        \"content\": \"🐛 pwtk管端端Bug更新\"
                    },
                    \"template\": \"green\"
                },
                \"elements\": [
                    {
                        \"tag\": \"div\",
                        \"text\": {
                            \"tag\": \"lark_md\",
                            \"content\": \"**Bug #${bug_id}**: ${bug_title}\"
                        }
                    },
                    {
                        \"tag\": \"action\",
                        \"actions\": [
                            {
                                \"tag\": \"button\",
                                \"text\": {
                                    \"tag\": \"plain_text\",
                                    \"content\": \"查看代码\"
                                },
                                \"type\": \"primary\",
                                \"url\": \"${code_url}\"
                            }
                        ]
                    }
                ]
            }
        }" > /dev/null
}

# ----------------------------------------------------------------------------
# 函数: 发送版本发布汇总通知到飞书
# ----------------------------------------------------------------------------
# 参数:
#   $1: previous_tag   - 上一个版本标签 (例如: "v1.2.30" 或 "dev")
#   $2: current_tag    - 当前版本标签 (例如: "v1.2.31" 或 "abc123")
#   $3: resolved_count - 已解决的 Bug 数量
#   $4: resolved_bugs  - 已解决的 Bug 列表 (格式: "bug_info|bug_url" 每行一个)
#
# 功能:
#   发送一个蓝色的飞书卡片,汇总本次发布解决的所有 Bug
# ----------------------------------------------------------------------------
send_release_summary_notification() {
    local previous_tag="$1"
    local current_tag="$2"
    local resolved_count="$3"
    local resolved_bugs="$4"

    # 构建已解决 Bug 链接列表
    local resolved_links=""
    if [ -n "$resolved_bugs" ]; then
        # 逐行读取 Bug 信息,格式化为 Markdown 链接
        while IFS='|' read -r bug_info bug_url; do
            if [ -n "$bug_info" ]; then
                resolved_links="${resolved_links}• [${bug_info}](${bug_url})\\n"
            fi
        done <<< "$resolved_bugs"
    fi

    # 构建完整消息内容
    local content="**版本**: ${previous_tag} → ${current_tag}\\n\\n"

    if [ ${resolved_count} -gt 0 ]; then
        content="${content}**已解决Bug** (${resolved_count}个):\\n${resolved_links}"
    else
        content="${content}**本次发布未解决Bug**"
    fi

    # 发送 POST 请求到飞书 Webhook
    curl -s -X POST "${LARK_WEBHOOK_URL}" \
        -H "Content-Type: application/json" \
        -d "{
            \"msg_type\": \"interactive\",
            \"card\": {
                \"header\": {
                    \"title\": {
                        \"tag\": \"plain_text\",
                        \"content\": \"🚀 pwtk管端端版本发布\"
                    },
                    \"template\": \"blue\"
                },
                \"elements\": [
                    {
                        \"tag\": \"div\",
                        \"text\": {
                            \"tag\": \"lark_md\",
                            \"content\": \"${content}\"
                        }
                    }
                ]
            }
        }" > /dev/null
}

# ----------------------------------------------------------------------------
# 函数: 禅道 Bug 追踪主流程
# ----------------------------------------------------------------------------
# 参数:
#   $1: start_ref      - 起始 Git 引用 (例如: "HEAD~10" 或 "v1.2.30")
#   $2: end_ref        - 结束 Git 引用 (例如: "HEAD" 或 "v1.2.31")
#   $3: version_info   - 版本信息 (例如: "dev (abc123)" 或 "v1.2.30 → v1.2.31")
#   $4: update_status  - 是否更新禅道状态 ("true"=更新, "false"=只汇总)
#
# 功能:
#   1. 从 Git 提交历史中提取符合格式的 Bug 修复 (fix:2262, fix-2262, fix: 2262 2265)
#   2. 查询禅道获取 Bug 状态和标题
#   3. 如果 update_status=true,调用禅道 API 更新 Bug 状态为 "resolved"
#   4. 发送飞书通知 (每个 Bug 单独发送 + 最后发送汇总)
#   5. 发送 Telegram 汇总通知
#
# 提交格式支持:
#   - fix:2262 修复登录问题
#   - fix-2262 修复登录问题
#   - fix: 2262 修复登录问题
#   - fix: 2262 2265 修复多个问题 (一次提交修复多个 Bug)
# ----------------------------------------------------------------------------
process_zentao_bugs() {
    local start_ref="$1"
    local end_ref="$2"
    local version_info="$3"
    local update_status="${4:-false}"  # 默认为 false,只汇总不更新

    # 输出开始信息
    if type -t log_message > /dev/null 2>&1; then
        log_message "=============== 禅道 Bug 追踪开始 ==============="
        log_message "分析范围: ${start_ref}..${end_ref}"
        log_message "版本信息: ${version_info}"
        log_message "更新禅道状态: ${update_status}"
    fi

    # 初始化 bug 列表关联数组
    # 格式: BUG_MAP[bug_id] = "commit_hash|author|message\ncommit_hash|author|message"
    declare -A BUG_MAP

    # 获取所有符合格式的提交 (保存到变量以避免管道子shell问题)
    # 格式: commit_hash|author|subject
    COMMITS=$(git log "${start_ref}..${end_ref}" --pretty=format:"%h|%an|%s")

    # 遍历每个提交,提取 Bug ID
    while IFS='|' read -r commit_hash author commit_message; do
        # 检查提交信息是否包含 fix: 或 fix- 格式
        if echo "$commit_message" | grep -qE "fix[:-]\s*[0-9]"; then
            # 提取所有 Bug ID (支持多个 Bug ID,用空格分隔)
            # 例如: "fix: 2262 2265" 提取出 "2262 2265"
            # 步骤1: 提取 fix: 或 fix- 后面的所有数字
            # 步骤2: 移除 fix: 或 fix-
            # 步骤3: 使用 xargs 自动trim前后空格
            bug_ids=$(echo "$commit_message" | grep -oE "fix[:-]\s*([0-9]+(\s+[0-9]+)*)" | sed -E 's/fix[:-]//' | xargs)

            if [ -n "$bug_ids" ]; then
                if type -t log_message > /dev/null 2>&1; then
                    log_message "发现 Bug 修复: [$commit_hash] $author - $commit_message"
                fi

                # 分割多个 Bug ID,逐个处理
                for bug_id in $bug_ids; do
                    if [ -n "$bug_id" ]; then
                        # 存储到关联数组 (如果已存在则追加,支持一个 Bug 多次提交修复)
                        if [ -n "${BUG_MAP[$bug_id]}" ]; then
                            BUG_MAP[$bug_id]="${BUG_MAP[$bug_id]}
${commit_hash}|${author}|${commit_message}"
                        else
                            BUG_MAP[$bug_id]="${commit_hash}|${author}|${commit_message}"
                        fi
                    fi
                done
            fi
        fi
    done <<< "$COMMITS"

    # 统计发现的 Bug 数量
    BUG_COUNT=${#BUG_MAP[@]}

    if type -t log_message > /dev/null 2>&1; then
        log_message "共发现 ${BUG_COUNT} 个 Bug"
    fi

    # 如果没有发现 Bug,直接返回
    if [ $BUG_COUNT -eq 0 ]; then
        if type -t log_message > /dev/null 2>&1; then
            log_message "本次构建未发现符合格式的 Bug 修复"
            log_message "=============== 禅道 Bug 追踪结束 ==============="
        fi
        return 0
    fi

    # 获取禅道 API Token
    if type -t log_message > /dev/null 2>&1; then
        log_message "正在获取禅道 API Token..."
    fi

    # 调用禅道登录接口获取 Token
    ZENTAO_TOKEN_RESPONSE=$(curl -s -X POST "${ZENTAO_API_URL}/tokens" \
        -H "Content-Type: application/json" \
        -d "{\"account\":\"${ZENTAO_USERNAME}\",\"password\":\"${ZENTAO_PASSWORD}\"}")

    # 从响应中提取 Token
    ZENTAO_TOKEN=$(echo "$ZENTAO_TOKEN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

    # 检查 Token 是否获取成功
    if [ -z "$ZENTAO_TOKEN" ]; then
        if type -t log_message > /dev/null 2>&1; then
            log_message "警告: 无法获取禅道 Token，仅生成链接列表"
            log_message "响应: ${ZENTAO_TOKEN_RESPONSE}"
        fi

        # Token 获取失败,只生成链接列表不更新状态
        BUG_LINKS=""
        for bug_id in $(echo "${!BUG_MAP[@]}" | tr ' ' '\n' | sort -n); do
            COMMIT_INFO=""
            # 遍历该 Bug 的所有相关提交
            while IFS= read -r commit_line; do
                commit_hash=$(echo "$commit_line" | cut -d'|' -f1)
                author=$(echo "$commit_line" | cut -d'|' -f2)
                COMMIT_INFO="${COMMIT_INFO}  修复人: ${author} [${commit_hash}]
"
            done <<< "${BUG_MAP[$bug_id]}"

            BUG_LINKS="${BUG_LINKS}#${bug_id}
${COMMIT_INFO}  ${ZENTAO_BUG_BASE_URL}${bug_id}.html

"
        done

        # 发送 Telegram 通知 (包含警告信息)
        if type -t send_telegram_message > /dev/null 2>&1; then
            send_telegram_message "🐛 Bug 修复汇总
版本: ${version_info}

${BUG_LINKS}
📊 总计: ${BUG_COUNT} 个 Bug 已修复
⚠️ 禅道状态未更新（Token获取失败）"
        fi
        return 1
    fi

    if type -t log_message > /dev/null 2>&1; then
        log_message "成功获取禅道 Token"
    fi

    # 初始化汇总信息
    BUG_LINKS=""              # Telegram 消息用的链接列表
    RESOLVED_COUNT=0          # 已解决的 Bug 数量
    ERROR_COUNT=0             # 失败的 Bug 数量
    RESOLVED_BUGS_LIST=""     # 飞书汇总用的 Bug 列表

    # 处理每个 Bug (按 Bug ID 排序)
    for bug_id in $(echo "${!BUG_MAP[@]}" | tr ' ' '\n' | sort -n); do
        if type -t log_message > /dev/null 2>&1; then
            log_message "----------------------------------------"
            log_message "处理 Bug #${bug_id}"
        fi

        # 查询 Bug 状态
        BUG_INFO=$(curl -s -X GET "${ZENTAO_API_URL}/bugs/${bug_id}" \
            -H "Token: ${ZENTAO_TOKEN}")

        # 使用 Python 解析 JSON,正确处理中文
        BUG_STATUS=$(echo "$BUG_INFO" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('status', ''))" 2>/dev/null)
        BUG_TITLE=$(echo "$BUG_INFO" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('title', ''))" 2>/dev/null)
        BUG_OPENED_BY=$(echo "$BUG_INFO" | python3 -c "import sys, json; data=json.load(sys.stdin); openedBy=data.get('openedBy', {}); print(openedBy.get('account', '') if isinstance(openedBy, dict) else '')" 2>/dev/null)

        # 检查是否成功获取 Bug 信息
        if [ -z "$BUG_STATUS" ]; then
            if type -t log_message > /dev/null 2>&1; then
                log_message "警告: 无法获取 Bug #${bug_id} 的状态信息"
            fi
            ERROR_COUNT=$((ERROR_COUNT + 1))

            # 添加到失败列表
            COMMIT_INFO=""
            while IFS= read -r commit_line; do
                commit_hash=$(echo "$commit_line" | cut -d'|' -f1)
                author=$(echo "$commit_line" | cut -d'|' -f2)
                COMMIT_INFO="${COMMIT_INFO}  修复人: ${author} [${commit_hash}]
"
            done <<< "${BUG_MAP[$bug_id]}"

            BUG_LINKS="${BUG_LINKS}❌ #${bug_id} (查询失败)
${COMMIT_INFO}  ${ZENTAO_BUG_BASE_URL}${bug_id}.html

"
            continue
        fi

        if type -t log_message > /dev/null 2>&1; then
            log_message "Bug #${bug_id} 状态: ${BUG_STATUS}"
            log_message "Bug #${bug_id} 标题: ${BUG_TITLE}"
            log_message "Bug #${bug_id} 创建者: ${BUG_OPENED_BY}"
        fi

        # 获取提交信息 (所有情况都需要)
        COMMIT_INFO=""
        while IFS= read -r commit_line; do
            commit_hash=$(echo "$commit_line" | cut -d'|' -f1)
            author=$(echo "$commit_line" | cut -d'|' -f2)
            COMMIT_INFO="${COMMIT_INFO}  修复人: ${author} [${commit_hash}]
"
        done <<< "${BUG_MAP[$bug_id]}"

        # 检查是否为未解决状态 (active 或 wait 状态才需要处理)
        if [ "$BUG_STATUS" = "active" ] || [ "$BUG_STATUS" = "wait" ]; then
            # 根据 update_status 参数决定是否更新禅道状态
            if [ "$update_status" = "true" ]; then
                if type -t log_message > /dev/null 2>&1; then
                    log_message "Bug #${bug_id} 状态为未解决，准备更新为已解决..."
                fi

                # 准备评论内容 (包含所有相关 commit 信息)
                COMMENT="已修复该问题

相关提交："
                while IFS= read -r commit_info; do
                    commit_hash=$(echo "$commit_info" | cut -d'|' -f1)
                    author=$(echo "$commit_info" | cut -d'|' -f2)
                    message=$(echo "$commit_info" | cut -d'|' -f3)
                    COMMENT="${COMMENT}
- [${commit_hash}] ${author}: ${message}"
                done <<< "${BUG_MAP[$bug_id]}"

                COMMENT="${COMMENT}

代码提交: <a href=\"${COMMIT_BASE_URL}${commit_hash}\" target=\"_blank\">点击查看</a>"

                # 生成解决 Bug 的 JSON 临时文件
                RESOLVE_JSON_FILE="/tmp/zentao_resolve_${bug_id}_$$.json"

                # 确定指派对象：优先使用创建者,如果获取失败则使用当前用户
                ASSIGNEE="${BUG_OPENED_BY}"
                if [ -z "$ASSIGNEE" ]; then
                    if type -t log_message > /dev/null 2>&1; then
                        log_message "警告: 无法获取 Bug #${bug_id} 创建者，将指派给当前用户 ${ZENTAO_USERNAME}"
                    fi
                    ASSIGNEE="${ZENTAO_USERNAME}"
                fi

                # 使用 Python 生成 JSON (确保正确处理中文和特殊字符)
                python3 -c "import json; print(json.dumps({
    'resolution': 'fixed',
    'resolvedBuild': 'trunk',
    'resolvedDate': '$(date "+%Y-%m-%d %H:%M:%S")',
    'assignedTo': '${ASSIGNEE}',
    'comment': '''${COMMENT}'''
}, ensure_ascii=False, indent=2))" > "$RESOLVE_JSON_FILE"

                # 调用禅道 API 解决 Bug
                RESOLVE_RESPONSE=$(curl -s -X POST "${ZENTAO_API_URL}/bugs/${bug_id}/resolve" \
                    -H "Token: ${ZENTAO_TOKEN}" \
                    -H "Content-Type: application/json" \
                    -d @"$RESOLVE_JSON_FILE")

                # 清理临时文件
                rm -f "$RESOLVE_JSON_FILE"

                # 检查是否成功 (响应包含 "id" 字段表示成功)
                if echo "$RESOLVE_RESPONSE" | grep -q '"id"'; then
                    if type -t log_message > /dev/null 2>&1; then
                        log_message "✅ 成功解决 Bug #${bug_id}"
                    fi
                    RESOLVED_COUNT=$((RESOLVED_COUNT + 1))
                    BUG_LINKS="${BUG_LINKS}✅ #${bug_id} - ${BUG_TITLE}
${COMMIT_INFO}  ${ZENTAO_BUG_BASE_URL}${bug_id}.html

"
                    # 添加到已解决 Bug 列表 (用于飞书汇总通知)
                    RESOLVED_BUGS_LIST="${RESOLVED_BUGS_LIST}#${bug_id} ${BUG_TITLE}|${ZENTAO_BUG_BASE_URL}${bug_id}.html
"

                    # 发送飞书单个 Bug 通知
                    BUG_URL="${ZENTAO_BUG_BASE_URL}${bug_id}.html"
                    CODE_URL="${COMMIT_BASE_URL}${commit_hash}"
                    COMMIT_SUMMARY=$(echo "${BUG_MAP[$bug_id]}" | head -1 | awk -F'|' '{print "[" $1 "] " $3}')
                    send_bug_resolved_notification "${bug_id}" "${BUG_TITLE}" "${BUG_STATUS}" "${COMMIT_SUMMARY}" "${BUG_URL}" "${CODE_URL}"

                    if type -t log_message > /dev/null 2>&1; then
                        log_message "飞书通知已发送 (Bug #${bug_id})"
                    fi
                else
                    # 更新失败
                    if type -t log_message > /dev/null 2>&1; then
                        log_message "❌ 解决 Bug #${bug_id} 失败: ${RESOLVE_RESPONSE}"
                    fi
                    ERROR_COUNT=$((ERROR_COUNT + 1))
                    BUG_LINKS="${BUG_LINKS}❌ #${bug_id} - ${BUG_TITLE} (更新失败)
${COMMIT_INFO}  ${ZENTAO_BUG_BASE_URL}${bug_id}.html

"
                fi
            else
                # update_status = false: 只汇总,不更新禅道状态
                if type -t log_message > /dev/null 2>&1; then
                    log_message "Bug #${bug_id} 状态为未解决，但只汇总不更新禅道状态"
                fi
                RESOLVED_COUNT=$((RESOLVED_COUNT + 1))
                BUG_LINKS="${BUG_LINKS}📋 #${bug_id} - ${BUG_TITLE}
${COMMIT_INFO}  ${ZENTAO_BUG_BASE_URL}${bug_id}.html

"
                # 添加到已解决 Bug 列表
                RESOLVED_BUGS_LIST="${RESOLVED_BUGS_LIST}#${bug_id} ${BUG_TITLE}|${ZENTAO_BUG_BASE_URL}${bug_id}.html
"
            fi
        elif [ "$BUG_STATUS" = "resolved" ] || [ "$BUG_STATUS" = "closed" ]; then
            # Bug 已经是 resolved 或 closed 状态,跳过处理
            if type -t log_message > /dev/null 2>&1; then
                log_message "Bug #${bug_id} 已经是 ${BUG_STATUS} 状态，跳过更新（不显示在通知中）"
            fi
            # 不添加到 BUG_LINKS,不计数,不发通知
        else
            # 其他状态 (例如: testing),跳过处理
            if type -t log_message > /dev/null 2>&1; then
                log_message "Bug #${bug_id} 状态为 ${BUG_STATUS}，跳过更新（不显示在通知中）"
            fi
            # 不添加到 BUG_LINKS,不计数,不发通知
        fi
    done

    # 输出汇总信息
    if type -t log_message > /dev/null 2>&1; then
        log_message "=============== 禅道 Bug 追踪完成 ==============="
        log_message "总计: ${BUG_COUNT} 个 Bug"
        log_message "已解决: ${RESOLVED_COUNT} 个"
        log_message "失败: ${ERROR_COUNT} 个"
    fi

    # 发送 Telegram 汇总通知
    if type -t send_telegram_message > /dev/null 2>&1; then
        send_telegram_message "🐛 Bug 修复汇总
版本: ${version_info}

${BUG_LINKS}
📊 统计:
- 已解决: ${RESOLVED_COUNT} 个
- 失败: ${ERROR_COUNT} 个"
    fi

    # 发送飞书版本发布汇总通知 (仅在有解决 Bug 时发送)
    if [ ${RESOLVED_COUNT} -gt 0 ] || [ ${ERROR_COUNT} -gt 0 ]; then
        if type -t log_message > /dev/null 2>&1; then
            log_message "发送飞书版本发布汇总通知..."
        fi
        send_release_summary_notification "${start_ref}" "${end_ref}" "${RESOLVED_COUNT}" "${RESOLVED_BUGS_LIST}"
        if type -t log_message > /dev/null 2>&1; then
            log_message "飞书版本发布通知已发送"
        fi
    else
        if type -t log_message > /dev/null 2>&1; then
            log_message "本次构建无Bug状态变更，跳过飞书版本汇总通知"
        fi
    fi

    if type -t log_message > /dev/null 2>&1; then
        log_message "=============== 禅道 Bug 追踪结束 ==============="
    fi
}