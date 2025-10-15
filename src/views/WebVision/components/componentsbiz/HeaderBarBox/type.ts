export interface HeaderBarBox {
  backgroundColor: string
  logoSrc: string
  middleSrc: string
  backToHome: boolean
  bgImg: string
  bgColor: string
  textColor: string
  model: string
  gradient: any
  theme: {
    primary: string
    secondary: string
    gradient: string
  }
  Attr: {
    sticky: boolean
    offsetTop: number
  }
}
