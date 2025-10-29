// src/stores/counter.js
import { atom } from 'nanostores'

interface IComponentMap {
  [componentName: string]: {
    [subCategory: string]: {
      [key: string]: any
    }
  }
}

interface MergeTag {
  title?: string
  value?: string
  menu?: MergeTag[]
}

interface IEditorStore {
  listKeys: any[]
  componentMap: IComponentMap
  customMergeTags: MergeTag[]
}

export const editorStore = atom<IEditorStore>({
  listKeys: [1, 2, 3, 4],
  componentMap: {},
  customMergeTags: []
})

export function setListKeys(listKeys: any[]) {
  editorStore.set({
    ...editorStore.get(),
    listKeys: listKeys
  })
}

export function clearListKeys() {
  editorStore.set({
    ...editorStore.get(),
    listKeys: []
  })
}

export function getListKeys() {
  return editorStore.get().listKeys
}

export function setComponentMapValue(componentName: string, subCategory: string, key: string, value: any) {
  const currentStore = editorStore.get()
  const currentComponentMap = currentStore.componentMap || {}

  editorStore.set({
    ...currentStore,
    componentMap: {
      ...currentComponentMap,
      [componentName]: {
        ...(currentComponentMap[componentName] || {}),
        [subCategory]: {
          ...((currentComponentMap[componentName] || {})[subCategory] || {}),
          [key]: value
        }
      }
    }
  })
}

export function getComponentMapValue(componentName: string, subCategory: string, key: string) {
  const store = editorStore.get()
  return store.componentMap?.[componentName]?.[subCategory]?.[key]
}

export function clearComponentMap() {
  const currentStore = editorStore.get()
  editorStore.set({
    ...currentStore,
    componentMap: {}
  })
}

// 获取整个组件的数据
export function getComponentData(componentName: string) {
  const store = editorStore.get()
  return store.componentMap?.[componentName] || {}
}

// 获取组件下某个子分类的所有数据
export function getComponentSubCategoryData(componentName: string, subCategory: string) {
  const store = editorStore.get()
  return store.componentMap?.[componentName]?.[subCategory] || {}
}

// 设置整个子分类的数据
export function setComponentSubCategoryData(componentName: string, subCategory: string, data: { [key: string]: any }) {
  const currentStore = editorStore.get()
  const currentComponentMap = currentStore.componentMap || {}

  editorStore.set({
    ...currentStore,
    componentMap: {
      ...currentComponentMap,
      [componentName]: {
        ...(currentComponentMap[componentName] || {}),
        [subCategory]: data
      }
    }
  })
}

// 删除组件下的某个子分类
export function removeComponentSubCategory(componentName: string, subCategory: string) {
  const currentStore = editorStore.get()
  const currentComponentMap = currentStore.componentMap || {}

  if (currentComponentMap[componentName]) {
    const { [subCategory]: removed, ...rest } = currentComponentMap[componentName]

    editorStore.set({
      ...currentStore,
      componentMap: {
        ...currentComponentMap,
        [componentName]: rest
      }
    })
  }
}

// 删除组件下某个子分类的特定键
export function removeComponentMapValue(componentName: string, subCategory: string, key: string) {
  const currentStore = editorStore.get()
  const currentComponentMap = currentStore.componentMap || {}

  if (currentComponentMap[componentName]?.[subCategory]) {
    const { [key]: removed, ...rest } = currentComponentMap[componentName][subCategory]

    editorStore.set({
      ...currentStore,
      componentMap: {
        ...currentComponentMap,
        [componentName]: {
          ...currentComponentMap[componentName],
          [subCategory]: rest
        }
      }
    })
  }
}

// ==================== customMergeTags 相关方法 ====================

// 设置合并标签列表
export function setCustomMergeTags(tags: MergeTag[]) {
  editorStore.set({
    ...editorStore.get(),
    customMergeTags: tags
  })
}

// 获取合并标签列表
export function getCustomMergeTags(): MergeTag[] {
  const componentMap = editorStore.get().componentMap
  const tags = []
  Object.keys(componentMap).forEach((componentName) => {
    const subCategories = componentMap[componentName]

    for (let subCategory in subCategories) {
      const kv = subCategories[subCategory]
      const obj = {
        title: subCategory,
        menu: []
      }
      for (let key in kv) {
        if (kv.hasOwnProperty(key)) {
          //@ts-ignore
          obj.menu.push({
            title: kv[key],
            value: key
          })
        }
      }
      //@ts-ignore
      tags.push(obj)
    }

    // Object.keys(subCategories).forEach((subCategory) => {
    //   const kv = subCategories[subCategory]
    //   const obj = {
    //     title: subCategory,
    //     menu: []
    //   }
    // })
  })
  return tags
}

// 添加单个合并标签（到根级别）
export function addCustomMergeTag(tag: MergeTag) {
  const currentStore = editorStore.get()
  const tags = [...(currentStore.customMergeTags || []), tag]
  editorStore.set({
    ...currentStore,
    customMergeTags: tags
  })
}

// 添加合并标签到指定分类
export function addMergeTagToCategory(categoryTitle: string, tag: MergeTag) {
  const currentStore = editorStore.get()
  const tags = [...(currentStore.customMergeTags || [])]

  // 查找指定分类
  const category = tags.find((t) => t.title === categoryTitle)

  if (category) {
    // 如果分类存在，添加到其 menu 中
    if (!category.menu) {
      category.menu = []
    }
    category.menu.push(tag)
  } else {
    // 如果分类不存在，创建新分类
    tags.push({
      title: categoryTitle,
      menu: [tag]
    })
  }

  editorStore.set({
    ...currentStore,
    customMergeTags: tags
  })
}

// 删除合并标签（支持删除根级别和分类内的标签）
export function removeMergeTag(value: string) {
  const currentStore = editorStore.get()
  const tags = [...(currentStore.customMergeTags || [])]

  // 递归删除函数
  const removeFromArray = (arr: MergeTag[]): MergeTag[] => {
    return arr.filter((tag) => {
      if (tag.value === value) {
        return false
      }
      if (tag.menu) {
        tag.menu = removeFromArray(tag.menu)
      }
      return true
    })
  }

  const updatedTags = removeFromArray(tags)

  editorStore.set({
    ...currentStore,
    customMergeTags: updatedTags
  })
}

// 清空所有合并标签
export function clearCustomMergeTags() {
  editorStore.set({
    ...editorStore.get(),
    customMergeTags: []
  })
}

// 从预设模板加载
export function loadMergeTagsTemplate(templateName: string) {
  const templates: Record<string, MergeTag[]> = {
    default: [
      {
        title: '用户信息',
        menu: [
          { value: 'User.Name', title: '用户名' },
          { value: 'User.Email', title: '邮箱' },
          { value: 'User.Phone', title: '电话' }
        ]
      },
      {
        title: '订单信息',
        menu: [
          { value: 'Order.Number', title: '订单号' },
          { value: 'Order.Date', title: '订单日期' },
          { value: 'Order.Total', title: '订单金额' }
        ]
      },
      {
        value: 'CurrentDate',
        title: '当前日期'
      },
      {
        value: 'CompanyName',
        title: '公司名称'
      }
    ],
    email: [
      {
        title: '收件人',
        menu: [
          { value: 'Recipient.Name', title: '收件人姓名' },
          { value: 'Recipient.Email', title: '收件人邮箱' },
          { value: 'Recipient.Title', title: '收件人职位' }
        ]
      },
      {
        title: '发件人',
        menu: [
          { value: 'Sender.Name', title: '发件人姓名' },
          { value: 'Sender.Email', title: '发件人邮箱' },
          { value: 'Sender.Signature', title: '发件人签名' }
        ]
      }
    ]
  }

  const template = templates[templateName]
  if (template) {
    setCustomMergeTags(template)
  }
}

// 导出 MergeTag 类型供其他文件使用
export type { MergeTag }
