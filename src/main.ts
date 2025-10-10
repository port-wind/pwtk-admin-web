import '@/assets/css/main.less'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// import en from 'element-plus/dist/locale/en.mjs'
import 'element-plus/dist/index.css'

import 'vant/lib/index.css'
import Vant from 'vant'
import VueFroala from 'vue-froala-wysiwyg'
// 引入字体图标
import '@/assets/iconfont/iconfont.css'
import '@/assets/iconfont/iconfont.js'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import i18n from './locales'
import App from './App.vue'
import router from './router'
import http from './utils/http'
import copy from '@/components/common/copy.vue'
import NaviNestedTable from '@/views/Site/Navi/naviNestedTable.vue'
import mTable from '@/components/mTable/index.vue'
import mDialog from '@/components/mDialogForm/index.vue'
import mSearch from '@/components/mSearchForm/index.vue'
import mForm from '@/components/mForm/index.vue'
import mModalForm from '@/components/modalForm/index.vue'
import mComment from '@/components/mComment/index.vue'
import AutoComplete from '@/components/AutoComplete/index.vue'
import mTabPane from '@/components/mTabPane/index.vue'
import './assets/css/global.less'

const app = createApp(App)
// 挂载全局参数
app.config.globalProperties.$i18n = i18n.global
app.config.globalProperties.$http = http

// 拷贝组件
app.component('copy', copy)
app.component('NaviNestedTable', NaviNestedTable)
app.component('AutoComplete', AutoComplete)
app.component('mDialog', mDialog)
app.component('mSearch', mSearch)

app.component('m-table', mTable)
app.component('m-form', mForm)
app.component('m-modal-form', mModalForm)
app.component('m-comment', mComment)
app.component('m-tab-pane', mTabPane)

// 注册 ElementPlus 图标组件
Object.entries(ElementPlusIconsVue).forEach(([key, component]) => {
  app.component(key, component)
})

// webVision 提前加载组件
const modules = import.meta.glob('@/views/WebVision/components/**/*.vue', { eager: true })
Object.entries(modules).forEach(([path, module]: any) => {
  const segments = path.split('/')
  // 如果是 index.vue，就用父级目录名作为组件名
  let componentName = ''
  if (segments[segments.length - 1] === 'index.vue') {
    componentName = segments[segments.length - 2] // 上一层目录名
  } else {
    componentName = segments[segments.length - 1].replace(/\.vue$/, '')
  }
  app.component(componentName, module.default)
})

app.use(createPinia())
app.use(i18n)
app.use(router)
app.use(ElementPlus, { locale: zhCn })
app.use(Vant)
app.use(VueFroala)
app.mount('#app')
