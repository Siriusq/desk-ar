<script setup lang="ts">
import { computed } from 'vue'

// 控制 Modal 的显示状态
const props = defineProps<{
  modelValue: boolean
}>()

// 通知父组件状态已更改
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

// 桥接 props 和 emit
const showModal = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    // 关闭
    emit('update:modelValue', value)
  },
})

// 关闭函数
const closeHelpModal = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <BModal v-model="showModal" title="帮助说明" size="lg" scrollable>
    <p>一些帮助。</p>

    <template #footer>
      <BButton variant="secondary" @click="closeHelpModal">我知道了</BButton>
    </template>
  </BModal>
</template>
