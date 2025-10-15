<template>
  <div class="home">
    <!-- 装修操作 -->
    <section class="operation">
      <!-- 组件 -->
      <sliderassembly :pointer="pointer" only />
      <!-- 手机 -->
      <div class="phone">
        <section class="phoneAll" ref="imageTofile" id="imageTofile" @click="onStopPropagation">
          <img src="@/assets/images/phoneTop.png" alt="" class="statusBar" />
          <!-- 头部导航 -->
          <headerTop :page="pageInfo" />
          <!-- 主体内容 -->
          <section class="phone-container" @drop="drop($event)" @dragover="allowDrop($event)" @dragleave="dragleaves()">
            <!-- 动态组件 -->
            <vuedraggable
              :class="pointer.show ? 'pointer-events' : ''"
              :list="pageComponents"
              :forceFallback="false"
              :animation="200"
              item-key="index"
            >
              <template #item="{ element, index }">
                <component
                  :is="element.component"
                  :datas="element.setStyle"
                  @click="activeComponent(element, index)"
                  class="componentsClass"
                  :style="{
                    border: element.active ? '' : ''
                  }"
                >
                  <template #deles>
                    <div class="deles">
                      <span class="iconfont icon-sanjiaoxingzuo"></span>
                      {{ element.text }}
                    </div>
                  </template>
                </component>
              </template>
            </vuedraggable>
          </section>
          <!-- 手机高度 -->
          <div class="phoneSize">iPhone 12pro手机高度</div>
          <!-- 底部 -->
          <phoneBottom />
        </section>
        <!-- 底部 -->
      </div>
      <!-- 右侧工具栏 -->
      <section class="component-settings">
        <el-tabs
          v-loading="isLoading"
          class="custom-tabs"
          type="border-card"
          v-model="tab"
          @tab-change="onTabChange"
          :stretch="true"
        >
          <!-- <el-tab-pane class="custom-el-tab-pane" :name="ETab.page">
            <template #label>
              <span class="custom-tabs-label">
                <el-icon><SetUp /></el-icon>
                <span>站点设置</span>
              </span>
            </template>
            <decorate :datas="page" />
          </el-tab-pane>
          -->
          <el-tab-pane class="custom-el-tab-pane" :name="ETab.list">
            <template #label>
              <span class="custom-tabs-label">
                <el-icon><ScaleToOriginal /></el-icon>
                <span>组件管理</span>
              </span>
            </template>
            <componenmanagement only :datas="pageComponents" @componenmanagement="onSortList" @delete="deleteObj" />
          </el-tab-pane>
          <el-tab-pane class="custom-el-tab-pane" label="组件设置详情" :name="ETab.detail">
            <template #label>
              <span class="custom-tabs-label">
                <el-icon><Edit /></el-icon>
                <span>组件设置详情</span>
              </span>
            </template>
            <div class="switch-area">
              <el-button-group size="small" v-if="rightcom !== 'blank'">
                <el-button type="primary" :icon="Edit" :plain="isEditJSON" @click="openVision">视图模式</el-button>
                <el-button type="primary" :icon="Document" :plain="!isEditJSON" @click="openVisionJSON">
                  JSON模式
                </el-button>
              </el-button-group>
            </div>
            <div class="editor-area">
              <div :class="{ editor: true, 'show-view': !isEditJSON }">
                <component :is="rightcom" :datas="setStyle" />
              </div>
              <div :class="{ editor: true, 'show-json': isEditJSON }">
                <editorModelStyle :datas="setStyle" />
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <section class="submit-area">
          <div class="all-submit">
            <el-button class="btn" @click="onSubmitAll" type="primary" :loading="isLoading" style="width: 160px">
              更新预设值
            </el-button>
          </div>
        </section>
      </section>
    </section>

    <!-- <div class="debugger-text">
      {{ setStyle }}
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { SetUp, ScaleToOriginal, Edit, Document } from '@element-plus/icons-vue'
import { reactive, toRefs, ref, onMounted } from 'vue'
import { isArray } from 'lodash-es'
import vuedraggable from 'vuedraggable' //拖拽组件
import componentProperties from './components/componentsbiz/componentProperties' // 组件数据
import phoneBottom from '@/views/WebVision/components/phoneBottom/index.vue'
import headerTop from '@/views/WebVision/components/headerTop/index.vue'
import editorModelStyle from '@/views/WebVision/components/rightslider/editorModelStyle/index.vue'
import utils from '@/views/WebVision/const/index'
import { ETab, type ChooseData, type ComponentItem, type IDatas } from './type'
import { useRoute } from 'vue-router'
import { editSysComponent, getSysComponent } from '@/api/webgw/sysCompent'
import type { IEditSysComponentQueryParams, IGetSysComponentData } from '@/api/webgw/sysCompent/types'
import type { TabPaneName } from 'element-plus'
const route = useRoute()

const currentComponent = ref<IGetSysComponentData>()

const name = computed(() => {
  return '修改组件' + ' ' + currentComponent.value?.componentName + ' ' + currentComponent.value?.componentType
})

const pageInfo = computed(() => {
  return {
    name: '修改组件' + ' ' + currentComponent.value?.componentName + ' ' + currentComponent.value?.componentType,
    titleHeight: 50
  }
})

// 加载当前页面数据
const datas = reactive<IDatas>({
  // page
  page: {
    name: '修改组件', //页面名称
    details: '页面描述信息',
    titleHeight: 50
  },
  // list
  pageComponents: [] //页面组件
})
const isLoading = ref(false)
const initChooseData = () => {
  return {
    pointer: { show: false }, // 穿透
    // 选中组件相关的
    index: -1, // 当前选中组件index
    offsetY: 0, //记录上一次距离父元素高度

    rightcom: 'blank', // 当前选中组件的对应的文件名字
    setStyle: {
      componentId: '', // component, template, website
      sketchCodeList: '', // component
      componentType: '',
      componentSort: '',
      status: '',
      isView: '',
      memo: '',
      componentName: '',
      pageCode: '',
      configParamJson: {}
    } // 当前选中组件的对应的属性
  }
}
const onSubmitAll = async () => {
  try {
    isLoading.value = true
    const query: IEditSysComponentQueryParams = {
      componentId: choose.setStyle.componentId,
      componentName: choose.setStyle.componentName,
      componentType: choose.setStyle.componentType,
      configParamJson: JSON.stringify(choose.setStyle.configParamJson),
      preset: JSON.stringify(choose.setStyle.configParamJson),
      isView: choose.setStyle.isView,
      memo: choose.setStyle.memo,
      pageCode: choose.setStyle.pageCode,
      sketchCodeList: choose.setStyle.sketchCodeList,
      status: choose.setStyle.status
    }
    const res = await editSysComponent(query)
    if (res.success) {
      isLoading.value = false
      ElMessage({
        type: 'success',
        message: '已更新'
      })
    } else {
      ElMessage({
        type: 'error',
        message: '更新失败'
      })
    }
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

const fetchData = async () => {
  try {
    const { componentId } = route.query
    const res = await getSysComponent({
      page: 1,
      size: 10,
      componentId: componentId as string
    })

    if (res.success) {
      // NEW
      const newComponent: any = {
        setStyle: {
          configParamJson: {}
        }
      }
      const presisComponent = res.data.list[0]
      currentComponent.value = res.data.list[0]
      const defaultComponent = utils.deepClone(componentProperties.get(presisComponent.componentType))

      let { configParamJson, preset, ...setStyle } = presisComponent

      if (typeof preset === 'string') {
        preset = preset ? JSON.parse(preset) : {}
      }

      if (typeof configParamJson === 'string') {
        configParamJson = configParamJson ? JSON.parse(configParamJson) : {}
      }

      Object.assign(defaultComponent.setStyle, setStyle)
      if (preset) {
        Object.assign(defaultComponent.setStyle.configParamJson, preset)
      } else {
        Object.assign(defaultComponent.setStyle.configParamJson, configParamJson)
      }

      Object.assign(newComponent, defaultComponent)
      datas.pageComponents.push(newComponent)

      activeComponent(newComponent, 0)
    }
  } catch (error) {
    throw new Error(`${error}`)
  }
}

onMounted(() => {
  fetchData()
})

// 选择组件数据
const choose = reactive<ChooseData>(initChooseData())

//website list detail
const tab = ref<ETab>(ETab.detail)
const onTabChange = (val: TabPaneName) => {
  switch (val) {
    case ETab.page:
      break
    case ETab.list:
      break
    case ETab.detail:
      break
  }
}

const isEditJSON = ref(false)

const openVision = () => {
  isEditJSON.value = false
}
const openVisionJSON = () => {
  isEditJSON.value = true
}

/**
 * 切换组件位置  用于组件管理中删除功能
 * @param {Object} res 组件切换后返回的位置
 */
const onSortList = (res: any) => {
  datas.pageComponents = res
}

/**
 * 选择组件
 * @param {Object} res 当前组件对象
 */
const activeComponent = (res: ComponentItem, index: number) => {
  if (choose.setStyle.componentId === res.setStyle?.componentId) {
    return
  }

  datas.pageComponents.forEach((res) => {
    if (res.active === true) {
      res.active = false
    }
  })
  res.active = true
  choose.rightcom = res.style! // 加载配置组件
  choose.index = index
  choose.setStyle = res.setStyle!
  tab.value = ETab.detail
}

const submitJson = () => {}

// 切换标题
const headTop = () => {
  // 清空选择
  datas.pageComponents.forEach((res) => {
    res.active = false
  })
  tab.value = ETab.page
}

const onStopPropagation = (event: Event) => {
  event.stopPropagation()
}

/**
 * 删除组件
 *
 * @param {Number} index 当前组件index
 */
const deleteObj = (index: number) => {
  datas.pageComponents.splice(index, 1)

  if (datas.pageComponents.length === 0 || choose.index === index) {
    choose.rightcom = 'blank'
    choose.setStyle = {}
  }

  if (index < choose.index) {
    choose.index = choose.index - 1
  }
}

const allowDrop = (event: DragEvent) => {
  //阻止浏览器的默认事件
  event.preventDefault()

  /* 获取鼠标高度 */
  let eventoffset = event.offsetY

  /* 如果没有移动不触发事件减少损耗 */
  if (choose.offsetY === eventoffset) {
    return
  } else {
    choose.offsetY = eventoffset
  }

  /* 获取组件 */
  //@ts-ignore
  const childrenObject = event?.target?.children && event?.target?.children[0]

  // 一个以上的组件计算
  if (datas.pageComponents.length) {
    /* 如果只有一个组件并且第一个是提示组件直接返回 */
    if (datas.pageComponents.length === 1 && datas.pageComponents[0].component === 'placementarea') {
      return
    }

    /* 如果鼠标的高度小于第一个的一半直接放到第一个 */
    if (eventoffset < childrenObject.children[0].clientHeight / 2) {
      /* 如果第一个是提示组件直接返回 */
      if (datas.pageComponents[0].component === 'placementarea') return

      /* 删除提示组件 */
      datas.pageComponents = datas.pageComponents.filter((res) => res.component !== 'placementarea')

      /* 最后面添加提示组件 */
      datas.pageComponents.unshift({
        component: 'placementarea'
      })

      return
    }

    /* 记录距离父元素高度 */
    const childOff = childrenObject.offsetTop

    /* 鼠标在所有组件下面 */
    if (
      eventoffset > childrenObject.clientHeight ||
      childrenObject.lastChild.offsetTop - childOff + childrenObject.lastChild.clientHeight / 2 < eventoffset
    ) {
      /* 最后一个组件是提示组件返回 */
      if (datas.pageComponents[datas.pageComponents.length - 1].component === 'placementarea') return

      /* 清除提示组件 */
      datas.pageComponents = datas.pageComponents.filter((res) => res.component !== 'placementarea')

      /* 最后一个不是提示组件添加 */
      datas.pageComponents.push({
        component: 'placementarea'
      })

      return
    }

    const childrens = childrenObject.children

    /* 在两个组件中间，插入 */
    for (let i = 0, l = childrens.length; i < l; i++) {
      const childoffset = childrens[i].offsetTop - childOff

      if (childoffset + childrens[i].clientHeight / 2 > event.offsetY) {
        /* 如果是提示组件直接返回 */
        if (datas.pageComponents[i].component === 'placementarea') break

        if (datas.pageComponents[i - 1].component === 'placementarea') break

        /* 清除提示组件 */
        datas.pageComponents = datas.pageComponents.filter((res) => res.component !== 'placementarea')

        datas.pageComponents.splice(i, 0, {
          component: 'placementarea'
        })
        break
      } else if (childoffset + childrens[i].clientHeight > event.offsetY) {
        if (datas.pageComponents[i].component === 'placementarea') break

        if (!datas.pageComponents[i + 1] || datas.pageComponents[i + 1].component === 'placementarea') break

        datas.pageComponents = datas.pageComponents.filter((res) => res.component !== 'placementarea')

        datas.pageComponents.splice(i, 0, {
          component: 'placementarea'
        })

        break
      }
    }
  } else {
    /* 一个组件都没有直接push */
    datas.pageComponents.push({
      component: 'placementarea'
    })
  }
}

const drop = (event: any) => {
  /* 获取数据 */
  const _componentName = event.dataTransfer.getData('componentName')
  let data = utils.deepClone(componentProperties.get(_componentName))
  /* 替换 */
  datas.pageComponents.forEach((res, index) => {
    /* 修改选中 */
    if (res.active === true) {
      res.active = false
    }
    /* 替换提示 */
    choose.index = index
    if (res.component === 'placementarea') {
      datas.pageComponents[index] = data
    }
  })
  /* 切换组件 */
  choose.rightcom = data.style
  /* 当前组件样式 */
  //@ts-ignore
  const {
    componentId,
    sketchCodeList,
    templateId,
    pageRenderingSeq,
    websiteId,
    componentRef,
    componentName,
    componentType,
    componentSort,
    status,
    isView,
    memo,
    pageCode,
    configParamJson,
    ...reset
  } = data.setStyle
  //@ts-ignore
  Object.assign(data.setStyle.configParamJson, reset)
  choose.setStyle = data.setStyle
}

const dragleaves = () => {
  /* 删除提示组件 */
  datas.pageComponents = datas.pageComponents.filter((res) => res.component !== 'placementarea')
}

const configParamJsonData = computed(() => {
  //@ts-ignore
  const { configParamJson, ...reset } = setStyle
  return {
    ...reset
  }
})

const { pageComponents, page } = toRefs(datas)
const { rightcom, setStyle, pointer } = toRefs(choose)
</script>

<style lang="less" scoped>
.pointer-events {
  pointer-events: none;
}

.home {
  width: 100%;
  height: 100%;
  /* 删除组件 */
  .deles {
    position: absolute;
    min-width: 80px;
    text-align: center;
    line-height: 25px;
    background: #fff;
    height: 25px;
    font-size: 12px;
    left: 103%;
    top: 50%;
    transform: translateY(-50%);
    .icon-sanjiaoxingzuo {
      position: absolute;
      left: -11px;
      color: #fff;
      font-size: 12px;
      top: 50%;
      transform: translateY(-50%);
    }
    &:hover {
      i {
        display: block;
        position: absolute;
        left: 0;
        font-size: 16px;
        top: 0;
        text-align: center;
        line-height: 25px;
        width: 100%;
        color: #fff;
        height: 100%;
        z-index: 10;
        // background: rgba(0, 0, 0, 0.5);
      }
      .icon-sanjiaoxingzuo {
        // color: rgba(0, 0, 0, 0.5);
      }
    }

    i {
      display: none;
    }
  }

  /* 操作主体 */
  .operation {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: #f7f8fa;
  }

  /* 手机 */
  .phone {
    width: 55%;
    height: 100%;
    overflow-y: scroll;
    display: flex;
    justify-content: center;
    background: #f7f8fa;
    &::-webkit-scrollbar {
      width: 1px;
    }
    // &::-webkit-scrollbar-thumb {
    //   background-color: #155bd4;
    // }

    /* 手机样式 */
    .phoneAll {
      width: 375px;
      min-height: 760px;
      box-shadow: 0 0 14px 0 rgba(0, 0, 0, 0.1);
      margin: 45px 0;
      position: relative;

      /* 手机高度 */
      .phoneSize {
        position: absolute;
        left: -137px;
        top: 844px;
        font-size: 12px;
        color: #a2a2a2;
        border-bottom: 1px solid #dedede;
        width: 130px;
        height: 21px;
        line-height: 21px;
      }

      /* 状态栏 */
      .statusBar {
        width: 100%;
        display: block;
      }

      /* 主体内容 */
      .phone-container {
        min-height: 807px;
        box-sizing: border-box;
        cursor: pointer;
        width: 100%;
        position: relative;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        .componentsClass {
          border: 2px solid #fff;
          &:hover {
            border: 2px dashed #155bd4;
          }
        }
      }
    }
  }

  /* 右侧工具栏 */
  .decorateAll {
    // width: 376px;
    // height: 100%;
    // overflow-y: scroll;
    // overflow-x: hidden;
    // position: relative;
    // padding: 0 12px;
    // background: #fff;
    &::-webkit-scrollbar {
      width: 1px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #155bd4;
    }
  }

  /* 页面设置tab */
  .decorateTab {
    position: fixed;
    display: flex;
    right: 50%;
    top: 0;
    flex-direction: column;
    span {
      background-color: #fff;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
      border-radius: 2px;
      width: 94px;
      height: 32px;
      display: inline-block;
      text-align: center;
      line-height: 32px;
      margin-bottom: 12px;
      transition: all 0.8s;
      cursor: pointer;
      &.active {
        background-color: #155bd4;
        color: #fff;
      }
      /* 图标 */
      i {
        font-size: 12px;
        margin-right: 5px;
      }
    }
  }
}

/* 动画 */
.decorateAnima-enter-active {
  transition: all 1.5s ease;
}
.decorateAnima-leave-active {
  transition: all 1.5s ease;
}
.decorateAnima-enter {
  transform: translate(8px, 8px);
  opacity: 0;
}
.decorateAnima-leave-to {
  transform: translate(8px, 8px);
  opacity: 0;
}

.debugger-text {
  position: absolute;
  z-index: 999;
  padding: 30px;
  bottom: 40px;
  background-color: #155bd4;
  color: white;
  font-size: 20px;
}

.component-settings {
  min-width: 450px;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  background-color: white;
  height: 100%;
}

.custom-tabs {
  flex: 1;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  :deep(.el-tabs__content) {
    overflow: auto;
    padding: 10px;
    display: flex;
    flex-direction: column;
    height: 100%;
    &::-webkit-scrollbar {
      width: 6px;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #0000007b;
      border-radius: 10px;
      opacity: 0.5;
    }
  }
}

.custom-tabs-label .el-icon {
  vertical-align: middle;
}
.custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}

.component-wrapper {
  height: 100%;
  overflow: auto;
}
.switch-area {
  padding: 0;
  display: grid;
  place-items: center;
  margin-bottom: 10px;
}

.submit-area {
  background: var(--el-bg-color-overlay);
  border-left: 1px solid var(--el-border-color);
  min-height: 60px;
}

.all-submit {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

.custom-el-tab-pane {
  display: flex;
  flex-direction: column;
}

.editor-area {
  overflow: auto;
  flex: 1;
  .editor {
    display: none;
    &.show-view {
      display: block;
    }
    &.show-json {
      display: block;
    }
  }
}

.header-top {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  padding: 10px;
  background-color: #f7f8fa;
  border-bottom: 1px solid #e0e0e0;
}
</style>
