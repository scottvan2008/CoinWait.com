import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"

export function useTranslationLoader() {
  const { i18n } = useTranslation()
  const [isLoaded, setIsLoaded] = useState(i18n.isInitialized)
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language)

  useEffect(() => {
    const handleLanguageChanged = (lang: string) => {
      setCurrentLanguage(lang)
    }

    if (!isLoaded) {
      i18n.on("initialized", () => setIsLoaded(true))
    }

    i18n.on("languageChanged", handleLanguageChanged)

    return () => {
      i18n.off("initialized", () => setIsLoaded(true))
      i18n.off("languageChanged", handleLanguageChanged)
    }
  }, [i18n, isLoaded])

  return { isLoaded, currentLanguage }
}

