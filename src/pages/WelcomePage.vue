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
  <div class="d-flex align-items-center text-bg-light min-vh-100 welcome-page-bg relative-parent">
    <!--网格背景，暂时隐藏-->
    <!-- <div class="absolute-fill dashed-grid-overlay"></div> -->

    <div class="welcome-container w-100 p-3 mx-auto text-center z-index-content">
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
/* ---------------------------------- */
/* 内容容器样式（保持不变） */
/* ---------------------------------- */
.z-index-content {
  position: relative;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

/* ---------------------------------- */
/* 1. 外部容器：【移除所有渐变和光晕样式】 */
/* ---------------------------------- */
.welcome-page-bg {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;

  /* 基础背景色：保持您的原代码中的 bg-white 效果 */
  background-color: #f8fafc;

  /* 移除：background-image, filter, background-repeat */
  background-image:
    linear-gradient(
      135deg,
      rgba(248, 250, 252, 1) 0%,
      rgba(219, 234, 254, 0.7) 30%,
      rgba(165, 180, 252, 0.5) 60%,
      rgba(129, 140, 248, 0.6) 100%
    ),
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.6) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(199, 210, 254, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(224, 231, 255, 0.3) 0%, transparent 60%);
  filter: none;
}

/* ---------------------------------- */
/* 2. 内部背景层：电路板/网格图案 (保持不变) */
/* ---------------------------------- */
.absolute-fill {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1; /* 位于内容下方 */
}

.dashed-grid-overlay {
  /* 您的新的电路板图案样式 */
  background-image:
    /* 1. 水平实线 (0deg) */
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 19px,
      rgba(75, 85, 99, 0.08) 19px,
      rgba(75, 85, 99, 0.08) 20px,
      transparent 20px,
      transparent 39px,
      rgba(75, 85, 99, 0.08) 39px,
      rgba(75, 85, 99, 0.08) 40px
    ),
    /* 2. 垂直实线 (90deg) */
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 19px,
        rgba(75, 85, 99, 0.08) 19px,
        rgba(75, 85, 99, 0.08) 20px,
        transparent 20px,
        transparent 39px,
        rgba(75, 85, 99, 0.08) 39px,
        rgba(75, 85, 99, 0.08) 40px
      ),
    /* 3. 网格交叉点上的圆点 (小圆点) */
      radial-gradient(circle at 20px 20px, rgba(55, 65, 81, 0.12) 2px, transparent 2px),
    /* 4. 网格中心点上的圆点 (大圆点) */
      radial-gradient(circle at 40px 40px, rgba(55, 65, 81, 0.12) 2px, transparent 2px);

  background-size:
    40px 40px,
    40px 40px,
    40px 40px,
    40px 40px;

  /* 移除所有 mask 相关的属性，因为新的图案不需要 */
  mask-image: none;
  mask-composite: unset;
  -webkit-mask-composite: unset;
}

.welcome-container {
  max-width: 32em;
}
</style>
