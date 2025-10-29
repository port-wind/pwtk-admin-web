// Simple mock data for advertisement sort list
export const mockAdvertisementSortData = {
  success: true,
  data: {
    advertisementList: [
      {
        id: 'ad_001',
        name: '春季促销活动 - 限时优惠',
        logo: 'https://picsum.photos/400/240?random=1',
        desc: '春季大促销，全场商品8折优惠，仅限本月！',
        startTime: Date.now() - 86400000,
        endTime: Date.now() + 86400000 * 7,
        taskStatus: 2
      },
      {
        id: 'ad_002',
        name: '新用户注册送礼包',
        logo: 'https://picsum.photos/400/240?random=2',
        desc: '新用户注册即送价值200元礼包',
        startTime: Date.now() + 3600000,
        endTime: Date.now() + 86400000 * 14,
        taskStatus: 1
      },
      {
        id: 'ad_003',
        name: 'VIP会员专享福利',
        logo: 'https://picsum.photos/400/240?random=3',
        desc: 'VIP会员享受专属折扣、免费配送等特权',
        startTime: Date.now() - 3600000,
        endTime: Date.now() + 86400000 * 30,
        taskStatus: 2
      },
      {
        id: 'ad_004',
        name: '周末狂欢购物节',
        logo: 'https://picsum.photos/400/240?random=4',
        desc: '周末特惠活动，精选商品低至5折',
        startTime: Date.now() + 86400000,
        endTime: Date.now() + 86400000 * 3,
        taskStatus: 1
      },
      {
        id: 'ad_005',
        name: '品牌联合推广活动',
        logo: 'https://picsum.photos/400/240?random=5',
        desc: '多个知名品牌联合推广，购买指定商品参与抽奖',
        startTime: Date.now() - 7200000,
        endTime: Date.now() + 86400000 * 10,
        taskStatus: 2
      }
    ],
    completeList: [
      {
        id: 'ad_101',
        name: '元旦新年大促销',
        logo: 'https://picsum.photos/400/240?random=101',
        desc: '元旦新年特惠活动，全场商品买二送一',
        startTime: Date.now() - 86400000 * 30,
        endTime: Date.now() - 86400000 * 7,
        taskStatus: 3
      },
      {
        id: 'ad_102',
        name: '黑色星期五特惠',
        logo: 'https://picsum.photos/400/240?random=102',
        desc: '年度最大折扣活动，电子产品全场3折起',
        startTime: Date.now() - 86400000 * 60,
        endTime: Date.now() - 86400000 * 58,
        taskStatus: 3
      },
      {
        id: 'ad_103',
        name: '双十一购物狂欢节',
        logo: 'https://picsum.photos/400/240?random=103',
        desc: '双十一超级购物节，预售商品享受额外优惠',
        startTime: Date.now() - 86400000 * 90,
        endTime: Date.now() - 86400000 * 88,
        taskStatus: 3
      }
    ]
  }
}
