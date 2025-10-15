<script setup lang="ts">
import * as echarts from 'echarts'
import { EChartsOption } from 'echarts'
import { ref, onMounted } from 'vue'
import { reqExpertStatistics } from '@/api/user/index'
import type { IReqExpertStatisticsData, IReqExpertStatisticsQueryParams } from '@/api/user/type'
import { useSixKingListPageStore } from '@/views/ExpertManagement/sixKingList/store/sixKing'

const sixKingListPage = useSixKingListPageStore()
const tableData = ref<IReqExpertStatisticsData>()
const isLoading = ref(false)
const barRef = ref()
const mycharts = ref<echarts.ECharts>()

// Methods
const fetchData = async () => {
  isLoading.value = true
  try {
    const query = {
      ...sixKingListPage.queryForm
    }

    // gameType:"2032"
    // issue:"2025055"
    // playTypeCode:"0106"
    delete query.nickname
    delete query.userId
    delete query.startIssue
    delete query.endIssue
    delete query.current
    delete query.page
    delete query.size
    delete query.loginOrUserId
    delete query.sortName
    delete query.sortOrder

    const response = await reqExpertStatistics(query)
    if (response.success) {
      tableData.value = response.data
      loadEchart()
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

//echarts.init(容器DOM节点)
const loadEchart = () => {
  //初始化echarts类的实例

  // 数据转换
  const seriesData = tableData.value?.list.map((item) => ({
    name: item.value,
    value: parseInt(item.userCount, 10),
    itemStyle: {
      color: item.isHit === 'y' ? 'rgb(245, 190, 82)' : 'rgb(221, 239, 228)' // 高亮颜色
    }
  }))

  const options: EChartsOption = {
    title: {
      text: `${tableData.value?.periodName}（总人数：${tableData.value?.totalUserCount}）`,
      left: 'center'
    },
    xAxis: {
      type: 'category',
      data: tableData.value?.list.map((item) => item.value),
      axisLabel: {
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} 人'
      },
      minInterval: 1
    },
    series: [
      {
        data: seriesData,
        type: 'bar',
        barWidth: 40,
        label: {
          show: true,
          position: 'top',
          // formatter: '{@[0]}人',
          fontSize: 12,
          formatter: (params: { data }) => `${params.data.value}人`
        }
      }
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const { data } = params[0]
        return `${data.name}<br/>${data.value} 人`
      }
    }
  }

  //设置配置项
  mycharts.value?.setOption(options)
}

onMounted(() => {
  mycharts.value = echarts.init(barRef.value)
  //监听浏览器窗口的变化
  window.addEventListener('resize', () => {
    //调用echarts实例的resize方法达到自适应
    mycharts.value?.resize()
  })
})

onMounted(() => {
  fetchData()
})
</script>

<template>
  <section class="wrapper">
    <section>
      <QueryForm current-tabs="expert" @onSubmit="() => fetchData()" @onReset="() => fetchData()" />
    </section>
    <section class="custom-table">
      <div class="chart-bar" ref="barRef"></div>
    </section>
  </section>
</template>

<style lang="less" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}
.main_flex_table {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}

.chart-bar {
  min-height: 487px;
  height: 80%;
  min-width: 650px;
  width: 80%;
}
</style>
