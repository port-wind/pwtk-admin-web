<template>
  <div class="audio-player" v-if="audioSource">
    <audio ref="audioPlayer" :src="url" controls></audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const { VITE_TASK_DOMAIN } = import.meta.env
const props = defineProps({
  audioSource: {
    type: String,
    required: true
  }
})

const url = computed(() => `${VITE_TASK_DOMAIN}${props.audioSource}`)

const emit = defineEmits(['play', 'pause', 'timeupdate', 'ended', 'error', 'loaded'])

// Player state
const audioPlayer = ref(null)
const isPlaying = ref(false)
const hasError = ref(false)

// Event handlers for player state
const handlePlay = () => {
  isPlaying.value = true
  emit('play')
}

const handlePause = () => {
  isPlaying.value = false
  emit('pause')
}

const handleEnded = () => {
  isPlaying.value = false
  emit('ended')
}

const handleError = (error) => {
  console.error('Audio error:', error)
  hasError.value = true
  emit('error', error)
}

// Event listeners management
const attachEventListeners = () => {
  if (!audioPlayer.value) return

  audioPlayer.value.addEventListener('play', handlePlay)
  audioPlayer.value.addEventListener('pause', handlePause)
  audioPlayer.value.addEventListener('ended', handleEnded)
  audioPlayer.value.addEventListener('error', handleError)
}

const detachEventListeners = () => {
  if (!audioPlayer.value) return

  audioPlayer.value.removeEventListener('play', handlePlay)
  audioPlayer.value.removeEventListener('pause', handlePause)
  audioPlayer.value.removeEventListener('ended', handleEnded)
  audioPlayer.value.removeEventListener('error', handleError)
}
// Lifecycle hooks
onMounted(() => {
  attachEventListeners()
})

onUnmounted(() => {
  detachEventListeners()
})
</script>

<style scoped>
.audio-player {
  max-width: 100%;
  display: flex;
  align-items: center;
}

audio {
  flex: 1;
}

.audio-controls {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.error-message {
  color: red;
  padding: 10px;
  text-align: center;
}
</style>
