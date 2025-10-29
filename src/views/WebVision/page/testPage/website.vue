<template>
  <div class="home">
    <section class="operation">
      <div class="phone">
        <section class="phoneAll">
          <img src="@/assets/images/phoneTop.png" alt="" class="statusBar" />
          <StateManager :loading="isLoading" :error="isError" @refresh="fetchData()">
            <template v-for="item in componentsData">
              <div :class="{ wrapper: true }">
                <component
                  :key="item.componentId"
                  :is="item.componentType || 'div'"
                  :data="parseConfigParamJson(item.configParamJson)"
                  @tab-click="onTabsChange"
                  @update-issue="handleUpdateIssue"
                  v-if="item.isView === '' || item.isView === 'y'"
                />
                <!-- 如果没有匹配到组件，显示默认内容 -->
                <template v-if="!item.componentType">
                  <div class="no-component">
                    <p>没有匹配到组件:{{ item.componentName }}</p>
                    <p>组件类型：{{ item.componentType }}</p>
                  </div>
                </template>
              </div>
            </template>
            <van-empty v-if="noComponent" :description="`站点:${websiteId}  暂无数据`" />
            <!-- 浮动点击 -->
            <!-- <DownLoadFloat /> -->
          </StateManager>
        </section>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import 'vant/lib/index.css'
import { Empty as vanEmpty } from 'vant'
// import utils from '@/utils'
// import { componentMap } from '@/pages/componentMap'
// import constants from '@/constants'
import service from '@/service'
import StateManager from '../../components/componentsbiz/StateManager.vue'

// import DownLoadFloat from '@/components/Vue/DownLoadFloat.vue'
// import { PUBLIC_MANAGE_SITE_ID } from '@/consts'

const isLoading = ref(false)
const isError = ref(false)

const tabsData = ref<any[]>([])
const tabIndex = ref(0)
provide('tabIndex', tabIndex) // 提供 tabIndex
// const gameType = ref('');
// const gameTypeCode = ref('');
// const WEBSITE = ref(JSON.parse(utils.getSession(constants.sessionStorageKeys.WEBSITE) || '{}'))
// const WEBSITE = ref(JSON.parse('{}'));
const PUBLIC_MANAGE_SITE_ID = 'pw01tk01'
const websiteId = '1319260923621278993'
console.log('🚀 ~ websiteId:', websiteId)
// const websiteId = WEBSITE.value.websiteId || '1310634689215596485';
// const websiteId = WEBSITE.value.websiteId || '1317181822546739956';
// console.log('WEBSITE', WEBSITE.value);
// console.log('websiteId', websiteId);
//初始化请求彩种数据
const getGamePlatform = async () => {
  isLoading.value = true
  try {
    const response = await service.kv().getGamePlatform().do()
    console.log('🚀 ~ getGamePlatform ~ response:', response)
    let instance = service.kv()
    if (response[0].data) {
      // utils.setSession(constants.sessionStorageKeys.GAME_DATA, JSON.stringify(response[0].data))

      response[0].data.forEach((item: { gameTypeCode: string }) => {
        instance = instance.getGameIssueCurrent(item.gameTypeCode)
      })
    }
    const res = await instance.do()

    tabsData.value = response[0].data.map((item: any, index: number) => ({
      ...item,
      ...res[index]
    }))
    // utils.setSession(constants.sessionStorageKeys.GAME_DATA_ALL, JSON.stringify(tabsData.value))
    //初始化gameType
    // gameType.value = tabsData.value[0].gameType;
    // gameTypeCode.value = tabsData.value[0].gameTypeCode;
    // console.log('tabsData', tabsData.value);
  } catch (error) {
    console.error(error)
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

interface ComponentData {
  componentId: string
  componentName: string
  componentType: string
  isView: string
  configParamJson: any
}
const componentsData = ref<ComponentData[]>([])

// 监听 componentsData 变化

// 解析JSON
function parseConfigParamJson(input: any) {
  // console.log('input', input);
  if (!input) return {}
  if (typeof input === 'object') {
    return input
  }
  if (typeof input === 'string' && input.trim() !== '') {
    try {
      return JSON.parse(input)
    } catch (error) {
      console.error('JSON解析错误:', error, input)
    }
  }
  return {} // 返回空对象而不是空字符串
}

const handleUpdateIssue = () => {
  getGamePlatform()
}

const noComponent = ref(false)
const fetchData = async () => {
  try {
    //获取所有组件
    isLoading.value = true
    if (!websiteId) return
    const response = await service.kv().getPageComponent(websiteId).do()

    if (response[0].component) {
      console.log('response[0].component', response[0].component)

      componentsData.value = response[0].component

      // console.log('所有组件', response[0].component);
      // console.log(response[0].component[0].configParamJson);
    } else {
      noComponent.value = true
    }

    // componentsData.value = [...componentsData.value];
    // console.log(' componentsData.value ', componentsData.value);
  } catch (error) {
    isError.value = true
    console.error('请求失败:', error)
  } finally {
    isLoading.value = false
  }
}

// const websiteDomain = ref('');
const onTabsChange = (index: number) => {
  // console.log('tab-click', index);
  //已经全局注入
  tabIndex.value = index
  // utils.setSession(constants.sessionStorageKeys.TAB_INDEX, index) //其他页面用
}

// const storeValue = computed(() => useStore(globalStore).value);
// watch(storeValue, (newValue) => {
//   console.log('store updated:', newValue)
// })

// const store = useStore(globalStore);

// const WEBSITE = globalStore.value;

const getBBSListData = async () => {
  try {
    const manageSiteId = 'pw01tk01'
    const response = await service.kv().getBBSList(manageSiteId).do()
    // console.log(props.data.itemData);
    // console.log(response[0].data);
    // const BBS_LIST = new Map(response[0].data.map((item: any) => [item.bbsId, { ...item }]));
    const BBS_LIST = response[0].data
    // console.log(BBS_LIST);
    // utils.setSession(constants.sessionStorageKeys.BBS_LIST, JSON.stringify(BBS_LIST))
    // console.log(response[0]);
    // getBBSList
  } catch (error) {
    console.error(error)
  }
}

// const getWebsiteDomain = () => {
//   return new Promise(resolve => {
//     const timer = setInterval(() => {
//       const data = JSON.parse(utils.getSession(constants.sessionStorageKeys.WEBSITE_DOMAIN) || '{}');

//       if (data && Object.keys(data).length > 0) {
//         websiteId.value = data.websiteRef;
//         clearInterval(timer);
//         resolve(data);
//       }
//     }, 300); // 每100ms检查一次

//     // 可选：设置超时
//     setTimeout(() => {
//       clearInterval(timer);
//       resolve({}); // 超时返回空对象
//     }, 5000); // 5秒后超时
//   });
// };

onMounted(async () => {
  // https://ocs.ai4funs.com/pwtk?keys=wm/website/1308753047593158038/myPage/components
  // websiteDomain.value = utils.getSession(constants.sessionStorageKeys.WEBSITE_DOMAIN) || '';

  // const url = window.location.href;
  // const match = url.match(/website\/(\d+)\/(\w+)/);
  // if (match) {
  //   websiteId.value = match[1]; // 获取1308753047593158038
  //   // const pageName = match[2]; // 获取myPage
  //   // console.log("网站ID:", websiteId);
  //   // console.log("页面名称:", pageName);
  //   await fetchData(); //获取组件库
  // }
  // const WEBSITE_DOMAIN = JSON.parse(utils.getSession(constants.sessionStorageKeys.WEBSITE_DOMAIN) || '{}');
  // console.log("appDownloadUrl", appDownloadUrl.value);
  // console.log('WEBSITE_DOMAIN', WEBSITE_DOMAIN);
  // await getWebsiteDomain();
  // await getWebsiteDomain();
  console.log('11123')
  // utils.setSession(constants.sessionStorageKeys.TAB_INDEX, 0) //其他页面用
  await getBBSListData() //获取BBS列表
  await getGamePlatform() //获取开奖类型
  await fetchData()
})
</script>

<style scoped lang="less">
.no-component {
  width: 100%;
  border: 1px dushed red;
  background-color: #d8e611;
  font-size: 0.8rem;
}
.download-img {
  display: flex;
  margin: 0 auto;
}

.home {
  width: 100%;
  height: 100%;
  user-select: none;
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
        background: rgba(0, 0, 0, 0.5);
      }
      .icon-sanjiaoxingzuo {
        color: rgba(0, 0, 0, 0.5);
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
    justify-content: center;
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
</style>
