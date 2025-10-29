<template>
  <div class="navbar-box-style">
    <!-- 标题 -->
    <h2>导航菜单</h2>

    <!-- 表单 -->
    <el-form label-width="80px" :model="datas">
      <!-- 模板选择 -->
      <el-form-item label="选择模板" class="lef">
        <p style="color: #000">{{ styleText }}</p>
      </el-form-item>

      <!-- 模式选择 -->
      <div class="mode-type">
        <el-tooltip class="item" effect="dark" content="标准选项卡" placement="bottom">
          <span
            class="iconfont icon-biaoqian"
            style="font-size: 20px"
            :class="datas.configParamJson.model === 's1' ? 'active' : ''"
            @click="datas.configParamJson.model = 's1'"
          />
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="胶囊式" placement="bottom">
          <span
            class="iconfont icon-jiaonang"
            style="font-size: 20px"
            :class="datas.configParamJson.model === 's2' ? 'active' : ''"
            @click="datas.configParamJson.model = 's2'"
          />
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="按钮组" placement="bottom">
          <span
            class="iconfont icon-anniuzu"
            style="font-size: 20px"
            :class="datas.configParamJson.model === 's3' ? 'active' : ''"
            @click="datas.configParamJson.model = 's3'"
          />
        </el-tooltip>
      </div>

      <!-- 下划线 -->
      <div class="bor" />

      <h5 style="color: #000; font-size: 14px">导航项设置</h5>
      <p style="color: #969799; font-size: 12px; margin-top: 10px">拖动选中的导航项可对其排序</p>

      <!-- 导航项列表 -->
      <div v-if="datas.configParamJson.itemData[0]">
        <vuedraggable :list="datas.configParamJson.itemData" item-key="index" :forceFallback="false" :animation="200">
          <template #item="{ element, index }">
            <section class="nav-item">
              <van-icon class="el-icon-circle-close" name="close" @click="deleteNavItem(index)" />

              <!-- 导航项配置 -->
              <div class="nav-item-content">
                <el-input v-model="element.name" placeholder="请输入导航名称" style="margin-bottom: 8px" />

                <el-input v-model="element.id" placeholder="请输入锚点ID (用于跳转定位)" />

                <!-- 禁用状态 -->
                <div class="nav-item-setting">
                  <el-checkbox v-model="element.disabled">禁用该项</el-checkbox>
                </div>
              </div>
            </section>
          </template>
        </vuedraggable>
      </div>

      <!-- 添加导航项按钮 -->
      <el-button @click="addNavItem" class="add-nav-btn" type="primary" plain>添加导航项</el-button>

      <!-- 下划线 -->
      <div class="bor" />

      <!-- 吸顶设置 -->
      <el-form-item label="吸顶效果" class="lef">
        <el-switch v-model="datas.configParamJson.tabsAttr.sticky" />
      </el-form-item>

      <!-- 吸顶偏移 -->
      <el-form-item label="吸顶偏移" class="lef" v-show="datas.configParamJson.tabsAttr.sticky">
        <el-slider v-model="datas.configParamJson.tabsAttr.offsetTop" :max="100" input-size="small" show-input />
      </el-form-item>

      <!-- 动画效果 -->
      <el-form-item label="动画效果" class="lef">
        <el-switch v-model="datas.configParamJson.tabsAttr.animated" />
      </el-form-item>

      <!-- 滑动切换 -->
      <el-form-item label="滑动切换" class="lef">
        <el-switch v-model="datas.configParamJson.tabsAttr.swipeable" />
      </el-form-item>

      <div style="height: 10px" />

      <!-- 下划线宽度 -->
      <el-form-item label="下划线宽度" class="lef" v-show="datas.configParamJson.model === 's1'">
        <el-slider v-model="datas.configParamJson.tabsAttr.lineWidth" :max="50" input-size="small" show-input />
      </el-form-item>

      <!-- 下划线高度 -->
      <el-form-item label="下划线高度" class="lef" v-show="datas.configParamJson.model === 's1'">
        <el-slider v-model="datas.configParamJson.tabsAttr.lineHeight" :max="10" input-size="small" show-input />
      </el-form-item>

      <div style="height: 10px" />

      <!-- 背景颜色 -->
      <el-form-item label="背景颜色" class="lef">
        <el-color-picker v-model="datas.configParamJson.bgColor" show-alpha />
      </el-form-item>

      <!-- 主题颜色 -->
      <el-form-item label="主题颜色" class="lef">
        <el-color-picker v-model="datas.configParamJson.tabsAttr.color" />
      </el-form-item>

      <!-- 滚动偏移 -->
      <el-form-item label="滚动偏移" class="lef">
        <el-slider v-model="datas.configParamJson.scrollOffset" :max="200" input-size="small" show-input />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="NavBarBoxStyle">
import { ref, computed, onMounted } from 'vue'
import vuedraggable from 'vuedraggable'
import type { IDatas } from '@/views/WebVision/components/componentsbiz/NavBarBox/type'

interface IProps {
  datas: IDatas
}

const props = defineProps<IProps>()

// 响应式状态
const emptyText = ref('')

// 计算属性
const styleText = computed(() => {
  const modeMap = {
    s1: '标准选项卡',
    s2: '胶囊式',
    s3: '按钮组'
  }
  return modeMap[props.datas.configParamJson.model] || '未知模式'
})

// 方法定义
const initDefaultData = () => {
  // 确保configParamJson存在
  if (!props.datas.configParamJson) {
    props.datas.configParamJson = {} as any
  }

  // 确保tabsAttr存在
  if (!props.datas.configParamJson.tabsAttr) {
    props.datas.configParamJson.tabsAttr = {} as any
  }

  // 设置默认值
  const defaultTabsAttr = {
    sticky: false,
    offsetTop: 0,
    animated: true,
    swipeable: false,
    lineWidth: 20,
    lineHeight: 3
  }

  Object.keys(defaultTabsAttr).forEach((key) => {
    if (props.datas.configParamJson.tabsAttr[key] === undefined) {
      ;(props.datas.configParamJson.tabsAttr as any)[key] = (defaultTabsAttr as any)[key]
    }
  })

  // 确保其他必需属性存在
  if (!props.datas.configParamJson.model) {
    ;(props.datas.configParamJson as any).model = 's1'
  }

  if (!props.datas.configParamJson.itemData) {
    ;(props.datas.configParamJson as any).itemData = []
  }

  if (props.datas.configParamJson.scrollOffset === undefined) {
    ;(props.datas.configParamJson as any).scrollOffset = 0
  }

  if (!props.datas.configParamJson.bgColor) {
    ;(props.datas.configParamJson as any).bgColor = '#155bd4'
  }
}

const addNavItem = () => {
  const newItem = {
    id: `nav-${Date.now()}`,
    name: `导航项${props.datas.configParamJson.itemData.length + 1}`,
    disabled: false
  }
  props.datas.configParamJson.itemData.push(newItem)
  console.log('添加导航项:', newItem)
}

const deleteNavItem = (index: number) => {
  props.datas.configParamJson.itemData.splice(index, 1)
  console.log('删除导航项索引:', index)
}

// 生命周期
onMounted(() => {
  initDefaultData()
})
</script>

<style scoped lang="scss">
.navbar-box-style {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  padding: 0 10px;
  box-sizing: border-box;

  /* 标题 */
  h2 {
    padding: 24px 16px 24px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #f2f4f6;
    font-size: 18px;
    font-weight: 600;
    color: #323233;
  }

  .lef {
    :deep(.el-form-item__label) {
      text-align: left;
    }
  }

  /* 模式选择样式 */
  .mode-type {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 20px;

    span {
      display: inline-block;
      width: 58px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      background: #ebedf0;
      color: #979797;
      border: 1px solid #fff;
      cursor: pointer;
      transition: all 0.5s;
      border-radius: 4px;

      &:hover {
        border: 1px solid #155bd4;
        color: #155bd4;
      }

      &.active {
        border: 1px solid #155bd4;
        background-color: #e0edff;
        color: #155bd4;
      }
    }
  }

  /* 下划线 */
  .bor {
    height: 1px;
    background: #f2f4f6;
    margin: 20px 0;
  }

  /* 添加导航项按钮 */
  .add-nav-btn {
    width: 145px;
    height: 40px;
    margin-top: 10px;
    margin-bottom: 20px;
  }

  /* 导航项列表 */
  .nav-item {
    padding: 12px;
    margin: 16px 0;
    border-radius: 6px;
    background-color: #fff;
    box-shadow: 0 2px 8px 0 rgba(10, 42, 97, 0.15);
    display: flex;
    flex-direction: column;
    position: relative;

    /* 删除图标 */
    .el-icon-circle-close {
      position: absolute;
      right: -8px;
      top: -8px;
      cursor: pointer;
      font-size: 18px;
      color: #f56c6c;
      background: #fff;
      border-radius: 50%;
      z-index: 10;
    }

    /* 导航项内容 */
    .nav-item-content {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .nav-item-setting {
        display: flex;
        align-items: center;
        margin-top: 8px;

        :deep(.el-checkbox) {
          .el-checkbox__label {
            font-size: 12px;
            color: #666;
          }
        }
      }
    }
  }

  /* 表单项样式优化 */
  :deep(.el-form-item) {
    margin-bottom: 16px;

    .el-form-item__label {
      font-size: 13px;
      color: #323233;
      font-weight: 500;
    }
  }

  /* 滑块样式 */
  :deep(.el-slider) {
    .el-slider__runway {
      background-color: #ebedf0;
    }

    .el-slider__bar {
      background-color: #155bd4;
    }

    .el-slider__button {
      border-color: #155bd4;
    }
  }

  /* 开关样式 */
  :deep(.el-switch) {
    &.is-checked .el-switch__core {
      background-color: #155bd4;
    }
  }

  /* 颜色选择器样式 */
  :deep(.el-color-picker) {
    .el-color-picker__trigger {
      width: 40px;
      height: 32px;
      border-radius: 4px;
    }
  }
}
</style>
