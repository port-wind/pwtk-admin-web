<template>
  <div class="carousel-app">
    <div class="carousel-app-container">
      <!-- Tab导航 -->
      <div class="tab-nav">
        <div
          v-for="(tab, index) in datas.configParamJson.tabs"
          :key="index"
          :class="['tab-item', { active: activeTab === index }]"
          @click="switchTab(index)"
        >
          {{ tab.title }}
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="tab-content">
        <div
          v-for="(tab, index) in datas.configParamJson.tabs"
          :key="index"
          :class="['tab-pane', { active: activeTab === index }]"
        >
          <!-- 推广横幅 -->
          <div class="promo-banner">
            <img :src="getFullUrl(tab.banner, PUBLIC_CDN_URL)" :alt="tab.appName" draggable="false" />
            <!-- <div class="banner-content">
              <span class="promo-text">{{ tab.promoText }}</span>
              <span class="amount">{{ tab.amount }}</span>
            </div> -->
          </div>

          <!-- 应用推广卡片 -->
          <div class="app-card">
            <!-- 应用图标和信息 -->
            <div class="app-info">
              <div class="app-icon">
                <img
                  v-if="tab.appIcon"
                  :src="getFullUrl(tab.appIcon, PUBLIC_CDN_URL)"
                  :alt="tab.appName"
                  draggable="false"
                />
              </div>
              <div class="app-details">
                <h3 class="app-name">{{ tab.appName }}</h3>
                <div class="app-meta">
                  <span class="size">{{ tab.appSize }}</span>
                  <span class="category">{{ tab.category }}</span>
                </div>
                <div class="app-stats">
                  <span class="downloads">{{ tab.downloads }}</span>
                  <span class="rating">{{ tab.rating }}</span>
                </div>
              </div>
            </div>

            <!-- 应用截图
            <div class="app-screenshot">
              <img
                v-if="tab.screenshot"
                :src="getFullUrl(tab.screenshot, PUBLIC_CDN_URL)"
                :alt="tab.appName + '截图'"
                draggable="false"
              />
            </div> -->

            <!-- 下载按钮 -->
            <div class="download-actions">
              <button
                v-if="tab.androidDownload"
                class="download-btn android"
                @click="handleDownload(tab.androidDownload, 'android')"
              >
                <img v-if="display" :src="AndroidSvg.src" alt="Android下载" />
                <img v-else :src="AndroidSvg" alt="Android下载" />
                <span>Android下载</span>
              </button>
              <button v-if="tab.iosDownload" class="download-btn ios" @click="handleDownload(tab.iosDownload, 'ios')">
                <img v-if="display" :src="AppleSvg.src" alt="iPhone下载" />
                <img v-else :src="AppleSvg" alt="iPhone下载" />
                <span>iPhone下载</span>
              </button>
              <button v-if="tab.webUrl" class="download-btn web" @click="handleDownload(tab.webUrl, 'web')">
                <img v-if="display" :src="DesktopSvg.src" alt="访问官网" />
                <img v-else :src="DesktopSvg" alt="访问官网" />
                <span>访问官网</span>
              </button>
            </div>

            <!-- 状态指示 -->
            <!-- <div class="status-indicator">
              <span class="status-text">{{ tab.statusText }}</span>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<script setup lang="ts" name="CarouselApp">
import { ref } from 'vue'
import type { IDatas } from './type'
import { PUBLIC_CDN_URL } from '../utils'
import AppleSvg from '../assets/svg/apple-fill.svg'
import AndroidSvg from '../assets/svg/android.svg'
import DesktopSvg from '../assets/svg/desktop.svg'

const display = import.meta.env.PUBLIC_DISPLAY

const getFullUrl = (url: string, baseUrl: string): string => {
  return /^https?:\/\//.test(url) ? url : `${baseUrl}${url}`
}

interface Props {
  datas: IDatas
}

const props = defineProps<Props>()

// 当前激活的tab
const activeTab = ref(0)

// 切换tab
const switchTab = (index: number) => {
  activeTab.value = index
}

// 处理下载点击
const handleDownload = (url: string, type: string) => {
  if (url) {
    window.open(url, '_blank')
  }
}
</script>

<style scoped lang="scss">
.carousel-app {
  position: relative;
}

.carousel-app-container {
  min-height: 20px;
}

.tab-nav {
  display: flex;
  background: #f5f5f5;
  border-bottom: 1px solid #eee;

  .tab-item {
    flex: 1;
    padding: 0 16px;
    text-align: center;
    cursor: pointer;
    font-size: 13px;
    color: #666;
    background: #f5f5f5;
    border-right: 1px solid #eee;
    transition: all 0.3s;
    line-height: 40px;

    &:last-child {
      border-right: none;
    }

    &.active {
      background: red;
      color: #fff;
      font-weight: 600;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    &:hover:not(.active) {
      background: #e8f4f8;
      color: #333;
    }
  }
}

.tab-content {
  .tab-pane {
    display: none;
    // padding: 16px;

    &.active {
      display: block;
    }
  }
}

.promo-banner {
  // background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  // border-radius: 6px;
  padding: 0;
  // margin-bottom: 16px;
  // text-align: center;

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  .banner-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .promo-text {
      color: #fff;
      font-size: 14px;
      font-weight: 500;
    }

    .amount {
      color: #fff;
      font-size: 16px;
      font-weight: bold;
    }
  }
}

.app-card {
  background: #fff;
  // border-radius: 8px;
  // border: 1px solid #e5e5e5;
  // overflow: hidden;
}

.app-info {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;

  .app-icon {
    // width: 60px;
    height: 100%;
    // border-radius: 12px;
    overflow: hidden;
    // margin-right: 16px;
    flex-shrink: 0;
    padding: 10px;
    max-width: 100px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .app-details {
    flex: 1;

    .app-name {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px 0;
    }

    .app-meta {
      display: flex;
      gap: 16px;
      margin-bottom: 8px;

      span {
        font-size: 12px;
        color: #666;
      }
    }

    .app-stats {
      display: flex;
      gap: 16px;

      span {
        font-size: 12px;
        color: #666;
      }
    }
  }
}

.app-screenshot {
  padding: 0 16px;

  img {
    width: 100%;
    height: auto;
    border-radius: 6px;
  }
}

.download-actions {
  display: flex;
  padding: 10px 0;
  gap: 12px;
  // padding: 16px;
  justify-content: center;

  .download-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 10px;
    border: none;
    border-radius: 5px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;

    &.android {
      background: #c34dff;
      color: #fff;

      img {
        width: 20px;
        height: 20px;
      }
    }

    &.ios {
      background: #ff5b5b;
      color: #fff;

      img {
        width: 20px;
        height: 20px;
      }
    }

    &.web {
      background: #3ebc40;
      color: #fff;

      img {
        width: 20px;
        height: 20px;
      }
    }
  }
}

.status-indicator {
  text-align: center;
  padding: 8px 16px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;

  .status-text {
    font-size: 12px;
    color: #28a745;
    font-weight: 500;
  }
}
</style>
