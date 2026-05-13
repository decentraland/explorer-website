import { type ReactNode, useCallback } from 'react'
import { TranslationProvider, useTranslation } from '@dcl/hooks'
import type { LanguageTranslations } from '@dcl/hooks/esm/hooks/useTranslation/useTranslation.type'
import en from './en.json'
import es from './es.json'
import fr from './fr.json'
import ja from './ja.json'
import ko from './ko.json'
import zh from './zh.json'

type SupportedLocale = 'en' | 'es' | 'fr' | 'ja' | 'ko' | 'zh'

const LOCALE_STORAGE_KEY = 'dcl-locale'

const translations: LanguageTranslations = { en, es, fr, ja, ko, zh }

function getInitialLocale(): SupportedLocale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored && stored in translations) {
      return stored as SupportedLocale
    }
  } catch {
    // localStorage unavailable
  }

  try {
    const browserLang = navigator.language?.split('-')[0]
    if (browserLang && browserLang in translations) {
      return browserLang as SupportedLocale
    }
  } catch {
    // navigator unavailable
  }

  return 'en'
}

function LocaleProvider({ children }: { children: ReactNode }) {
  return (
    <TranslationProvider locale={getInitialLocale()} translations={translations} fallbackLocale="en">
      {children}
    </TranslationProvider>
  )
}

function useLocale() {
  const { locale, setLocale: setLocaleInternal } = useTranslation()

  const setLocale = useCallback(
    (newLocale: string) => {
      setLocaleInternal(newLocale)
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
      } catch {
        // localStorage unavailable
      }
    },
    [setLocaleInternal]
  )

  return { locale: locale as SupportedLocale, setLocale }
}

export { LocaleProvider, useLocale }
export type { SupportedLocale }
