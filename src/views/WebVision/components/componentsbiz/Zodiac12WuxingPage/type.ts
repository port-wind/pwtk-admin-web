import type { ISetStyle } from '../componentProperties/index'

export interface IStyleMain {
  padding: number
  borderRadius: number
  backgroundColor: string
  textAlign: 'left' | 'center' | 'right'
  fontSize: number
  fontWeight: number
  textColor: string
}

export interface IStyleHeader {
  backgroundColor: string
  isGradient: boolean
  headerBgColor: string
  headerBg: string
  headerBg2: string
  subTitleColor: string
  titleColor: string
}

export interface IZodiacCardStyle {
  backgroundColor: string
  borderRadius: number
  borderColor: string
  borderWidth: number
  padding: number
  shadowColor: string
  shadowBlur: number
  hoverShadowBlur: number
  hoverTransform: string
}

export interface IZodiacImageStyle {
  width: number
  height: number
  borderRadius: number
  backgroundColor: string
  borderColor: string
  borderWidth: number
  marginBottom: number
}

export interface IZodiacNameStyle {
  fontSize: number
  fontWeight: number
  color: string
  marginBottom: number
  textAlign: 'left' | 'center' | 'right'
}

export interface INumberButtonStyle {
  width: number
  height: number
  borderRadius: number
  fontSize: number
  fontWeight: number
  gap: number
  shadowBlur: number
  hoverScale: number
  transition: string
}

export interface IGridLayoutStyle {
  columns: number
  gap: number
  padding: number
  backgroundColor: string
}

export interface IZodiacLayoutStyle {
  imagePosition: 'left' | 'center' | 'right'
}

export interface IResponsiveBreakpoints {
  tablet: number
  mobile: number
}

// 五行属性样式接口
export interface IWuxingAreaStyle {
  backgroundColor: string
  borderRadius: number
  padding: number
  marginTop: number
}

export interface IWuxingGridStyle {
  columns?: number
  gap: number
  padding?: number
}

export interface IWuxingCardStyle {
  backgroundColor: string
  borderRadius: number
  padding: number
  shadowColor?: string
  shadowBlur?: number
  hoverShadowBlur?: number
}

export interface IWuxingTitleStyle {
  fontSize: number
  fontWeight?: number
  color: string
  marginBottom?: number
  textAlign?: 'left' | 'center' | 'right'
}

export interface IWuxingElementStyle {
  nameSize: number
  nameWeight?: number
  descriptionSize?: number
  descriptionColor?: string
  numberSize?: number
  numberWeight?: number
  // 数字按钮样式配置
  numberWidth?: number
  numberHeight?: number
  numberFontSize?: number
  numberBorderRadius?: number
  numberGap?: number
}

// 波色属性样式接口
export interface IWaveColorAreaStyle {
  backgroundColor: string
  borderRadius: number
  padding: number
  marginTop: number
}

export interface IWaveColorGridStyle {
  columns?: number
  gap: number
  padding?: number
}

export interface IWaveColorCardStyle {
  backgroundColor: string
  borderRadius: number
  padding: number
  shadowColor?: string
  shadowBlur?: number
  hoverShadowBlur?: number
}

export interface IWaveColorTitleStyle {
  fontSize: number
  fontWeight?: number
  color: string
  marginBottom?: number
  textAlign?: 'left' | 'center' | 'right'
}

export interface IWaveColorElementStyle {
  nameSize: number
  nameWeight?: number
  descriptionSize?: number
  descriptionColor?: string
  numberSize?: number
  numberWeight?: number
  // 数字按钮样式配置
  numberWidth?: number
  numberHeight?: number
  numberFontSize?: number
  numberBorderRadius?: number
  numberGap?: number
}

// 合数单双属性样式接口
export interface INumberOddEvenAreaStyle {
  backgroundColor: string
  borderRadius: number
  padding: number
  marginTop: number
}

export interface INumberOddEvenGridStyle {
  columns?: number
  gap: number
  padding?: number
}

export interface INumberOddEvenCardStyle {
  backgroundColor: string
  borderRadius: number
  padding: number
  shadowColor?: string
  shadowBlur?: number
  hoverShadowBlur?: number
}

export interface INumberOddEvenTitleStyle {
  fontSize: number
  fontWeight?: number
  color: string
  marginBottom?: number
  textAlign?: 'left' | 'center' | 'right'
}

export interface INumberOddEvenElementStyle {
  nameSize: number
  nameWeight?: number
  descriptionSize?: number
  descriptionColor?: string
  numberSize?: number
  numberWeight?: number
  // 数字按钮样式配置
  numberWidth?: number
  numberHeight?: number
  numberFontSize?: number
  numberBorderRadius?: number
  numberGap?: number
}

export interface IResponsiveStyles {
  tablet: {
    grid: Partial<IGridLayoutStyle>
    card: Partial<IZodiacCardStyle>
    image: Partial<IZodiacImageStyle>
    name: Partial<IZodiacNameStyle>
    button: Partial<INumberButtonStyle>
  }
  mobile: {
    grid: Partial<IGridLayoutStyle>
    card: Partial<IZodiacCardStyle>
    image: Partial<IZodiacImageStyle>
    name: Partial<IZodiacNameStyle>
    button: Partial<INumberButtonStyle>
  }
}

export interface Zodiac12WuxingPageConfig {
  title: string
  subtitle: string
  titlePrefix: string
  content: string
  enable: boolean
  showGameType: boolean
  gameType: string
  gameTypeCode: string
  forumId: string
  size: number

  // Style configurations
  styleHeader: IStyleHeader
  styleMain: IStyleMain
  zodiacCardStyle: IZodiacCardStyle
  zodiacImageStyle: IZodiacImageStyle
  zodiacNameStyle: IZodiacNameStyle
  numberButtonStyle: INumberButtonStyle
  gridLayoutStyle: IGridLayoutStyle
  zodiacLayoutStyle: IZodiacLayoutStyle

  // 五行属性配置
  showWuxing: boolean
  wuxingTitle: string
  wuxingAreaStyle: IWuxingAreaStyle
  wuxingGridStyle: IWuxingGridStyle
  wuxingCardStyle: IWuxingCardStyle
  wuxingTitleStyle: IWuxingTitleStyle
  wuxingElementStyle: IWuxingElementStyle

  // 波色属性配置
  showWaveColor: boolean
  waveColorTitle: string
  waveColorAreaStyle: IWaveColorAreaStyle
  waveColorGridStyle: IWaveColorGridStyle
  waveColorCardStyle: IWaveColorCardStyle
  waveColorTitleStyle: IWaveColorTitleStyle
  waveColorElementStyle: IWaveColorElementStyle

  // 合数单双属性配置
  showNumberOddEven: boolean
  numberOddEvenTitle: string
  numberOddEvenAreaStyle: INumberOddEvenAreaStyle
  numberOddEvenGridStyle: INumberOddEvenGridStyle
  numberOddEvenCardStyle: INumberOddEvenCardStyle
  numberOddEvenTitleStyle: INumberOddEvenTitleStyle
  numberOddEvenElementStyle: INumberOddEvenElementStyle

  // Color mappings
  customColorMapping: {
    redWave: string
    blueWave: string
    greenWave: string
  }

  // Responsive settings
  responsiveBreakpoints: IResponsiveBreakpoints
  responsiveStyles: IResponsiveStyles

  // Layout options
  zodiacOrder: string[]
  showClashNames: boolean
  animationDuration: number
}

export interface IDatas extends ISetStyle<Zodiac12WuxingPageConfig> {}
