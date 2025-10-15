# Video Upload Components Architecture

This directory contains the refactored video upload system, split into focused, maintainable components and composables.

## Architecture Overview

### 🏗️ Composables

- **`useFileValidation`** - Handles file type and size validation
- **`useChunkUpload`** - Manages chunked upload logic, progress tracking, and concurrency
- **`useVideoUpload`** - Main orchestrator that coordinates validation, upload, and state management (immediate upload)
- **`useDeferredVideoUpload`** - ✨ **NEW** - Deferred upload orchestrator for local preview without immediate upload

### 🧩 Components

- **`VideoUploaderBtn.vue`** - Main upload button component (immediate upload)
- **`DeferredVideoUploader.vue`** - ✨ **NEW** - Deferred upload component with local preview
- **`VideoFileInput.vue`** - Dedicated file input handler
- **`UploadProgress.vue`** - Progress display component
- **`FileInfo.vue`** - File information display with modify option
- **`createVideo.vue`** - ✨ **UPDATED** - Now uses deferred upload flow

### 📝 Types

- **`video-upload.ts`** - All TypeScript interfaces and types for video upload

## 🆕 New Deferred Upload Flow

### Key Features

1. **Local Preview**: Show selected video immediately using blob URL
2. **Upload on Demand**: Only upload when form is submitted
3. **Better UX**: User can see their video before committing to upload
4. **Error Handling**: Comprehensive error handling for upload failures

### Flow Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   File Select   │───▶│  Local Preview   │───▶│  Form Submit    │
│                 │    │  (blob URL)      │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Video Created  │◀───│   Upload File    │───▶│   Get File URL  │
│                 │    │  (chunked)       │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Benefits of Refactoring

### ✅ Before vs After

| **Before**                           | **After**                               |
| ------------------------------------ | --------------------------------------- |
| 557 lines monolithic component       | Multiple focused files < 100 lines each |
| Mixed concerns (UI + business logic) | Clear separation of concerns            |
| Hard to test                         | Easy to unit test individual pieces     |
| Complex state management             | Clean, predictable state flow           |
| Difficult to maintain                | Modular and maintainable                |
| **Immediate upload on file select**  | **✨ Upload on form submit**            |
| **No local preview**                 | **✨ Instant local preview**            |

### 🎯 Key Improvements

1. **Separation of Concerns**: Each composable has a single responsibility
2. **Reusability**: Composables can be used in other components
3. **Testability**: Each piece can be tested independently
4. **Type Safety**: Strong TypeScript typing throughout
5. **Maintainability**: Easier to debug, modify, and extend
6. **🆕 Better UX**: Local preview without upload commitment
7. **🆕 Deferred Upload**: Upload only when needed

## Usage Examples

### Immediate Upload (Legacy)

```vue
<template>
  <VideoUploaderBtn
    :showOperation="true"
    :userId="currentUserId"
    :uploadOptions="{
      tag: 'course',
      path: 'videos/courses',
      chunkSize: 5
    }"
    @file-selected="handleFileSelected"
    @upload-success="handleUploadSuccess"
    @upload-error="handleUploadError"
  />
</template>

<script setup>
import VideoUploaderBtn from './components/VideoUploaderBtn.vue'

const handleFileSelected = (file) => {
  console.log('File selected:', file.name)
}

const handleUploadSuccess = (result) => {
  console.log('Upload completed:', result.data.fileUrl)
}

const handleUploadError = (error) => {
  console.error('Upload failed:', error)
}
</script>
```

### 🆕 Deferred Upload (Recommended)

```vue
<template>
  <div>
    <!-- Video Preview or Upload Button -->
    <nativeVideoViewer
      :video-source="videoPreviewUrl || form.videoPath"
      v-if="videoPreviewUrl || form.videoPath"
    />
    <DeferredVideoUploader
      v-else
      ref="uploaderRef"
      :showOperation="true"
      :userId="currentUserId"
      :uploadOptions="{
        tag: 'course',
        path: 'videos/courses',
        chunkSize: 5
      }"
      @file-selected="handleFileSelected"
      @preview-ready="handlePreviewReady"
      @upload-success="handleUploadSuccess"
      @upload-error="handleUploadError"
    />

    <!-- Submit Button -->
    <el-button
      type="primary"
      @click="handleSubmit"
      :loading="isSubmitting"
    >
      Submit
    </el-button>
  </div>
</template>

<script setup>
import DeferredVideoUploader from './DeferredVideoUploader.vue'
import nativeVideoViewer from './nativeVideoViewer/index.vue'

const uploaderRef = ref(null)
const videoPreviewUrl = ref('')

const handleFileSelected = (file) => {
  console.log('File selected:', file.name)
}

const handlePreviewReady = (previewUrl) => {
  videoPreviewUrl.value = previewUrl
}

const handleSubmit = async () => {
  try {
    // Upload the file when form is submitted
    const uploadResult = await uploaderRef.value.uploadFile()

    // Use the upload result to create video record
    const videoData = {
      ...formData,
      videoPath: uploadResult.data.fileUrl
    }

    await createVideo(videoData)
  } catch (error) {
    console.error('Submit failed:', error)
  }
}
</script>
```

## File Structure

```
src/
├── composables/
│   ├── useFileValidation.ts        # File validation logic
│   ├── useChunkUpload.ts           # Chunked upload management
│   ├── useVideoUpload.ts           # Immediate upload orchestrator
│   └── useDeferredVideoUpload.ts   # 🆕 Deferred upload orchestrator
├── global_types/
│   └── video-upload.ts             # TypeScript definitions
└── views/VideoList/components/
    ├── VideoUploaderBtn.vue        # Immediate upload component
    ├── DeferredVideoUploader.vue   # 🆕 Deferred upload component
    ├── VideoFileInput.vue          # File input handler
    ├── UploadProgress.vue          # Progress display
    ├── FileInfo.vue               # File info display
    ├── createVideo.vue            # 🔄 Updated to use deferred upload
    ├── nativeVideoViewer/          # Video display component
    └── README.md                  # This documentation
```

## 🔧 API Changes

### New Events

- `preview-ready`: Emitted when local preview URL is available
- Enhanced error handling for upload failures

### New Methods

- `uploadFile()`: Trigger upload programmatically
- `reset()`: Clean up blob URLs and reset state

### Enhanced State Management

- Local preview URLs with proper cleanup
- Deferred upload state tracking
- Better error propagation
