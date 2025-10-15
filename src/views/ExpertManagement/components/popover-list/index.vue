<template>
  <el-popover v-if="showPopover" :width="width" placement="top" trigger="hover" v-model:visible="visible">
    <!-- Reference content shown before hover -->
    <template #reference>
      <slot name="reference">
        <div>
          <ul class="predict_list">
            <li v-for="(item, index) in truncatedItems" :key="index" class="non_style">
              {{ item }}
            </li>
            <li v-if="content.length > maxItems" class="non_style" style="background: none; color: #666">...</li>
          </ul>
        </div>
      </slot>
    </template>

    <!-- Default popover content if no slot provided -->
    <slot>
      <div class="predict_relevent" style="overflow: auto">
        <ul class="predict_list">
          <li v-for="(item, index) in content" :key="index" class="non_style">
            {{ item }}
          </li>
        </ul>
      </div>
    </slot>
  </el-popover>

  <!-- If popover is disabled, just show truncated list -->
  <div v-else>
    <ul class="predict_list">
      <li v-for="(item, index) in truncatedItems" :key="index" class="non_style">
        {{ item }}
      </li>
      <li v-if="content.length > maxItems" class="non_style" style="background: none; color: #666">...</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  content: {
    type: Array,
    default: () => []
  },
  maxItems: {
    type: Number,
    default: 4
  },
  popoverEnabled: {
    type: Boolean,
    default: true
  },
  width: {
    type: [Number, String],
    default: 400
  },
  placement: {
    type: String,
    default: 'top'
  },
  trigger: {
    type: String,
    default: 'hover' // could be 'click' or 'manual'
  },
  modelValue: {
    type: Boolean,
    default: undefined
  }
})
const showPopover = computed(() => {
  return props.popoverEnabled && props.content.length > props.maxItems
})
const emits = defineEmits(['update:modelValue'])

const truncatedItems = computed(() => {
  return props.content.slice(0, props.maxItems)
})

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val)
})
</script>

<style scoped lang="less">
.predict_list {
  margin: 0;
  padding: 0;
  padding-left: 0;
  display: flex;
  list-style: none;
  column-gap: 3px;
  li {
    min-width: 18px;
    width: 18px;
    height: 18px;
    text-align: center;
    line-height: 18px;
    background-color: rgb(99, 161, 3);
    color: white;
    border-radius: 100%;
    font-size: 12px;

    &.non_style {
      list-style: none;
      margin: 0;
      padding: 0;
    }
  }
}

&::-webkit-scrollbar {
  height: 6px;
  width: 2px;
}

&::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

&::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

&::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.predict_relevent {
  overflow: auto;
}
</style>
