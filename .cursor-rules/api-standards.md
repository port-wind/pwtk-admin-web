# API 接口开发规范

## 统一请求处理

### 请求参数规范

```typescript
// 查询参数接口
interface QueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: string
}

// 分页返回数据
interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
```

### 错误处理规范

```typescript
// 统一错误处理
const handleApiError = (error: any) => {
  if (error.response?.status === 401) {
    // 未授权处理
    router.push('/login')
  } else if (error.response?.status === 403) {
    // 无权限处理
    ElMessage.error('无操作权限')
  } else {
    // 其他错误
    ElMessage.error(error.message || '请求失败')
  }
}
```

### 响应数据格式

```typescript
// 标准响应格式
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  code?: number
}
```

### 按钮权限控制

```typescript
// 权限判断函数
const hasPermission = (permission: string): boolean => {
  return per.includes(permission)
}

// 按钮类型规范
// 新增/启用: type="success"
// 禁用/删除: type="danger"
// 查询/详情/编辑: type="primary"
// 重置/取消: type="info"
```
