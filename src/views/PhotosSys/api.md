以下是关于 **game_type_issue_video API** 的整理文档，采用 Markdown 格式：

---

# 🎥 game_type_issue_video API 文档

## 1. `/webgw/issueVideo/list` - 开奖视频列表

用于查询【开奖视频列表】页面的数据。

### 🔸 Request 参数

| 参数名     | 类型    | 描述             |
| ---------- | ------- | ---------------- |
| videoTitle | String  | 视频名称（可选） |
| year       | Integer | 年份（如：2025） |
| gameType   | Integer | 彩种             |
| issue      | Integer | 第几期           |

#### 🧪 Example

```json
{
  "videoTitle": "",
  "year": 2025,
  "gameType": 1,
  "issue": 2025013
}
```

---

### 🔹 Response 参数

```json
{
  "success": true,
  "errCode": "string",
  "errMessage": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 1,
        "videoTitle": "开奖视频标题",
        "year": 2025,
        "gameType": 1,
        "issue": 2025013,
        "videoPath": "devmedia/video/lottery/video/25/07/28/xxxx.mp4",
        "videoSize": "100MB",
        "uploadVideoTime": "2025-07-28T12:00:00",
        "updateVideoTime": "2025-07-29T09:00:00",
        "videoPicture": "devmedia/video/picture/xxx.jpg"
      }
    ]
  }
}
```

📌 视频访问地址：测试环境拼接格式：`https://stt.pwtk.cc/ + videoPath`

---

## 2. `/webgw/issueVideo/detail` - 视频详情

根据视频 ID 获取详细信息。

### 🔸 Request

```json
{
  "id": 20250131
}
```

---

### 🔹 Response

```json
{
  "success": true,
  "errCode": "string",
  "errMessage": "string",
  "data": {
    "id": 20250131,
    "videoTitle": "开奖视频标题",
    "year": 2025,
    "gameType": 1,
    "issue": 2025013,
    "videoPath": "devmedia/video/lottery/video/25/07/28/xxxx.mp4",
    "videoSize": "100MB",
    "uploadVideoTime": "2025-07-28T12:00:00",
    "updateVideoTime": "2025-07-29T09:00:00",
    "videoPicture": "devmedia/video/picture/xxx.jpg"
  }
}
```

---

## 3. `/webgw/issueVideo/exist` - 判断视频是否存在

用于【新增/更新视频】前的预检查，提示用户是否会替换现有视频。

### 🔸 Request

```json
{
  "gameType": 1,
  "year": 2025,
  "issue": 2025013
}
```

---

### 🔹 Response

- 若存在：返回与 `/detail` 相同结构数据
- 若不存在：返回 `null`

---

## 4. `/webgw/issueVideo/create` - 新增或更新视频

创建或更新视频记录（注意：更新前请先调用 `/exist` 检查是否覆盖）。

### 🔸 Request

```json
{
  "videoTitle": "开奖视频标题",
  "gameType": 1,
  "year": 2025,
  "issue": 2025013,
  "videoPicture": "devmedia/video/picture/xxx.jpg",
  "videoPath": "devmedia/video/lottery/video/25/07/28/xxxx.mp4"
}
```

---

## 5. `/webgw/issueVideo/upload` - 上传视频或图片

上传文件（视频或图片），返回路径用于 `videoPath` 或 `videoPicture` 字段。

### 🔸 上传方式

#### ✅ URL 下载并上传

> 后端支持通过 URL 拉取并上传到 S3，使用独立接口处理。

#### ✅ 文件直传

接口地址：

```
POST http://192.168.0.198:8087/upload/single
```

### 🔹 Response（示例）

```json
{
  "path": "devmedia/video/lottery/video/25/07/28/xxxx.mp4"
}
```

---

📌 最终使用路径填写到 `/create` 接口中的：

- `videoPath`: 视频路径
- `videoPicture`: 图片路径

---

如需我帮你生成测试请求、构造接口文档模板、前端调用示例等，请随时告诉我。
