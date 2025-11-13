import { createRouter, createWebHashHistory } from 'vue-router'

import WelcomePage from '@/pages/WelcomePage.vue'
import MainPage from '@/pages/MainPage.vue'
import PreviewPage from '@/pages/PreviewPage.vue'

import { layoutLoaded, loadAutoSaveData } from '@/composables/useLayout'

const routes = [
  // 为所有路由添加 'name'
  { path: '/', name: 'welcome', component: WelcomePage },
  { path: '/main', name: 'main', component: MainPage },
  { path: '/preview', name: 'preview', component: PreviewPage },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  // 确定目标路由是否需要一个已加载的布局
  const requiresLayout = to.name === 'main' || to.name === 'preview'

  if (requiresLayout && !layoutLoaded.value) {
    // 如果需要布局，但状态中未加载 (例如刷新页面)
    // 尝试从 localStorage 加载
    //console.log('Router guard: Layout not loaded, trying auto-save...')
    loadAutoSaveData()
  }

  if (requiresLayout && !layoutLoaded.value) {
    // 如果尝试加载后，状态 *仍然* 是未加载
    // (意味着没有自动保存文件或文件已损坏)
    // 重定向到欢迎页
    // console.log('Router guard: No layout found, redirecting to welcome.')
    next({ name: 'welcome' })
  } else {
    // 允许导航
    next()
  }
})

export default router
