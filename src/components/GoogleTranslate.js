'use client'

import { useEffect } from 'react'

export default function GoogleTranslate() {
  useEffect(() => {
    const addScript = document.createElement('script')
    addScript.src =
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    addScript.async = true
    document.body.appendChild(addScript)

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi,bn,te',
        },
        'google_translate_element'
      )
    }
    const removeBanner = () => {
      const iframe = document.querySelector('iframe.goog-te-banner-frame')
      if (iframe) iframe.remove()

      const banner = document.querySelector('.goog-te-banner-frame')
      if (banner) banner.remove()

      document.body.style.top = '0px'
    }

    const interval = setInterval(removeBanner, 300)
    return () => clearInterval(interval)

    
  }, [])

  return <div id="google_translate_element"></div>
}