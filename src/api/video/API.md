#### 创建视频

```
POST /api/videos
```

**请求体**：

```json
{
  "title": "新视频",
  "description": "这是一个新上传的视频",
  "videoPath": "https://example.com/videos/new.mp4",
  "poster": "https://example.com/posters/new.jpg",
  "preview": "https://example.com/previews/new.jpg",
  "duration": 120,
  "size": 20971520,
  "userId": "user123",
  "resolution": "1920x1080",
  "bitrate": "2000kbps",
  "encoding": "h264",
  "language": "zh-CN",
  "hasComments": true,
  "hasBarrages": true,
  "hasListening": true,
  "isPublic": true,
  "tags": [1, 2],
  "postId": "5002",
  "lotteryType": "大乐透",
  "year": 2025,
  "issueNumber": "2025002"
}
```

#### 获取视频列表

```
GET /api/videos
```

**查询参数**：

| 参数              | 类型    | 必填 | 描述                          |
| ----------------- | ------- | ---- | ----------------------------- |
| page              | number  | 否   | 页码，默认为 1                |
| pageSize          | number  | 否   | 每页条数，默认为 10，最大 100 |
| search            | string  | 否   | 搜索关键词，匹配视频标题      |
| tagId             | number  | 否   | 按标签 ID 筛选                |
| userId            | string  | 否   | 按上传用户 ID 筛选            |
| isPublished       | boolean | 否   | 按发布状态筛选                |
| isPublic          | boolean | 否   | 按公开状态筛选                |
| transcodingStatus | number  | 否   | 按转码状态筛选                |
| postId            | string  | 否   | 按帖子 ID 筛选                |
| lotteryType       | string  | 否   | 按彩种筛选                    |
| year              | number  | 否   | 按年份筛选                    |
| issueNumber       | string  | 否   | 按期数筛选                    |

**认证要求**：仅 API 密钥

**响应示例**：

```json
{
  "success": true,
  "code": "OK",
  "message": "成功",
  "data": {
    "data": [
      {
        "id": 1,
        "title": "示例视频",
        "description": "这是一个示例视频",
        "videoPath": "https://example.com/videos/sample.mp4",
        "poster": "https://example.com/posters/sample.jpg",
        "preview": "https://example.com/previews/sample.jpg",
        "duration": 60,
        "size": 10485760,
        "userId": "user123",
        "resolution": "1920x1080",
        "bitrate": "2000kbps",
        "encoding": "h264",
        "language": "zh-CN",
        "hasComments": true,
        "hasBarrages": true,
        "hasListening": true,
        "isPublic": true,
        "isPublished": true,
        "auditStatus": 1,
        "transcodingStatus": 3,
        "createdAt": "2025-03-28T09:00:00.000Z",
        "postId": "5001",
        "lotteryType": "双色球",
        "year": 2025,
        "issueNumber": "2025001",
        "tags": [
          {
            "id": 1,
            "name": "搞笑",
            "isActive": true,
            "sortOrder": 1
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

#### 获取视频详情

```
GET /api/videos/:id
```

**路径参数**：

| 参数 | 类型   | 描述    |
| ---- | ------ | ------- |
| id   | number | 视频 ID |

**认证要求**：JWT 或 API 密钥

**响应示例**：

```json
{
  "success": true,
  "code": "OK",
  "message": "成功",
  "data": {
    "id": 1,
    "title": "示例视频",
    "description": "这是一个示例视频",
    "videoPath": "https://example.com/videos/sample.mp4",
    "poster": "https://example.com/posters/sample.jpg",
    "preview": "https://example.com/previews/sample.jpg",
    "duration": 60,
    "size": 10485760,
    "userId": "user123",
    "resolution": "1920x1080",
    "bitrate": "2000kbps",
    "encoding": "h264",
    "language": "zh-CN",
    "hasComments": true,
    "hasBarrages": true,
    "hasListening": true,
    "isPublic": true,
    "isPublished": true,
    "auditStatus": 1,
    "createdAt": "2025-03-28T09:00:00.000Z",
    "postId": "5001",
    "lotteryType": "双色球",
    "year": 2025,
    "issueNumber": "2025001",
    "tags": [
      {
        "id": 1,
        "name": "搞笑",
        "isActive": true,
        "sortOrder": 1
      }
    ]
  }
}
```

#### 更新视频

```
PUT /api/videos/:id
```

**路径参数**：

| 参数 | 类型   | 描述    |
| ---- | ------ | ------- |
| id   | number | 视频 ID |

**请求体**：

```json
{
  "title": "更新后的视频标题",
  "description": "更新后的描述",
  "poster": "https://example.com/posters/updated.jpg",
  "preview": "https://example.com/previews/updated.jpg",
  "hasComments": false,
  "tags": [1, 3],
  "lotteryType": "七星彩",
  "year": 2025,
  "issueNumber": "2025003"
}
```

#### 删除视频

```
DELETE /api/videos/:id
```

**路径参数**：

| 参数 | 类型   | 描述    |
| ---- | ------ | ------- |
| id   | number | 视频 ID |

**认证要求**：JWT 或 API 密钥

**响应示例**：

```json
{
  "success": true,
  "code": "OK",
  "message": "成功",
  "data": {
    "success": true
  }
}
```

#### 审核视频

```
POST /api/videos/:id/audit
```

**路径参数**：

| 参数 | 类型   | 描述    |
| ---- | ------ | ------- |
| id   | number | 视频 ID |

**请求体**：

```json
{
  "auditStatus": 1,
  "auditComment": "内容符合规范",
  "auditPersonId": "admin100",
  "auditPersonName": "管理员A"
}
```

#### 切换视频发布状态

```
POST /api/videos/:id/toggle-publish
```

**路径参数**：

| 参数 | 类型   | 描述    |
| ---- | ------ | ------- |
| id   | number | 视频 ID |

**认证要求**：仅 API 密钥（管理员）

**响应示例**：

```json
{
  "success": true,
  "code": "OK",
  "message": "成功",
  "data": {
    "id": 2,
    "title": "更新后的视频标题",
    "isPublished": false,
    "auditStatus": 1,
    "postId": "5002",
    "lotteryType": "七星彩",
    "year": 2025,
    "issueNumber": "2025003"
  }
}
```

#### 获取标签列表

```
GET /api/tags
```

**查询参数**：

| 参数     | 类型    | 必填 | 描述           |
| -------- | ------- | ---- | -------------- |
| isActive | boolean | 否   | 按标签状态筛选 |

**认证要求**：JWT 或 API 密钥

**响应示例**：

```json
{
  "success": true,
  "code": "OK",
  "message": "成功",
  "data": [
    {
      "id": 1,
      "name": "搞笑",
      "isActive": true,
      "sortOrder": 1,
      "createdAt": "2025-03-23T09:00:00.000Z"
    },
    {
      "id": 2,
      "name": "音乐",
      "isActive": true,
      "sortOrder": 2,
      "createdAt": "2025-03-23T09:05:00.000Z"
    },
    {
      "id": 3,
      "name": "科技",
      "isActive": true,
      "sortOrder": 3,
      "createdAt": "2025-03-23T09:10:00.000Z"
    }
  ]
}
```

#### 获取标签详情

```
GET /api/tags/:id
```

**路径参数**：

| 参数 | 类型   | 描述    |
| ---- | ------ | ------- |
| id   | number | 标签 ID |

**认证要求**：JWT 或 API 密钥

**响应示例**：

```json
{
  "success": true,
  "code": "OK",
  "message": "成功",
  "data": {
    "id": 1,
    "name": "搞笑",
    "isActive": true,
    "sortOrder": 1,
    "createdAt": "2025-03-23T09:00:00.000Z"
  }
}
```

#### 创建标签

```
POST /api/tags
```

**请求体**：

```json
{
  "name": "旅游",
  "isActive": true
}
```

**认证要求**：仅 API 密钥（管理员）

**响应示例**：

```json
{
  "success": true,
  "code": "OK",
  "message": "成功",
  "data": {
    "id": 4,
    "name": "旅游",
    "isActive": true,
    "sortOrder": 4,
    "createdAt": "2025-03-28T12:00:00.000Z"
  }
}
```

#### 更新标签

```
PUT /api/tags/:id
```

**路径参数**：

| 参数 | 类型   | 描述    |
| ---- | ------ | ------- |
| id   | number | 标签 ID |

**请求体**：

```json
{
  "name": "旅行",
  "isActive": true,
  "sortOrder": 5
}
```

#### 删除标签

```
DELETE /api/tags/:id
```

**路径参数**：

| 参数 | 类型   | 描述    |
| ---- | ------ | ------- |
| id   | number | 标签 ID |

**认证要求**：仅 API 密钥（管理员）

**响应示例**：

```json
{
  "success": true,
  "code": "OK",
  "message": "成功",
  "data": {
    "success": true
  }
}
```
