import type { VideoWithGameTypeConfig } from '../VideoWithGameType/type'
import type { IComponentProperty, ISetStyle } from './index'

const componentProperties = new Map<string, IComponentProperty<ISetStyle<VideoWithGameTypeConfig>>>()

// 预设值
componentProperties.set('VideoWithGameType', {
  component: 'VideoWithGameType',
  text: '游戏视频播放器',
  active: false,
  style: 'VideoWithGameTypeStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '游戏视频播放器',
    componentType: 'VideoWithGameType',
    componentSort: '',
    status: 'y',
    isView: 'y',
    memo: '支持游戏类型切换的视频播放组件',
    pageCode: '',
    configParamJson: {
      text: '视频播放器',
      title: '视频',
      subtitle: '精选视频内容',
      enable: true,
      heights: 60,
      videoHeightPercent: 75,
      minHeight: 200,
      position: 0,
      textPosition: 1,
      backgroundColor: '#ffffff',
      borderColor: '#e0e0e0',
      textColor: '#333333',
      gameType: '',
      defaultGameName: '未知游戏',
      size: 10,
      forumId: '10',
      videos: [
        {
          id: 'video1',
          title: '视频',
          imageUrl: '',
          videoUrl: '',
          enabled: true,
          order: 1
        },
        {
          id: 'video2',
          title: '视频',
          imageUrl: '',
          videoUrl: '',
          enabled: true,
          order: 2
        },
        {
          id: 'video3',
          title: '视频',
          imageUrl: '',
          videoUrl: '',
          enabled: true,
          order: 3
        }
      ],
      templateObj: {
        videos: [
          {
            id: 'video1',
            title: '视频',
            imageUrl: '',
            videoUrl: '',
            enabled: true,
            order: 1
          },
          {
            id: 'video2',
            title: '视频',
            imageUrl: '',
            videoUrl: '',
            enabled: true,
            order: 2
          },
          {
            id: 'video3',
            title: '视频',
            imageUrl: '',
            videoUrl: '',
            enabled: true,
            order: 3
          }
        ]
      },
      styleHeader: {
        backgroundColor: '#4a90e2',
        isGradient: true,
        headerBgColor: '#4a90e2',
        headerBg: '#4a90e2',
        headerBg2: '#66bb6a',
        subTitleColor: '#ffffff',
        titleColor: '#ffffff',
        titleSize: 18,
        titleWeight: 'bold',
        subTitleSize: 14
      },
      styleMain: {
        containerPadding: 0,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        margin: 5,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        textColor: '#ffffff',
        fontSize: 14,
        fontWeight: 400,
        textAlign: 'center' as 'left' | 'center' | 'right',
        lineHeight: '1.5'
      },
      selectedGameTypes: []
    }
  }
})

export default componentProperties
