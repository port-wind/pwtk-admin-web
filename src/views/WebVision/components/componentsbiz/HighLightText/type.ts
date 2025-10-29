import type { ISetStyle } from '../componentProperties/index'
import type { IUseIssueListParams } from '../hooks/issueList'
export interface IDatas extends ISetStyle<HighLightTextConfig> {}

export interface HighLightTextConfig extends IUseIssueListParams {
  // 文本内容
  text: string
}
