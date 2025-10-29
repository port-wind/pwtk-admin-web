<template>
  <div class="VideoWithGameTypeStyle">
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="video-with-gametype-style">
      <!-- 必须包含的三个基础组件 -->
      <share-component :datas="datas" />

      <!-- 游戏类型选择配置 - 动态组件必需 -->
      <GameTypeMultiSelect :datas="datas" />
      <!-- 基础设置区域 -->
      <el-divider content-position="left">基础设置</el-divider>

      <el-form-item label="启用状态">
        <el-switch v-model="datas.configParamJson.enable" />
      </el-form-item>

      <el-form-item label="组件高度(vh)">
        <el-slider v-model="datas.configParamJson.heights" :min="20" :max="100" show-input />
        <div class="form-hint">控制整个组件的高度，单位为视窗高度百分比</div>
      </el-form-item>

      <el-form-item label="视频高度占比(%)">
        <el-slider v-model="datas.configParamJson.videoHeightPercent" :min="30" :max="90" show-input />
        <div class="form-hint">控制视频播放器在组件中的高度占比，剩余空间用于缩略图</div>
      </el-form-item>

      <!-- 视频管理区域 -->
      <el-divider content-position="left">视频管理</el-divider>
      <!-- 游戏类型标签页 -->
      <GameTypeTabs :datas="datas">
        <template #default="{ gameType }">
          <div class="video-management">
            <div class="video-header">
              <el-button type="primary" size="small" @click="addVideo(gameType)">
                <el-icon>
                  <Plus />
                </el-icon>
                添加视频
              </el-button>
              <span class="video-count">共 {{ getCurrentGameTypeVideos(gameType)?.length || 0 }} 个视频</span>
            </div>

            <div class="video-list">
              <vuedraggable
                :list="getCurrentGameTypeVideos(gameType)"
                item-key="id"
                :animation="200"
                handle=".drag-handle"
              >
                <template #item="{ element, index }">
                  <div class="video-item">
                    <div class="video-row">
                      <div class="drag-handle">
                        <el-icon>
                          <More />
                        </el-icon>
                      </div>

                      <div class="video-preview">
                        <img :src="element.imageUrl" v-if="element.imageUrl" alt="视频缩略图" class="preview-image" />
                        <div v-else>暂无缩略图</div>
                      </div>

                      <div class="video-form">
                        <el-form-item label="视频标题" class="form-item-compact">
                          <el-input
                            v-model="element.title"
                            placeholder="请输入视频标题"
                            size="small"
                            @input="updateVideoData"
                          />
                        </el-form-item>

                        <el-form-item label="缩略图URL" class="form-item-compact">
                          <el-input
                            v-model="element.imageUrl"
                            placeholder="请输入缩略图URL"
                            size="small"
                            @input="updateVideoData"
                          />
                        </el-form-item>

                        <el-form-item label="视频URL" class="form-item-compact">
                          <el-input
                            v-model="element.videoUrl"
                            placeholder="请输入视频URL"
                            size="small"
                            @input="updateVideoData"
                          />
                        </el-form-item>

                        <div class="video-actions">
                          <el-switch
                            v-model="element.enabled"
                            inline-prompt
                            active-text="显示"
                            inactive-text="隐藏"
                            size="small"
                            @change="updateVideoData"
                          />
                          <el-button type="danger" size="small" @click="deleteVideo(gameType, index)">
                            <el-icon>
                              <Delete />
                            </el-icon>
                            删除
                          </el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </vuedraggable>
            </div>

            <!-- 空状态 -->
            <div v-if="!getCurrentGameTypeVideos(gameType)?.length" class="empty-video-state">
              <el-empty description="暂无视频，点击上方按钮添加视频" />
            </div>
          </div>
        </template>
      </GameTypeTabs>

      <!-- 样式设置区域 -->
      <el-divider content-position="left">样式设置</el-divider>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="背景色">
            <el-color-picker v-model="datas.configParamJson.styleMain.backgroundColor" show-alpha />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文字颜色">
            <el-color-picker v-model="datas.configParamJson.styleMain.textColor" show-alpha />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="VideoWithGameTypeStyle">
import type { FormInstance } from 'element-plus'
import { ref } from 'vue'

import { ElMessage } from 'element-plus'
import vuedraggable from 'vuedraggable'
import { Delete, Plus, More } from '@element-plus/icons-vue'

import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'
import GameTypeMultiSelect from '@/views/WebVision/components/rightslider/GameTypeMultiSelect/index.vue'
import GameTypeTabs from '@/views/WebVision/components/rightslider/GameTypeTabs/index.vue'
import type { IDatas, IVideoItem } from '@/views/WebVision/components/componentsbiz/VideoWithGameType/type'
import { useMultiGameType } from '@/views/WebVision/components/componentsbiz/composables/useMultiGameType'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()
const rules = ref({})
const ruleFormRef = ref<FormInstance>()
const { selectedGameTypes } = useMultiGameType(props.datas)

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
// 获取当前游戏类型的视频列表
const getCurrentGameTypeVideos = (gameType: string) => {
  const currentGameType = selectedGameTypes.value.find((gt) => gt.gameType === gameType)
  return currentGameType.customData.videos || []
}

// 添加视频
const addVideo = (gameType: string) => {
  const gameTypeIndex = selectedGameTypes.value.findIndex((gt) => gt.gameType === gameType)

  const currentVideos = getCurrentGameTypeVideos(gameType)
  const newVideo: IVideoItem = {
    id: generateId(),
    title: '新视频',
    imageUrl: '',
    videoUrl: '',
    enabled: true,
    order: currentVideos.length + 1
  }

  const updatedGameTypes = [...selectedGameTypes.value]
  if (!updatedGameTypes[gameTypeIndex].customData.videos) {
    updatedGameTypes[gameTypeIndex].customData.videos = []
  }

  updatedGameTypes[gameTypeIndex].customData.videos.push(newVideo)

  // 更新配置
  props.datas.configParamJson = {
    ...props.datas.configParamJson,
    selectedGameTypes: updatedGameTypes
  }
}

// 删除视频
const deleteVideo = (gameType: string, index: number) => {
  const gameTypeIndex = selectedGameTypes.value.findIndex((gt) => gt.gameType === gameType)

  const currentVideos = getCurrentGameTypeVideos(gameType)
  if (!currentVideos?.length) return

  if (currentVideos.length <= 1) {
    ElMessage.warning('至少保留一个视频')
    return
  }

  const updatedGameTypes = [...selectedGameTypes.value]
  updatedGameTypes[gameTypeIndex].customData.videos.splice(index, 1)

  // 重新排序
  updatedGameTypes[gameTypeIndex].customData.videos.forEach((item, idx) => {
    item.order = idx + 1
  })

  // 更新配置
  props.datas.configParamJson = {
    ...props.datas.configParamJson,
    selectedGameTypes: updatedGameTypes
  }

  ElMessage.success('视频删除成功')
}

// 更新视频数据 - 触发响应式更新
const updateVideoData = () => {
  // 创建一个新的 selectedGameTypes 副本来触发响应式更新
  const updatedGameTypes = [...selectedGameTypes.value]

  // 更新配置以触发所有依赖的响应式更新
  props.datas.configParamJson = {
    ...props.datas.configParamJson,
    selectedGameTypes: updatedGameTypes
  }
}
</script>

<style lang="scss" scoped>
.VideoWithGameTypeStyle {
  .video-with-gametype-style {
    padding: 0 10px;
  }

  h2 {
    padding: 24px 16px 24px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #f2f4f6;
    font-size: 18px;
    font-weight: 600;
    color: #323233;
  }

  .preset-configs {
    margin-bottom: 16px;
  }

  .form-hint {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
    line-height: 1.4;
  }

  .video-management {
    .video-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .video-count {
        font-size: 12px;
        color: #666;
      }
    }

    .video-list {
      .video-item {
        margin-bottom: 16px;
        padding: 16px;
        border: 1px solid #e4e7ed;
        border-radius: 8px;
        background-color: #f9f9f9;

        .video-row {
          display: flex;
          gap: 12px;
          align-items: flex-start;

          .drag-handle {
            cursor: move;
            color: #999;
            padding: 4px;
            margin-top: 8px;
          }

          .video-preview {
            flex-shrink: 0;

            .preview-image {
              width: 80px;
              height: 60px;
              object-fit: contain;
              border-radius: 4px;
              border: 1px solid #ddd;
            }
          }

          .video-form {
            flex: 1;

            .form-item-compact {
              margin-bottom: 12px;

              :deep(.el-form-item__label) {
                font-size: 12px;
                padding-bottom: 4px;
              }
            }

            .video-actions {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 8px;
            }
          }
        }
      }
    }

    .empty-video-state {
      margin: 20px 0;
    }
  }

  .gametype-tabs {
    margin-bottom: 16px;

    :deep(.el-tabs__header) {
      margin-bottom: 16px;
    }

    :deep(.el-tabs__item) {
      font-size: 13px;
      padding: 0 16px;
    }

    :deep(.el-tabs__content) {
      padding: 0;
    }
  }

  .no-gametype-state {
    margin: 20px 0;
    text-align: center;
  }
}
</style>
