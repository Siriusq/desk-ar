<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { createNewLayout, loadLayoutFromFile, resetApplicationState } from '@/composables/useLayout'
import { onMounted, ref } from 'vue'

const fileInput = ref<HTMLInputElement | null>(null)
const openFile = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

onMounted(() => {
  console.log('WelcomePage onMounted: Resetting application state and clearing autosave.')
  // 任何时候只要到达欢迎页面，就清除所有状态和 localStorage
  // 确保从 /main 或 /preview 回来时，会话被彻底清除
  resetApplicationState()
})
</script>

<template>
  <div class="d-flex align-items-center text-bg-light min-vh-100">
    <div class="welcome-container w-100 p-3 mx-auto text-center">
      <h1 class="mb-4">{{ t('welcomeTitle') }}</h1>
      <!--创建新布局-->
      <div class="d-flex flex-column flex-md-row justify-content-center gap-3">
        <BButton size="lg" class="fw-bold w-auto" variant="primary" @click="createNewLayout">
          <i class="bi bi-plus-square"></i>
          {{ t('welcomeCreate') }}
        </BButton>
        <!--从文件打开布局-->
        <BButton size="lg" class="fw-bold w-auto" variant="warning" @click="openFile">
          <i class="bi bi-file-earmark-arrow-up"></i>
          {{ t('welcomeOpen') }}
        </BButton>
        <input
          type="file"
          ref="fileInput"
          @change="loadLayoutFromFile"
          accept=".json"
          class="d-none"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-container {
  max-width: 32em;
}
</style>
