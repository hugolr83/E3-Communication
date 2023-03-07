import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

const Languages = ['en', 'fr', 'de']

const options = {
  order: ['cookie', 'localStorage'],
  caches: ['cookie', 'localStorage']
}

export default i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: options,
    fallbackLng: 'en',
    debug: true,
    whitelist: Languages,
    interpolation: {
      escapeValue: false
    }
  })
