<script setup lang="ts">
import { BApp } from 'bootstrap-vue-next'
import { isLoading } from '@/composables/useUIState'
</script>

<template>
  <div id="app">
    <BApp>
      <BOverlay :show="isLoading">
        <!-- 页面切换区域 -->
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </BOverlay>
    </BApp>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
