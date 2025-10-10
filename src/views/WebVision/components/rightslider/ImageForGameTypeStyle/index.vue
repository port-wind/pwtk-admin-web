<script setup lang="ts" name="ImageForGameTypeStyle">
import { computed, ref, defineProps } from 'vue'
import type { FormInstance } from 'element-plus'
import { EUploadFrom } from '@/components/uploadImage/type'
import FileImageUpload from '@/components/FileImageUpload/index.vue'
import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'
import componentHeadTitle from '@/views/WebVision/components/rightslider/componentHeadTitle/index.vue'
import headerTitle from '@/views/WebVision/components/rightslider/headerTitle/index.vue'
import StoreGameTypeList from '@/views/WebVision/components/rightslider/StoreGameTypeList/index.vue'
// import { useGameTypeFields } from '../../componentsbiz/composables/useGameTypeFields'
import type { IDatas } from '@/views/WebVision/components/componentsbiz/ImageForGameType/type'

interface IProps {
  datas: IDatas
}

const props = defineProps<IProps>()
// const datas = computed(() => props.datas)

// 🎮 使用 GameType Fields Composable
// const { currentGameTypeImageUrl, turnToUrl } = useGameTypeFields(datas.value)

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
  <div class="ImageForGameTypeStyle">
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />
      <!-- 以下是组件的样式、数据配置 -->
      <componentHeadTitle :datas="datas" />
      <!-- Header样式配置 -->
      <header-title :datas="datas" />

      <!-- 游戏类型选择配置 - 动态组件必需 -->
      <StoreGameTypeList :datas="datas" />
      <!-- <el-form-item label="上传图片" prop="imageUrl">
        <FileImageUpload v-model="currentGameTypeImageUrl" type="info" :upload-from="EUploadFrom.BBS_MAINBOARD_ICON" />
      </el-form-item> -->
      <!-- <el-form-item label="跳转链接" prop="url">
        <el-input v-model="turnToUrl" placeholder="请输入跳转链接URL" />
      </el-form-item> -->
      <el-form-item label="内容文本" prop="content">
        <el-input v-model="datas.configParamJson.content" type="textarea" :rows="3" placeholder="请输入内容文本" />
      </el-form-item>

      <el-form-item label="是否启用" prop="enable">
        <el-switch v-model="datas.configParamJson.enable" />
      </el-form-item>

      <el-form-item label="显示游戏类型" prop="showGameType">
        <el-switch v-model="datas.configParamJson.showGameType" />
      </el-form-item>

      <el-form-item label="数据条数" prop="size">
        <el-input-number v-model="datas.configParamJson.size" :min="1" :max="50" placeholder="请输入数据条数" />
      </el-form-item>

      <el-form-item label="论坛ID" prop="forumId">
        <el-input v-model="datas.configParamJson.forumId" placeholder="请输入论坛ID" />
      </el-form-item>

      <!-- 样式设置 -->
      <el-divider content-position="left">样式配置</el-divider>

      <el-form-item label="背景颜色" prop="backgroundColor">
        <el-color-picker v-model="datas.configParamJson.styleMain.backgroundColor" show-alpha />
      </el-form-item>

      <el-form-item label="文字颜色" prop="textColor">
        <el-color-picker v-model="datas.configParamJson.styleMain.textColor" show-alpha />
      </el-form-item>

      <el-form-item label="文字大小" prop="fontSize">
        <el-slider v-model="datas.configParamJson.styleMain.fontSize" :min="12" :max="32" show-input />
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
        <el-slider v-model="datas.configParamJson.styleMain.borderRadius" :min="0" :max="30" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="内边距" prop="padding">
        <el-slider v-model="datas.configParamJson.styleMain.padding" :min="0" :max="50" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.ImageForGameTypeStyle {
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
</style>
