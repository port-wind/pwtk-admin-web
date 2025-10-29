// 组件属性配置主入口文件 - 替代原 componentProperties.ts
// 接口定义 - 从原 componentProperties.ts 迁移
export interface IComponentProperty<T> {
  component: string // component 中间组件名称
  text: string // pageBuilder 显示名称
  active: boolean // 是否可编辑/激活
  style: string // 右边该组件的控制台组件
  setStyle: T // 右边栏其他信息
}

export interface ISetStyle<V> {
  // 表数据
  componentId: string // component, template, website
  sketchCodeList: string // component - 修正为支持数组
  templateId: string // template
  pageRenderingSeq: number // template, website
  websiteId: string // website
  componentRef: string // website
  componentName: string
  componentType: string
  componentSort: string
  status: string
  isView: string
  memo: string
  pageCode: string
  configParamJson: V
  // 允许额外的属性
  [key: string]: any
}

// 导入分组件属性配置
import AdBarProperties from './AdBar'
import CustomBarAdBoxProperties from './CustomBarAdBox'
import CaptionTextProperties from './CaptionText'
import ListswitchingProperties from './Listswitching'
import TabbarProperties from './tabbar'
import GraphicnavigationProperties from './graphicnavigation'
import RichtextProperties from './richtext'
import MagiccubeProperties from './magiccube'
import VideossProperties from './videoss'
import CustommoduleProperties from './custommodule'
import CustomBoxProperties from './CustomBox'
import SwipeBoxProperties from './SwipeBox'
import AuxiliarysegmentationProperties from './auxiliarysegmentation'
import CommoditySearchProperties from './CommoditySearch'
import StoreinformationProperties from './storeinformation'
import EntertheshopProperties from './entertheshop'
import GameResultBoxProperties from './GameResultBox'
import HeaderBarBoxProperties from './HeaderBarBox'
import WebAdBoxProperties from './WebAdBox'
import NavBBSListBoxProperties from './NavBBSListBox'
import WebAdMoreBoxProperties from './WebAdMoreBox'
import InvestigateProperties from './Investigate'
import FollowProperties from './follow'
import FooterBarBoxProperties from './FooterBarBox'
import NavBarBoxProperties from './NavBarBox'
import PostDetailsBoxProperties from './PostDetailsBox'
import SuspensionProperties from './suspension'
import HomePopNoticeBoxProperties from './HomePopNoticeBox'
import NoticeBarBoxProperties from './NoticeBarBox'
import CommunitypowderProperties from './communitypowder'
import StorenotecardProperties from './Storenotecard'
import CrowdoperationProperties from './crowdoperation'
import PersonalizedrecommendationProperties from './personalizedrecommendation'
import OnlineserviceProperties from './onlineservice'
import TopNavBarProperties from './TopNavBar'
import ImageCardProperties from './ImageCard'
import LotteryResultProperties from './LotteryResult'
import InfoboxProperties from './Infobox'
import LotteryRiddleSolutionProperties from './LotteryRiddleSolution'
import CarouselAppProperties from './CarouselApp'
import ImageGridListProperties from './ImageGridList'
import componentProperties from './NewsPaperCategoryList'
import TextLinkIssueListProperties from './TextLinkIssueList'
import TextLinkListProperties from './TextLinkList'
import IssueListProperties from './IssueList'
import Issue24Properties from './Issue24'
import BlankAreaProperties from './BlankArea'
import EmptyCardProperties from './EmptyCard'
import MyTestComponentProperties from './MyTestComponent'
import Test2ComProperties from './Test2Com'
import AggregationGameplayProperties from './AggregationGameplay'
import HotRecommendationsProperties from './HotRecommendations'
import ImageGameTypeCardsProperties from './ImageGameTypeCards'
import ImageForGameTypeProperties from './ImageForGameType'
import SixZodiacSixCodeProperties from './SixZodiacSixCode'
import Zodiac12WuxingPageProperties from './Zodiac12WuxingPage'
import HighLightTextProperties from './HighLightText'
import TwoGameResultProperties from './TwoGameResult'
import FixedButtonGroupRBProperties from './FixedButtonGroupRB'
import IssueCatalogProperties from './IssueCatalog'
import IssueLineProperties from './IssueLine'
import VideoWithGameTypeProperties from './VideoWithGameType'

// 合并所有组件配置
const allComponentProperties = new Map()

// 合并分组件配置
AdBarProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

TopNavBarProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

CustomBarAdBoxProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

CaptionTextProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

ListswitchingProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

TabbarProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

GraphicnavigationProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

RichtextProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

MagiccubeProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

VideossProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

CustommoduleProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

CustomBoxProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

SwipeBoxProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

AuxiliarysegmentationProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

CommoditySearchProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

StoreinformationProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

EntertheshopProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

GameResultBoxProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

HeaderBarBoxProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

WebAdBoxProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

NavBBSListBoxProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

WebAdMoreBoxProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

InvestigateProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

FollowProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

FooterBarBoxProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

NavBarBoxProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

PostDetailsBoxProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

SuspensionProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

HomePopNoticeBoxProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

NoticeBarBoxProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

CommunitypowderProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

StorenotecardProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

CrowdoperationProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

PersonalizedrecommendationProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

OnlineserviceProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

ImageCardProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

LotteryResultProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

InfoboxProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

LotteryRiddleSolutionProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

CarouselAppProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

ImageGridListProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

componentProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

HeaderBarBoxProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

TextLinkIssueListProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

TextLinkListProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

IssueListProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

Issue24Properties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

SixZodiacSixCodeProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

BlankAreaProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

EmptyCardProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

MyTestComponentProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

Test2ComProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

AggregationGameplayProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

HotRecommendationsProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

ImageGameTypeCardsProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

ImageForGameTypeProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

Zodiac12WuxingPageProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

HighLightTextProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

TwoGameResultProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

FixedButtonGroupRBProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

IssueCatalogProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

IssueLineProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

VideoWithGameTypeProperties.forEach((value, key) => {
  allComponentProperties.set(key, value)
})

export default allComponentProperties
