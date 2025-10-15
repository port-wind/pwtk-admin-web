import type { CommoditySearchConfig } from '../CommoditySearch/type'
import type { IComponentProperty, ISetStyle } from './index'

// 商品搜索组件配置类型
export interface CommoditySearchConfigType {
  text: string
  heights: number // 搜索栏高度
  position: number // 显示位置
  sweep: boolean // 显示扫一扫
  borderRadius: number // 框体样式
  textPosition: number // 文本位置
  backgroundColor: string // 背景颜色
  borderColor: string // 框体颜色
  textColor: string // 字体颜色
  hotords: any[] // 热词
  conf: {
    text: string
    heights: number
    position: number
  }
}

const componentProperties = new Map<string, IComponentProperty<ISetStyle<CommoditySearchConfig>>>()
// 预设值
componentProperties.set('CommoditySearch', {
  component: 'CommoditySearch',
  text: '商品搜索',
  active: false,
  style: 'CommoditySearchStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '商品搜索',
    componentType: 'CommoditySearch',
    componentSort: '',
    status: 'y',
    isView: 'y',
    memo: '商品搜索组件',
    pageCode: '',
    configParamJson: {
      text: '商品搜索',
      title: '',
      subtitle: '',
      enable: true,
      heights: 40,
      position: 0,
      sweep: true,
      borderRadius: 8,
      textPosition: 0,
      backgroundColor: '#f8f9fa',
      borderColor: '#ffffff',
      textColor: '#666666',
      hotwords: [
        {
          id: 'hot1',
          text: '热销商品',
          enabled: true,
          order: 1
        },
        {
          id: 'hot2',
          text: '新品上市',
          enabled: true,
          order: 2
        },
        {
          id: 'hot3',
          text: '限时优惠',
          enabled: true,
          order: 3
        }
      ],
      searchStyle: {
        showIcon: true,
        iconColor: '#999999',
        placeholder: '搜索商品',
        placeholderColor: '#999999',
        inputBackground: '#ffffff',
        inputBorderColor: '#e0e0e0',
        inputBorderWidth: 1,
        inputHeight: 40,
        inputPadding: 12,
        showScanButton: false,
        scanButtonText: '扫一扫',
        scanButtonColor: '#666666'
      },
      styleHeader: {
        backgroundColor: '#4a90e2',
        isGradient: true,
        headerBgColor: '#4a90e2',
        headerBg: '#4a90e2',
        headerBg2: '#66bb6a',
        subTitleColor: '#ffffff',
        titleColor: '#ffffff'
      },
      styleMain: {
        containerPadding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        margin: 5,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }
    }
  }
})

export default componentProperties
