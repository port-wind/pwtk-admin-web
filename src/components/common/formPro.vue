<template>
  <div class="form-pro-wrapper" :style="`--items-gap:${itemsGap}px`">
    <el-form ref="ruleFormRef" :label-width="labelWidth" :model="formData" :rules="rules">
      <template v-for="(item, index) in config">
        <el-form-item
          v-if="!!checkFnAndReturnVal(item.if, formData)"
          :key="index"
          :label="item.label ? `${item.label} :` : ''"
          :label-width="item.labelWidth || labelWidth || '0'"
          :style="{
            width:
              item.width ||
              (/^(daterange|datetimerange)$/.test(item.type ?? '') ? '340px' : '') ||
              `calc(${itemWidth} - ${itemsGap / (itemWidth === '50%' ? 2 : 1)}px)`,
            marginBottom: !!Object.keys(rules).length ? '10px' : '0'
          }"
          :prop="getItemKey(item)"
        >
          <div class="item-input-wrapper">
            <slot v-if="item.slot" :name="item.slot" :data="formData" />

            <!-- Render el-input when type is not specified or is 'input' -->
            <el-input
              v-else-if="!item.type || item.type === 'input'"
              v-model="formData[getItemKey(item)]"
              :maxlength="item.maxLength"
              :show-word-limit="!!item.maxLength"
              :placeholder="item.placeholder || '请输入'"
              :disabled="!!checkFnAndReturnVal(item.disabled, formData, false)"
              :type="item.inputType"
              :rows="item.rows || 3"
              clearable
            ></el-input>

            <div v-else-if="item.type === 'text'">
              {{ checkFnAndReturnVal(item.format, formData[getItemKey(item)]) || item.placeholder || '请选择' }}
            </div>

            <!-- Render el-select for dropdown options -->
            <SingleSelectArray
              v-else-if="item.type === 'select' && !item.multiple && item.selectValueType === 'array'"
              v-model="formData[getItemKey(item)]"
              :placeholder="item.placeholder || '请选择'"
              :disabled="!!checkFnAndReturnVal(item.disabled, formData, false)"
              clearable
            >
              <!-- Iterate through options to render each as an el-option -->
              <el-option
                v-for="option in checkFnAndReturnVal(item.options, formData)"
                :key="option.value"
                :label="item.optionsLabelValue ? option[item.optionsLabelValue[0]] : option.label"
                :value="item.optionsLabelValue ? option[item.optionsLabelValue[1]] : option.value"
              />
            </SingleSelectArray>

            <el-select
              v-else-if="item.type === 'select'"
              v-model="formData[getItemKey(item)]"
              :placeholder="item.placeholder || '请选择'"
              :disabled="!!checkFnAndReturnVal(item.disabled, formData, false)"
              :multiple="item.multiple"
              :multiple-limit="item.multipleLimit"
              @change="(optItem:Record<string, any>)=>checkFnAndReturnVal(item.change, optItem)"
              clearable
            >
              <!-- Iterate through options to render each as an el-option -->
              <el-option
                v-for="option in checkFnAndReturnVal(item.options, formData)"
                :key="option.value"
                :label="item.optionsLabelValue ? option[item.optionsLabelValue[0]] : option.label"
                :value="item.optionsLabelValue ? option[item.optionsLabelValue[1]] : option.value"
              />
            </el-select>

            <!-- Render el-checkbox-group for multiple selection -->
            <el-checkbox-group v-else-if="item.type === 'checkbox-group'" v-model="formData[getItemKey(item)]">
              <el-checkbox
                v-for="option in checkFnAndReturnVal(item.options, formData)"
                :key="option.value"
                :label="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </el-checkbox>
            </el-checkbox-group>

            <!-- Render el-switch for toggles -->
            <el-switch
              v-else-if="item.type === 'switch'"
              v-model="formData[getItemKey(item)]"
              :active-text="item.activeText"
              :inactive-text="item.inactiveText"
            />
            <!-- Render range date-picker for range selection -->
            <el-date-picker
              v-else-if="item.type === 'daterange' || item.type === 'datetimerange'"
              @change="(d: any) => handleRangeDate(d, item)"
              v-model="formData[getItemKey(item)]"
              :type="item.type"
              :start-placeholder="item.startPlaceholder || '开始日期'"
              :end-placeholder="item.endPlaceholder || '结束日期'"
              :range-separator="item.rangeSeparator || '-'"
              :disabled-date="(time: Date) => handleDisabledDate(time, item.disabledDate)"
              :disabled="!!checkFnAndReturnVal(item.disabled, formData, false)"
              clearable
            />

            <!-- Render el-date-picker for date selection -->
            <el-date-picker
              v-else-if="item.type === 'date' || item.type === 'datetime'"
              v-model="formData[getItemKey(item)]"
              :type="item.type"
              :placeholder="item.placeholder || '请选择日期'"
              :disabled="!!checkFnAndReturnVal(item.disabled, formData, false)"
              clearable
            />

            <!-- Render el-autocomplete for suggestions -->
            <el-autocomplete
              v-else-if="item.type === 'autocomplete'"
              v-model="formData[`${getItemKey(item)}-${KEY_EXTRA_SUFFIX}`]"
              :fetch-suggestions="item.fetchSuggestions"
              :placeholder="item.placeholder || '请输入'"
              @select="(optItem:Record<string, any>)=>handleSelectAutocomplete(optItem, item)"
              clearable
            />

            <!-- Render el-input-number for numeric input -->
            <el-input-number
              v-else-if="item.type === 'input-number'"
              v-model="formData[getItemKey(item)]"
              :min="item.min"
              :max="item.max"
              :step="item.step"
              :placeholder="item.placeholder || '请输入'"
              clearable
            />

            <!-- Render el-radio-group for single selection -->
            <el-radio-group v-else-if="item.type === 'radio-group'" v-model="formData[getItemKey(item)]">
              <el-radio
                v-for="option in checkFnAndReturnVal(item.options, formData)"
                :key="option.value"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </el-radio>
            </el-radio-group>

            <!-- Render el-slider for range input -->
            <el-slider
              v-else-if="item.type === 'slider'"
              v-model="formData[getItemKey(item)]"
              :min="item.min"
              :max="item.max"
              :step="item.step"
            />

            <!-- Render el-time-picker for time selection -->
            <el-time-picker
              v-else-if="item.type === 'time-picker'"
              v-model="formData[getItemKey(item)]"
              :is-range="item.isRange"
              :placeholder="item.placeholder || '请选择时间'"
              clearable
            />

            <!-- Render el-time-select for predefined time options -->
            <el-time-select
              v-else-if="item.type === 'time-select'"
              v-model="formData[getItemKey(item)]"
              :picker-options="item.pickerOptions"
              :placeholder="item.placeholder || '请选择时间'"
              clearable
            />

            <div v-if="item.append" class="item-append">
              <slot v-if="item.append.slot" :name="item.append.slot" />
              <el-button
                v-else-if="item.append.text"
                @click="item.append.click && item.append.click(formData)"
                :type="item.append.type || 'primary'"
                :round="item.append.round"
                :icon="item.append.icon"
                :circle="item.append.circle"
              >
                {{ item.append.text }}
              </el-button>
              <el-button
                v-else
                @click="item.append.click && item.append.click(formData)"
                :type="item.append.type || 'primary'"
                :round="item.append.round"
                :icon="item.append.icon"
                :circle="item.append.circle"
              />
            </div>
          </div>
        </el-form-item>
      </template>
      <div class="form-after" v-if="$slots.after">
        <slot name="after" :isFormValid="isFormValid" :validateForm="validateForm" />
      </div>
    </el-form>
    <div class="bottom bottom-left" v-if="$slots['bottom-left']">
      <slot name="bottom-left" :isFormValid="isFormValid" :validateForm="validateForm" />
    </div>
    <div class="bottom bottom-center" v-if="$slots['bottom-center']">
      <slot name="bottom-center" :isFormValid="isFormValid" :validateForm="validateForm" />
    </div>
    <div class="bottom bottom-right" v-if="$slots['bottom-right']">
      <slot name="bottom-right" :isFormValid="isFormValid" :validateForm="validateForm" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, type FormInstance, type FormItemRule } from 'element-plus'
import { deleteRedundantItems, KEY_EXTRA_SUFFIX } from '@/utils/formProHelper'
import SingleSelectArray from './SingleSelectArray.vue'

const getItemKey = (item: ItemInterface) => {
  return item.key || `${item.endKey}-${KEY_EXTRA_SUFFIX}`
}

const handleData = (data: Record<string, any>) => {
  props.config.forEach((item: Record<string, any>) => {
    if (item.endKey && data[item.endKey] && !data[getItemKey(item)]) {
      data[getItemKey(item)] = [data[item.startKey], data[item.endKey]]
    }
  })
  return data
}

const ruleFormRef = ref<FormInstance>()

// Utility type for supporting both singular and array values
type Arrayable<T> = T | T[]

// Interface for form configuration items
export interface ItemInterface<T = any> {
  type?:
    | 'input'
    | 'select'
    | 'checkbox-group'
    | 'switch'
    | 'daterange'
    | 'datetimerange'
    | 'date'
    | 'datetime'
    | 'autocomplete'
    | 'input-number'
    | 'radio-group'
    | 'slider'
    | 'time-picker'
    | 'time-select'
    | 'slot'
    | 'text'
    | 'inputSlot'
  // Type of form component to render
  key?: string // Unique key for identifying the form item
  label?: string // Label text for the form item
  labelWidth?: string // Label text for the form item
  placeholder?: string // Placeholder text for input fields
  inputType?: 'text' | 'number' | 'textarea' // Input type for text fields
  rows?: number // Number of rows for textarea
  maxLength?: number // Maximum input length
  style?: boolean // Custom styles for the form item
  rules?: Arrayable<FormItemRule> // Validation rules
  disabled?: boolean | ((formData: Record<string, any>) => boolean) // Function to determine if the item should be disabled
  disabledDate?: 'beforeToday' | 'afterToday' | ((time: Date) => boolean) // Function to determine if the item should be disabled
  options?: Record<string, any>[] | ((row?: Record<string, any>) => Record<string, any>[]) // Options for select, radio-group, and checkbox-group
  if?: boolean | ((formData: Record<string, any>) => boolean) // Options for select, radio-group, and checkbox-group
  optionsLabelValue?: [string, string] // Options for select, radio-group, and checkbox-group
  optionsCheckDisabled?: (option: Record<string, any>) => boolean
  activeText?: string // Active text for switch
  inactiveText?: string // Inactive text for switch
  fetchSuggestions?: (query: string, cb: (suggestions: any[]) => void) => void // Function for fetching autocomplete suggestions
  min?: number // Minimum value for input-number or slider
  max?: number // Maximum value for input-number or slider
  step?: number // Step value for input-number or slider
  isRange?: boolean // Indicates if a time-picker is for a range
  pickerOptions?: Record<string, any> // Picker options for time-select
  startKey?: string // Start key for range selection
  endKey?: string // End key for range selection
  startPlaceholder?: string // Placeholder for start of range
  endPlaceholder?: string // Placeholder for end of range
  rangeSeparator?: string // Separator for range picker
  width?: string // width
  slot?: string // slot name
  multiple?: boolean
  multipleLimit?: number
  selectValueType?: 'string' | 'array'
  append?: {
    slot?: string
    click?: (formData: T) => void
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
    round?: boolean
    icon?: string
    circle?: boolean
    text?: string
  }
  format?: (value: any) => string // Formatter for date values
  formatDate?: (value: any) => string // Formatter for date values
  change?: (value: any) => void // Formatter for date values
}

const props = withDefaults(
  defineProps<{
    config: ItemInterface[] // Array of form configuration items
    modelValue: Record<string, any> // Initial form data
    itemWidth?: string
    labelWidth?: string
    itemsGap?: number
    reset?: boolean
    needToastError?: boolean
  }>(),
  {
    itemWidth: '100%',
    labelWidth: '',
    itemsGap: 8
  }
)

const emit = defineEmits(['update:modelValue'])

const formData = ref<Record<string, any>>(handleData(props.modelValue)) // Reactive form data object
const isFormValid = ref(true)

// Computed property for generating validation rules dynamically
const rules = computed<Partial<Record<string, Arrayable<FormItemRule>>>>(() => {
  if (!props.config) return {}
  const _rules: Partial<Record<string, Arrayable<FormItemRule>>> = {}
  props.config.forEach((item: ItemInterface) => {
    if (item.rules && (item.key || item.endKey)) {
      _rules[getItemKey(item)] = item.rules
    }
  })
  return _rules
})

watch(
  () => props.reset,
  (newValue) => {
    newValue && resetFields()
  }
)

// Watch for changes in props.modelValue and update formData accordingly
watch(
  () => props.modelValue,
  (newValue) => {
    formData.value = handleData(newValue)
  },
  { deep: true }
)

// Emit updates to modelValue whenever formData changes
watch(
  () => formData.value,
  (newValue) => {
    emit('update:modelValue', newValue)
  },
  { deep: true }
)

const handleDisabledDate = (time: Date, disabledDate: ItemInterface['disabledDate']) => {
  if (typeof disabledDate === 'function') {
    return disabledDate(time)
  }
  if (disabledDate === 'beforeToday') {
    return time.getTime() < Date.now()
  }
  if (disabledDate === 'afterToday') {
    return time.getTime() > Date.now()
  }
  return false
}

const handleRangeDate = (data: any, item: ItemInterface) => {
  if (data) {
    formData.value[item.startKey || ''] = item.formatDate ? item.formatDate(data[0]) : new Date(data[0]).getTime()
    formData.value[item.endKey || ''] = item.formatDate ? item.formatDate(data[1]) : new Date(data[1]).getTime()
  } else {
    formData.value[item.startKey || ''] = typeof formData.value[item.startKey || ''] === 'string' ? '' : null
    formData.value[item.endKey || ''] = typeof formData.value[item.endKey || ''] === 'string' ? '' : null
  }
}

const handleSelectAutocomplete = (optItem: Record<string, any>, item: Record<string, any>) => {
  formData.value[getItemKey(item)] = optItem.actualValue || optItem.value
}

const validateForm = async (callback: (data: any) => void) => {
  try {
    // 调用 form 的 validate 方法，触发校验
    await ruleFormRef.value?.validate()
    isFormValid.value = true // 如果验证通过，更新校验结果为 true
    callback && callback(deleteRedundantItems(formData.value))
  } catch (error: any) {
    if (props.needToastError) {
      for (let i = 0; i < props.config.length; i++) {
        const firstError = error[props.config[i].key || '']
        if (firstError) {
          ElMessage({
            type: 'error',
            message: firstError[0].message
          })
          break // 中断循环
        }
      }
    }

    isFormValid.value = false // 如果验证失败，更新校验结果为 false
  }
}
const validateField = async (key: string) => {
  key && ruleFormRef.value?.validateField(key)
}

const resetFields = async () => {
  try {
    ruleFormRef.value?.resetFields()
    isFormValid.value = false
  } catch (error) {}
}

const checkFnAndReturnVal = (val: any | ((row: Record<string, any>) => any), data: any, defaultValue?: any) =>
  typeof val === 'function' ? val(data) : val !== undefined ? val : defaultValue !== undefined ? defaultValue : data

defineExpose({
  validateField
})
</script>

<style scoped lang="less">
.form-pro-wrapper {
  .el-form {
    display: flex;
    flex-wrap: wrap;
    gap: var(--items-gap);
    padding: 0 0 8px;
    .el-form-item {
      margin-bottom: 0;
      align-items: flex-start;
      .item-input-wrapper {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  }
  .bottom {
    display: flex;
    margin-top: 20px;
    &.bottom-left {
      justify-content: flex-start;
    }
    &.bottom-center {
      justify-content: flex-center;
    }
    &.bottom-right {
      justify-content: flex-end;
    }
  }
}
</style>
