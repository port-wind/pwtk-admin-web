<template>
  <div class="footer-bar-box">
    <div class="footer-container">
      <div v-if="datas.configParamJson?.showLogo" class="footer-logo">
        <img :src="datas.configParamJson?.logoUrl || defaultLogo" alt="Logo" draggable="false" />
      </div>

      <div class="footer-content">
        <div v-if="datas.configParamJson?.showLinks" class="footer-links">
          <div v-for="(link, index) in footerLinks" :key="index" class="footer-link">
            {{ link.text }}
          </div>
        </div>

        <div v-if="datas.configParamJson?.showCopyright" class="footer-copyright">
          {{ datas.configParamJson?.copyrightText || defaultCopyright }}
        </div>

        <div v-if="datas.configParamJson?.showContact" class="footer-contact">
          <div class="contact-item">
            <span class="contact-label">客服热线：</span>
            <span class="contact-value">{{ datas.configParamJson?.phone || '400-000-0000' }}</span>
          </div>
          <div class="contact-item">
            <span class="contact-label">邮箱：</span>
            <span class="contact-value">{{ datas.configParamJson?.email || 'service@example.com' }}</span>
          </div>
        </div>
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  datas: {
    componentName: string
    componentType: string
    configParamJson: {
      model?: string
      showLogo?: boolean
      logoUrl?: string
      showLinks?: boolean
      showCopyright?: boolean
      copyrightText?: string
      showContact?: boolean
      phone?: string
      email?: string
      links?: Array<{ text: string; url: string }>
    }
  }
  pageModel?: 'websiteMode' | 'templateMode' | 'componentMode'
}

const props = withDefaults(defineProps<Props>(), {
  pageModel: 'websiteMode'
})

// const defaultLogo = '../../../assets/images/imgs.png'
const defaultCopyright = '© 2024 WebVision. All rights reserved.'

const footerLinks = computed(() => {
  return (
    props.datas.configParamJson?.links || [
      { text: '关于我们', url: '/about' },
      { text: '服务条款', url: '/terms' },
      { text: '隐私政策', url: '/privacy' },
      { text: '联系我们', url: '/contact' }
    ]
  )
})
</script>

<style lang="scss" scoped>
.footer-bar-box {
  position: relative;
  background: #2c3e50;
  color: #ecf0f1;
  padding: 24px 16px;

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;

    .footer-logo {
      text-align: center;
      margin-bottom: 20px;

      img {
        height: 40px;
        width: auto;
      }
    }

    .footer-content {
      .footer-links {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 24px;
        margin-bottom: 16px;

        .footer-link {
          font-size: 14px;
          color: #bdc3c7;
          cursor: pointer;
          transition: color 0.2s;

          &:hover {
            color: #3498db;
          }
        }
      }

      .footer-copyright {
        text-align: center;
        font-size: 12px;
        color: #95a5a6;
        margin-bottom: 16px;
        padding-top: 16px;
        border-top: 1px solid #34495e;
      }

      .footer-contact {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 24px;

        .contact-item {
          font-size: 12px;
          color: #bdc3c7;

          .contact-label {
            color: #95a5a6;
          }

          .contact-value {
            color: #ecf0f1;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .footer-bar-box {
    .footer-container {
      .footer-content {
        .footer-links {
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .footer-contact {
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
      }
    }
  }
}
</style>
