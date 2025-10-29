<template>
  <el-select
    v-model="selectedValue"
    filterable
    remote
    clearable
    :placeholder="placeholder"
    :loading="loading"
    :remote-method="queryUsers"
    :style="{ width }"
    @change="handleChange"
    @clear="handleClear"
    @click="handleClick"
  >
    <el-option v-for="item in options" :key="item.userId" :label="item.displayLabel" :value="item.userId">
      <div class="option-content">{{ item.displayLabel }}</div>
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { useWhitelist } from '@/composables/useWhiteList'

// Use the existing whitelist
const whitelist = useWhitelist()

// Define props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '用户昵称｜ID'
  },
  width: {
    type: String,
    default: '100%'
  },
  labelFields: {
    type: Array as () => string[],
    default: () => ['loginId', 'nickname']
  }
})

// Define emits
const emit = defineEmits(['update:modelValue', 'select', 'click'])

// Local state
const loading = ref(false)
const options = ref<any[]>([])
const selectedValue = ref(props.modelValue)

// Format display label based on labelFields prop
const getDisplayLabel = (user: any) => {
  return props.labelFields.map((field) => user[field]).join(' - ')
}

// Handle click event
const handleClick = async () => {
  loading.value = true
  await whitelist.loadWhitelistData()

  // Show all options on click
  options.value = whitelist.whitelistedUsers.value.map((user: any) => ({
    ...user,
    displayLabel: getDisplayLabel(user)
  }))

  loading.value = false
  emit('click')
}

// Query users with search term
const queryUsers = async (query: string) => {
  if (!query || !query.trim()) {
    // Show all options when query is empty
    handleClick()
    return
  }

  loading.value = true
  try {
    // Ensure whitelist data is loaded
    await whitelist.loadWhitelistData()

    // Filter whitelisted users based on query
    const filteredUsers = whitelist.whitelistedUsers.value.filter((user: any) =>
      props.labelFields.some((field) => user[field] && String(user[field]).toLowerCase().includes(query.toLowerCase()))
    )

    options.value = filteredUsers.map((user: any) => ({
      ...user,
      displayLabel: getDisplayLabel(user)
    }))
  } catch (error) {
    console.error('Failed to fetch users:', error)
    options.value = []
  } finally {
    loading.value = false
  }
}

// Handle selection change
const handleChange = (value: string) => {
  emit('update:modelValue', value || '')

  if (value) {
    const selectedUser = options.value.find((item) => item.userId === value)
    if (selectedUser) {
      emit('select', selectedUser)
    }
  }
}

// Handle clear button click
const handleClear = () => {
  emit('update:modelValue', '')
  emit('select', null)
}

// Watch for external modelValue changes
watch(
  () => props.modelValue,
  (newVal) => {
    selectedValue.value = newVal

    // If we have a value but no matching option, try to find the user in whitelist
    if (newVal && !options.value.some((item) => item.userId === newVal)) {
      whitelist.loadWhitelistData().then(() => {
        const user = whitelist.whitelistedUsers.value.find((u: any) => u.userId === newVal)
        if (user) {
          options.value = [
            {
              ...user,
              displayLabel: getDisplayLabel(user)
            }
          ]
        } else {
          queryUsers(newVal)
        }
      })
    }
  }
)

// Initialize with data if modelValue is provided
onMounted(async () => {
  await whitelist.loadWhitelistData()
  if (props.modelValue) {
    queryUsers(props.modelValue)
  } else {
    // Load all users initially
    options.value = whitelist.whitelistedUsers.value.map((user: any) => ({
      ...user,
      displayLabel: getDisplayLabel(user)
    }))
  }
})
</script>

<style scoped>
.option-content {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
