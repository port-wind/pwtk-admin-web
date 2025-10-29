<template>
  <div class="sliderassembly">
    <el-page-header @back="goBack" class="back-btn">
      <template #content>
        <span class="page-title">
          {{ pageTitle }}
        </span>
      </template>
    </el-page-header>
    <el-collapse v-model="activeNames">
      <el-collapse-item :title="items.title" :name="index + 1" v-for="(items, index) in datas" :key="index">
        <div
          class="componList"
          :draggable="!props.only"
          @dragstart="drag($event)"
          @dragend="dragends($event)"
          :data-name="item.name"
          v-for="(item, ind) in items.comList"
          :key="ind"
        >
          <div class="comp-icon">
            <i class="iconfont" :class="item.icon" v-if="item.icon" />
            <el-icon v-else><ElementPlus /></el-icon>
          </div>
          <div class="comp-name">
            <span>{{ item.text }}</span>
            <p>{{ item.name }}</p>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElementPlus } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { editSysComponent, getSysComponent } from '@/api/webgw/sysCompent'
import { useRouter } from 'vue-router'
import { reqGetAllCompType } from '@/api/site/sysComponent'
const router = useRouter()
const route = useRoute()
const path = route.path
// Define interfaces
interface ComponentItem {
  text: string
  type?: string
  icon?: string
  vanIcon?: string
  name: string
}

interface DataItem {
  title: string
  comList: ComponentItem[]
}

interface Pointer {
  show: boolean
}

// Define props
const props = defineProps<{
  pointer: Pointer
  only?: boolean // 单个组件，只显示一个
}>()

// 侧边栏组件显示
// [1] 基本组件 [2] 业务组件
const activeNames = ref<number[]>([1])

const pageTitle = computed(() => {
  return (
    (path === '/webVisionBuilder' && '页面组件库') ||
    (path === '/webVisionBuilderTemplate' && '模版管理') ||
    (path === '/webVisionBuilderWebsite' && '站点管理')
  )
})

const goBack = () => {
  switch (path) {
    case '/webVisionBuilder':
      router.push({
        path: '/site/componentBase'
      })
      break
    case '/webVisionBuilderTemplate':
      router.push({
        path: '/site/templateManagement'
      })
      break
    case '/webVisionBuilderWebsite':
      router.push({
        path: '/site/siteManagement'
      })
      break
    default:
      router.push({
        path: '/site/componentBase'
      })
      break
  }
}

// 组件信息配置
const datas = reactive<DataItem[]>([
  {
    title: '基础组件',
    comList: []
  },
  {
    title: '业务组件',
    comList: []
  },
  { title: '页面组件', comList: [] },
  { title: '图片类', comList: [] },
  { title: 'Header类组件', comList: [] },
  { title: '开奖类组件', comList: [] },
  { title: '带期数组件', comList: [] },
  { title: '无期数列表组件', comList: [] }
])

/**
 * 当用户开始拖动元素或选择文本时触发此事件
 *
 * @param event DragEvent对象
 */
const drag = (event: DragEvent): void => {
  if (event.dataTransfer) {
    /* 开启穿透 */
    props.pointer.show = true
    /* 传递参数 */
    event.dataTransfer.setData('componentName', (event.currentTarget as HTMLElement).dataset.name || '')
  }
}

/**
 * 当拖动操作结束时（释放鼠标按钮或按下退出键），会触发此事件
 *
 * @param event DragEvent对象
 */
const dragends = (event: DragEvent): void => {
  /* 关闭穿透 */
  props.pointer.show = false
}

const fetchData = async () => {
  let res = await reqGetAllCompType({ page: 1, size: 1000 })
  if (res.success) {
    datas[0].comList = res.data.list.map((item) => ({
      text: item.componentName,
      name: item.componentType
    }))
  }
}

onMounted(async () => {
  fetchData()
})
</script>

<style scoped lang="less">
/* 组件 */
.sliderassembly {
  width: 275px;
  height: 100%;
  overflow-y: scroll;
  border-right: 1px solid #ebedf0;
  box-sizing: border-box;
  padding: 0 12px;
  background: #fff;
  /* 滚动条 */
  &::-webkit-scrollbar {
    width: 1px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #155bd4;
  }
  :deep(.el-collapse-item__header),
  :deep(.el-collapse-item__wrap) {
    border-bottom: 0 !important;
  }

  /* 组件列表 */
  .componList {
    display: flex;
    column-gap: 10px;
    margin-bottom: 8px;
    align-items: center;
    cursor: all-scroll;
    transition: all 0.3s;
    padding-left: 10px;
    .comp-icon {
      font-size: 1.5rem;
      width: 2rem;
      line-height: 32px;
      color: #b0a8a8;
      margin-top: 4px;
    }
    .comp-name {
      font-size: medium;
      color: #323233;
      p {
        color: #7d7e80;
        font-size: small;
      }
    }
    &:hover {
      background: #155bd4;
      border-radius: 2px;
      // font-weight: 700;
      i,
      p,
      span {
        color: #fff;
      }
    }
    /* 图标 */
    i {
      font-size: 32px;
      width: 32px;
      height: 32px;
      line-height: 32px;
      color: #b0a8a8;
      margin-top: 4px;
    }
  }
}

.back-btn {
  :deep(.el-page-header__header) {
    height: 50px;
  }
  :deep(.el-page-header__title) {
    white-space: nowrap;
  }
}
.page-title {
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
