<script setup lang="ts">
import SceneCanvas from '@/components/SceneCanvas.vue'
import EditorPanel from '@/components/EditorPanel.vue'
</script>

<template>
  <div class="canvas-container">
    <SceneCanvas></SceneCanvas>
    <EditorPanel></EditorPanel>
  </div>
</template>

<style scoped>
.canvas-container {
  /* 确保容器占据整个所需的空间 */
  width: 100vw; /* 示例：占据视口宽度 */
  height: 100vh; /* 示例：占据视口高度 */
  position: relative; /* 关键：设置定位上下文 */
}
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
button {
  margin-top: 20px;
  padding: 10px 20px;
}
</style>
