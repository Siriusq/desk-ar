import { createI18n } from 'vue-i18n'
import en from './en'
import zh from './zh'

/**
 * 从浏览器获取语言并匹配
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
  globalInjection: true,
  messages: {
    en,
    zh,
  },
  warnHtmlMessage: false, // 禁用 HTML 警告
})

export default i18n
