<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { createNewLayout, loadLayoutFromFile, resetApplicationState } from '@/composables/useLayout'
import { onMounted, ref } from 'vue'

// 打开文件
const fileInput = ref<HTMLInputElement | null>(null)
const openFile = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

onMounted(() => {
  //console.log('WelcomePage onMounted: Resetting application state and clearing autosave.')
  // 任何时候只要到达欢迎页面，就清除所有状态和 localStorage
  // 确保从 /main 或 /preview 回来时，会话被彻底清除
  resetApplicationState()
})
</script>

<template>
  <div class="d-flex align-items-center text-bg-light min-vh-100 relative-parent">
    <!-- GitHub 角标 -->
    <a
      href="https://github.com/Siriusq/desk-ar"
      class="github-corner"
      aria-label="View source on GitHub"
      ><svg
        width="80"
        height="80"
        viewBox="0 0 250 250"
        style="fill: #151513; color: #fff; position: absolute; top: 0; border: 0; right: 0"
        aria-hidden="true"
      >
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
        <path
          d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
          fill="currentColor"
          style="transform-origin: 130px 106px"
          class="octo-arm"
        />
        <path
          d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
          fill="currentColor"
          class="octo-body"
        /></svg
    ></a>

    <!--网格背景-->
    <div class="absolute-fill dashed-grid-overlay"></div>

    <div class="welcome-container w-100 p-3 mx-auto text-center z-index-content">
      <h1 class="mb-4 mt-3">{{ t('welcomeTitle') }}</h1>
      <!--创建新布局-->
      <div class="d-flex flex-column flex-md-row justify-content-center gap-3 mb-3">
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

  <footer class="footer text-center w-100 py-2">
    <small>
      Desk-AR © 2025 Siriusq · Built with Vue&nbsp;3 ·
      <a href="https://github.com/Siriusq/desk-ar" target="_blank" rel="noopener">
        Open&nbsp;Source&nbsp;on&nbsp;GitHub
      </a>
    </small>
  </footer>
</template>

<style scoped>
/* ---------------------------------- */
/* 内容容器样式 */
/* ---------------------------------- */
.z-index-content {
  position: relative;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

/* ---------------------------------- */
/* 渐变背景 */
/* ---------------------------------- */
.welcome-page-bg {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;

  /* 基础背景色 */
  background-color: #f8fafc;

  /* 渐变色背景 */
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
/* 背景网格图案 */
/* ---------------------------------- */
.absolute-fill {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1; /* 位于内容下方 */
}

/* 网格图案，源自 https://patterncraft.fun/ */
.dashed-grid-overlay {
  background-image:
    /* 水平实线 (0deg) */
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
    /* 垂直实线 (90deg) */
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
    /* 网格交叉点上的圆点 (小圆点) */
      radial-gradient(circle at 20px 20px, rgba(55, 65, 81, 0.12) 2px, transparent 2px),
    /* 网格中心点上的圆点 (大圆点) */
      radial-gradient(circle at 40px 40px, rgba(55, 65, 81, 0.12) 2px, transparent 2px);

  background-size:
    40px 40px,
    40px 40px,
    40px 40px,
    40px 40px;

  mask-image: none;
  mask-composite: unset;
  -webkit-mask-composite: unset;
}

.welcome-container {
  max-width: 32em;
  align-content: center;
}

/* GitHub 角标样式 */
.github-corner {
  z-index: 10;
}
.github-corner:hover .octo-arm {
  animation: octocat-wave 560ms ease-in-out;
}
@keyframes octocat-wave {
  0%,
  100% {
    transform: rotate(0);
  }
  20%,
  60% {
    transform: rotate(-25deg);
  }
  40%,
  80% {
    transform: rotate(10deg);
  }
}
@media (max-width: 500px) {
  .github-corner:hover .octo-arm {
    animation: none;
  }
  .github-corner .octo-arm {
    animation: octocat-wave 560ms ease-in-out;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  color: rgba(0, 0, 0, 0.6);
  background: transparent;
  z-index: 20;
  font-size: 0.9rem;
  pointer-events: none; /* 不挡按钮点击 */
}

.footer a {
  color: inherit;
  text-decoration: underline;
  pointer-events: auto; /* 链接可点击 */
}

.footer a:hover {
  color: #007bff;
}
</style>
