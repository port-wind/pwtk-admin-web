<template>
  <div class="trophy-list">
    <div v-for="(item, index) in trophyData" :key="index" class="trophy-card">
      <div class="trophy-icon">
        <img style="width: 80px" :src="getImageUrl(item.imageName)" :alt="item.imageName" />
        <div class="title">{{ item.title }}</div>
      </div>
      <div class="content">
        <div class="sub-title">当前榜一</div>
        <div class="user-info">
          <span class="username">{{ truncateText(item.loginId!) }}</span>
          <span class="separator">|</span>
          <span class="nickname">{{ truncateText(item.nickname!) }}</span>
        </div>
        <el-statistic
          :value="item.score"
          :value-style="{ color: getTextColor(index), fontSize: '24px', fontWeight: 'bold' }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getWinner } from '@/api/user/leader'
import { ref } from 'vue'
import { truncateText } from '@/utils/dataFormat'

interface TrophyItem {
  loginId?: string
  nickname?: string
  score?: number
  imageName?: string
  field: string
  title: string
}
const trophyData = ref<TrophyItem[]>([
  {
    imageName: 'heart.svg',
    field: 'heatWinner',
    title: '人气榜'
  },
  {
    imageName: 'star.svg',
    field: 'fansWinner',
    title: '积分榜'
  },
  {
    imageName: 'plane.svg',
    field: 'scoreWinner',
    title: '粉丝榜'
  }
])
const fetchData = async () => {
  try {
    const res = (await getWinner()) as any
    console.log('res', res)
    if (res.success) {
      trophyData.value = trophyData.value.map((item) => {
        const info = res.data[item.field]
        return {
          ...item,
          ...info,
          score: Number(info.value) || 0
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}
onMounted(async () => {
  await fetchData()
})
const getImageUrl = (name?: string) => {
  if (!name) return ''
  return new URL(`/src/assets/images/leader/${name}`, import.meta.url).href
}

const getTextColor = (index: number): string => {
  const colors = ['#ff7f7f', '#ff69b4', '#9370db']
  return colors[index] || colors[0]
}
</script>

<style scoped lang="less">
.trophy-list {
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;
  background: #f5f7fa;
  border-radius: 8px;
  padding: 10px;
  justify-content: space-around;
}

.trophy-card {
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 20px;
  .trophy-icon {
    width: 85px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    row-gap: 5px;
    align-self: flex-start;

    .sub-title {
      font-size: 18px;
    }

    .user-info {
      // margin-bottom: 4px;
      font-size: 14px;

      .separator {
        margin: 0 8px;
        color: #999;
      }

      .nickname {
        color: #666;
      }
    }

    :deep(.el-statistic) {
      .el-statistic__content {
        font-size: 24px;
        font-weight: bold;
      }
    }
  }
}
</style>
