<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { inject, reactive } from 'vue'
import FileSaver from 'file-saver'

export interface IProps {}
const props = defineProps<IProps>()

const emits = defineEmits(['onPreview'])

const onPreview = () => {
  emits('onPreview')
}
// 页面数据
const datas = reactive({
  id: null, //当前页面id
  pageSetup: {
    // 页面设置属性
    name: '页面标题', //页面名称
    details: '', //页面描述
    titleHeight: 35, // 高度
    bgColor: 'rgba(249, 249, 249, 10)', //背景颜色
    bgImg: '' // 背景图片
  },
  pageComponents: [] //页面组件
})

const reload = inject<any>('reload')

const reloads = () => {
  ElMessageBox.confirm('重置后您添加或者修改的数据将会失效, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      reload()
    })
    .catch(() => {})
}

// 查看JSON
const catJson = () => {
  ElMessageBox.alert(
    `{
            <br/>
            "id": ${datas.id},
            <br/>
            "name": "${datas.pageSetup.name}",
            <br/>
            "templateJson": '${JSON.stringify(datas.pageSetup)}',
            <br/>
            "component": '${JSON.stringify(datas.pageComponents)}',
            <br/>
          }`,
    '查看JSON',
    {
      confirmButtonText: '确定',
      customClass: 'JSONView',
      dangerouslyUseHTMLString: true,
      callback: () => {}
    }
  )
}

// 导入json
const importJSON = () => {
  try {
    const dom = document.getElementById('file')

    if (dom) {
      const file = dom.files[0]
      const reader = new FileReader()
      reader.readAsText(file)
      let _this = datas
      reader.onload = function () {
        // this.result为读取到的json字符串，需转成json对象
        let ImportJSON = JSON.parse(this.result)
        // 检测是否导入成功
        console.log(ImportJSON, '-----------------导入成功')
        // 导入JSON数据
        _this.id = ImportJSON.id
        _this.pageSetup = JSON.parse(ImportJSON.templateJson)
        _this.pageComponents = JSON.parse(ImportJSON.component)
      }
    }
  } catch (error) {}
}

// 导出json
const exportJSON = () => {
  // 将json转换成字符串
  const data = JSON.stringify({
    id: datas.id,
    name: datas.pageSetup.name,
    templateJson: JSON.stringify(datas.pageSetup),
    component: JSON.stringify(datas.pageComponents)
  })
  const blob = new Blob([data], { type: '' })
  FileSaver.saveAs(blob, `${datas.pageSetup.name}.json`)
}
</script>
<template>
  <section class="buttons">
    <p style="font-size: 12px; color: #4f4f4f; margin-left: 15px; cursor: pointer"></p>
    <div>
      <el-button @click="reloads" type="danger">重置</el-button>
      <el-button @click="onPreview">预览</el-button>
      <el-button @click="catJson">查看JSON</el-button>
      <el-button @click="$refs.file.click()">导入JSON</el-button>
      <el-button @click="exportJSON">导出JSON</el-button>
      <input type="file" ref="file" id="file" accept=".json" @change="importJSON" style="display: none" />
    </div>
  </section>
</template>

<style lang="less" scoped>
/* 按钮集合 */
.buttons {
  height: 8%;
  border-bottom: 1px solid #ebedf0;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding-right: 15px;
  align-items: center;
  /* 下拉 */
  .frop {
    padding-right: 15px;
    .el-button.el-button--primary.el-dropdown-selfdefine {
      background: #fff;
      color: #000;
      border: 1px solid #dcdee0;
    }
  }
  .el-button {
    font-size: 14px;
    padding: 0 16px;
    height: 30px;
    &.el-button--primary {
      background: #155bd4;
    }
    &.el-button--danger {
      background: red;
    }
  }
}
</style>
