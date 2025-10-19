// src/i18n/index.ts
import { createI18n } from 'vue-i18n'
import en from './en'
import zh from './zh'

/**
 * 从浏览器获取语言并匹配
 * (这替换了您的 useLangManager.ts 中的 getInitialLocale)
 */
function getInitialLocale(): 'zh' | 'en' {
  const browserLang = navigator.language.split('-')[0]?.toLowerCase()

  if (browserLang === 'zh') {
    return 'zh'
  }

  // 默认为 'en'
  return 'en'
}

const i18n = createI18n({
  legacy: false, // 必须设置, 使用 Composition API
  locale: getInitialLocale(), // 自动设置语言
  fallbackLocale: 'en', // 回退语言
  messages: {
    en,
    zh,
  },
})

export default i18n
