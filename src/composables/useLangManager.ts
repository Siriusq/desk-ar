import { ref, computed } from 'vue'
import { translations, fallbackLocale, supportedLocales, type Locale } from '@/utils/i18n'

// 从浏览器获取语言并匹配
function getInitialLocale(): Locale {
  const browserLang = navigator.language.split('-')[0]!.toLowerCase()

  if (supportedLocales.includes(browserLang as Locale)) {
    return browserLang as Locale
  }

  return fallbackLocale
}

// 当前语言
const currentLocale = ref<Locale>(getInitialLocale())

export function useI18n() {
  // 翻译函数t，根据当前语言查找文本
  const t = (key: keyof (typeof translations)['en']) => {
    // 优先使用当前语言的文本
    if (translations[currentLocale.value] && translations[currentLocale.value][key]) {
      return translations[currentLocale.value][key]
    }

    // 回退到默认语言
    return translations[fallbackLocale][key] || key
  }

  // 切换语言
  const setLocale = (locale: Locale) => {
    if (supportedLocales.includes(locale)) {
      currentLocale.value = locale
    } else {
      console.warn(`Unsupported locale: ${locale}`)
    }
  }

  return {
    t,

    locale: computed(() => currentLocale.value),
    setLocale,

    // 支持的语言
    supportedLocales,
  }
}
