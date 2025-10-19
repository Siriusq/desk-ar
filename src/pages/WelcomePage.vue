<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <div class="d-flex align-items-center text-bg-light min-vh-100">
    <div class="welcome-container w-100 p-3 mx-auto text-center">
      <h1 class="mb-4">{{ t('welcomeTitle') }}</h1>
      <!--创建新布局-->
      <div class="d-flex flex-column flex-md-row justify-content-center gap-3">
        <BButton size="lg" class="fw-bold w-auto" variant="primary" @click="$router.push('/main')">
          <i class="bi bi-plus-square"></i>
          {{ t('welcomeCreate') }}
        </BButton>
        <!--从文件打开布局-->
        <BButton size="lg" class="fw-bold w-auto" variant="warning" @click="$router.push('/main')">
          <i class="bi bi-file-earmark-arrow-up"></i>
          {{ t('welcomeOpen') }}
        </BButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-container {
  max-width: 32em;
}
</style>
