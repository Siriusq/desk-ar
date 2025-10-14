import { createRouter, createWebHistory } from 'vue-router'

import WelcomePage from '@/pages/WelcomePage.vue'
import MainPage from '@/pages/MainPage.vue'
import PreviewPage from '@/pages/PreviewPage.vue'

const routes = [
  { path: '/', component: WelcomePage },
  { path: '/main', component: MainPage },
  { path: '/preview', component: PreviewPage },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.name === 'main' && from.name !== 'welcome') {
    next('/') // 未从欢迎页来则重定向
  } else {
    next()
  }
})

export default router
