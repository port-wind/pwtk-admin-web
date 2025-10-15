import type { IComponentProperty, ISetStyle } from './index'
import type { NavBarBox } from '../NavBarBox/type'
// 导航菜单组件配置类型

const componentProperties = new Map<String, IComponentProperty<ISetStyle<NavBarBox>>>()

componentProperties.set('NavBarBox', {
  component: 'NavBarBox',
  text: '导航菜单',
  active: false,
  style: 'NavBarBoxStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '导航菜单模块',
    componentType: 'NavBarBox',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      model: 's1',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      activeColor: '#1989fa',
      showLogo: true,
      logoSrc: '',
      menuItems: [
        { text: '首页', url: '/', active: true },
        { text: '产品', url: '/products', active: false },
        { text: '服务', url: '/services', active: false },
        { text: '关于', url: '/about', active: false }
      ],
      layout: 'horizontal',
      sticky: false,
      onTabChange: (tab: any) => {},
      scrollOffset: 0,
      tabsAttr: {
        sticky: false,
        offsetTop: 0,
        animated: false,
        swipeable: false,
        lineWidth: 0,
        lineHeight: 0,
        color: '#007aff'
      },
      itemData: [],
      bgColor: ''
    }
  }
})

export default componentProperties
