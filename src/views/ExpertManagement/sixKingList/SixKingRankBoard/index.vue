<template>
  <div class="rank-wrapper">
    <el-row class="rank-row">
      <el-col :span="6" class="column-wrapper" :key="index" v-for="(item, index) in trophyData">
        <div @click="selectTab(item)" :class="['column', { active: item.selected }]">
          <div class="icon">
            <img :src="getImageUrl(item.imageName)" style="width: 96px" :alt="item.imageName" />
          </div>
          <div class="info">
            <p class="nickname">{{ item.nickname }}</p>
            <p class="desc">当前心水数量</p>
            <p class="score">
              {{ item.score }}
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { reqPlatformSwitchInfo } from '@/api/user'
import { IReqPlatformSwitchInfoQueryParams } from '@/api/user/type'
import { useSixKingListPageStore } from '@/views/ExpertManagement/sixKingList/store/sixKing'

// interface IProps {
//   modelValue: string
// }
// const props = defineProps<IProps>()
const sixKingList = useSixKingListPageStore()

// const emit = defineEmits(['update:modelValue'])

const selectTab = (tab: TrophyItem) => {
  sixKingList.changeTab(tab.field)
  // emit('update:modelValue', tab.field) // 通知父组件更新值
  trophyData.value = trophyData.value.map((item) => ({
    ...item,
    selected: item.field === tab.field // 点击的那个 tab 设置为 true，其余为 false
  }))
}

interface TrophyItem {
  loginId?: string
  nickname?: string
  score?: number
  imageName?: string
  field: string
  selected: boolean
}
const trophyData = ref<TrophyItem[]>([
  {
    imageName: 'sixking01.png',
    field: 'sixking',
    nickname: '六合王',
    score: 0,
    selected: true
  },
  {
    imageName: 'sixking02.png',
    field: 'winning_streak_rank',
    nickname: '连胜榜',
    score: 0,
    selected: false
  },
  {
    imageName: 'sixking03.png',
    field: 'history_champion',
    nickname: '历史冠军',
    score: 0,
    selected: false
  },
  {
    imageName: 'sixking04.png',
    field: 'expert_statistics',
    nickname: '专家统计',
    score: 0,
    selected: false
  }
])
const isLoading = ref(false)
const fetchData = async (gameType) => {
  isLoading.value = true
  if (gameType) {
    try {
      const query: IReqPlatformSwitchInfoQueryParams = {
        gameType: gameType
      }
      const res = await reqPlatformSwitchInfo(query)
      if (res.success) {
        trophyData.value[0].score = res.data?.sixKingCount
        trophyData.value[1].score = res.data?.winnStreakRankingCount
        trophyData.value[2].score = res.data?.pastChampionsCount
        trophyData.value[3].score = res.data?.expertStatisticsCount
      }
    } catch (error) {
      console.error(error)
    }
  }
}

const getImageUrl = (name?: string) => {
  if (!name) return ''
  return new URL(`/src/assets/images/${name}`, import.meta.url).href
}

watch(
  () => sixKingList.queryForm.gameType,
  (newVal) => {
    fetchData(newVal)
  },
  { immediate: true }
)
</script>

<style scoped lang="less">
.rank-wrapper {
  // background: #f5f7fa;
  border-radius: 10px;
  //   overflow-x: auto;
  .rank-row {
    min-width: 840px;
  }

  &::-webkit-scrollbar {
    visibility: hidden;
  }
  &:hover {
    &::-webkit-scrollbar {
      visibility: visible;
    }
  }
}

.column-wrapper {
  justify-items: center;
  .column {
    display: flex;
    cursor: pointer;
    padding: 6px;
    column-gap: 10px;
    border-radius: 10px;
    &:hover {
      background-color: hsl(216, 33%, 87%);
    }
    &.active {
      background-color: hsl(216, 33%, 87%);
    }
    .icon {
      img {
      }
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 16px;
      .desc {
      }

      .nickname {
      }

      .score {
        text-align: left;
        font-size: 18px;
        display: flex;
        justify-content: left;
        color: #0000ee;
        text-indent: 20px;
      }
    }
  }
}
</style>
