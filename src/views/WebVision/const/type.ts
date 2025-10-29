/**
 * 1. 系统组件数据
 */
export interface SetStyleSystemComponentData {
  /**
   * 系统表中的组件ID
   */
  componentId: string
  /**
   * 对应组件模块名称，
   * src/views/WebVision/components/componentsbiz/postdetailsbox
   */
  componentType: string
  /***
   * 组件描述名称，只用做描述和显示
   */
  componentName: string
  /**
   * 组件变量都存在着里
   */
  configParamJson?: string
  /**
   * 页面代码， 主要是表示该组件，在某个页面显示。 比如说：设置about 那么该组件在path about 页面才显示
   * 暂时这样设计 2025/04/027
   */
  pageCode?: string
  /**
   * 草图代码
   */
  sketchCodeList?: string
  /**
   * 组件排序。目前没有使用
   */
  componentSort?: string
  /**
   * 状态
   */
  status?: string
  /**
   * 可见
   */
  isView?: string
  /**
   * 备注
   */
  memo?: string
  [key: string]: any
}

/**
 * 2. 模版组件数据
 */
export interface SetStyleTemplateComponentData {
  /**
   * 系统模版表中的组件ID，它跟系统表中componentId 没有关系
   */
  componentId: string
  /**
   * template表中的组件。通过这个templateId 来查询哪些配置的组件
   */
  templateId: string
  /**
   * 对应组件模块名称，
   * src/views/WebVision/components/componentsbiz/postdetailsbox
   */
  componentType: string
  /***
   * 组件描述名称，只用做描述和显示
   */
  componentName: string
  /**
   * 组件排序。目前没有使用
   */
  componentSort?: string
  /**
   * 某个模版中排序的位置
   */
  pageRenderingSeq?: number
  /**
   * 组件变量都存在着里
   */
  configParamJson?: string
  /**
   * 页面代码， 主要是表示该组件，在某个页面显示。 比如说：设置about 那么该组件在path about 页面才显示
   * 暂时这样设计 2025/04/027
   */
  pageCode?: string
  /**
   * 状态
   */
  status?: 'y' | 'n'
  /**
   * 可见
   */
  isView?: 'y' | 'n'
  /**
   * 备注
   */
  memo?: string
  [key: string]: any
}

/**
 * 3. 站点组件数据
 */
export interface ISetStyleWebsiteComponentData {
  /**
   * website表中的组件。通过这个websiteId 来查询哪些配置的组件，和关联模版
   */
  websiteId: string
  /**
   * 系统模版表中的组件ID，它跟系统表中componentId 没有关系
   */
  componentId: string
  /***
   * 组件描述名称，只用做描述和显示
   */
  componentName: string
  /***
   * 组件描述名称，只用做描述和显示
   */
  componentType?: string
  /**
   * 关联
   */
  componentRef?: string
  /**
   * 排序
   */
  pageRenderingSeq?: number
  /**
   * 组件变量都存在着里
   */
  configParamJson?: string
  /**
   * 页面代码， 主要是表示该组件，在某个页面显示。 比如说：设置about 那么该组件在path about 页面才显示
   * 暂时这样设计 2025/04/027
   */
  pageCode?: string
  /**
   * 状态
   */
  status?: 'y' | 'n'
  /**
   * 可见
   */
  isView?: 'y' | 'n'
  /**
   * 备注
   */
  memo?: string
  [key: string]: any
}
