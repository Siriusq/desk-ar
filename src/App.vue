<script setup lang="ts"></script>

<template>
  <div id="app">
    <!-- 页面切换区域 -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style scoped>
.nav {
  display: flex;
  gap: 16px;
  padding: 8px 16px;
  background: #222;
}

a {
  color: #fff;
  text-decoration: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
