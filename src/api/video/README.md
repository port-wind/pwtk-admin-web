# Video API Documentation

## Tag Management APIs

### Get Tag List

```
GET /api/tags
```

**Query Parameters:**

| Parameter | Type    | Required | Description          |
| --------- | ------- | -------- | -------------------- |
| isActive  | boolean | No       | Filter by tag status |

**Authentication:** JWT or API Key

**Response Example:**

```json
{
  "success": true,
  "code": "OK",
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Comedy",
      "isActive": true,
      "sortOrder": 1,
      "createdAt": "2025-03-23T09:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Music",
      "isActive": true,
      "sortOrder": 2,
      "createdAt": "2025-03-23T09:05:00.000Z"
    },
    {
      "id": 3,
      "name": "Technology",
      "isActive": true,
      "sortOrder": 3,
      "createdAt": "2025-03-23T09:10:00.000Z"
    }
  ]
}
```

### Get Tag Details

```
GET /api/tags/:id
```

**Path Parameters:**

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| id        | number | Tag ID      |

**Authentication:** JWT or API Key

**Response Example:**

```json
{
  "success": true,
  "code": "OK",
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Comedy",
    "isActive": true,
    "sortOrder": 1,
    "createdAt": "2025-03-23T09:00:00.000Z"
  }
}
```

### Create Tag

```
POST /api/tags
```

**Request Body:**

```json
{
  "name": "Travel",
  "isActive": true
}
```

**Authentication:** API Key only (Admin)

**Response Example:**

```json
{
  "success": true,
  "code": "OK",
  "message": "Success",
  "data": {
    "id": 4,
    "name": "Travel",
    "isActive": true,
    "sortOrder": 4,
    "createdAt": "2025-03-28T12:00:00.000Z"
  }
}
```

### Update Tag

```
PUT /api/tags/:id
```

**Path Parameters:**

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| id        | number | Tag ID      |

**Request Body:**

```json
{
  "name": "Tourism",
  "isActive": true,
  "sortOrder": 5
}
```

**Authentication:** API Key only (Admin)

**Response Example:**

```json
{
  "success": true,
  "code": "OK",
  "message": "Success",
  "data": {
    "id": 4,
    "name": "Tourism",
    "isActive": true,
    "sortOrder": 5,
    "createdAt": "2025-03-28T12:00:00.000Z"
  }
}
```

### Delete Tag

```
DELETE /api/tags/:id
```

**Path Parameters:**

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| id        | number | Tag ID      |

**Authentication:** API Key only (Admin)

**Response Example:**

```json
{
  "success": true,
  "code": "OK",
  "message": "Success",
  "data": {
    "success": true
  }
}
```

## Available API Functions

The following TypeScript functions are available in `src/api/video/index.ts`:

- `getVideoTagList(data?: { isActive: boolean })` - Get tag list (existing)
- `getFormattedVideoTagList()` - Get formatted tag list for select components (existing)
- `getTagDetails(data: { id: number })` - Get tag details by ID (new)
- `createTag(data: { name: string; isActive: boolean })` - Create a new tag (new)
- `updateTag(data: { id: number; name: string; isActive: boolean; sortOrder?: number })` - Update an existing tag (new)
- `deleteTag(data: { id: number })` - Delete a tag (new)
