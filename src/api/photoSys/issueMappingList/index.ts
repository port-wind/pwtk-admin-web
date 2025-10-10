import http from '@/utils/http/index'

//列表查询
export const reqIssueMappingList = (data: any) => {
  return http.post('webgw/issueMapping/list', data)
}

//新增
export const addIssueMapping = (data: any) => {
  return http.post('webgw/issueMapping/create', data)
}

//批量新增
export const batchAddIssueMapping = (data: any) => {
  return http.post('webgw/issueMapping/batchCreate', data)
}

//编辑
export const editIssueMapping = (data: any) => {
  return http.post('webgw/issueMapping/update', data)
}

//删除
export const delIssueMapping = (data: any) => {
  return http.post('webgw/issueMapping/del', data)
}

//单个查询
export const getIssueMapping = (data: any) => {
  return http.post('webgw/issueMapping/detail', data)
}

//图库图纸查询
export const getGameTypeSeries = (data: any) => {
  return http.post('webgw/tk/gameTypeSeries/list', data)
}

//图纸报纸查询
export const getGameTypeNewspaper = (data: any) => {
  return http.post('webgw/gameTypeNewspaper/list', data)
}
