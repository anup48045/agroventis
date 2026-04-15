import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import AuthDebug from '@/components/debug/AuthDebug'
import GoogleTranslate from '@/components/GoogleTranslate'
import Navbar from '@/components/layout/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AgroVentis - Agricultural Marketplace',
  description: 'Connect farmers directly with buyers in your local language',
  icons: {
    icon: '/logo.png',
    apple: '/apple-touch-icon.png',
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#22c55e'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="root">
          <AuthProvider>
            <LanguageProvider>
              {/* <Navbar/> */}
              {children}
              <GoogleTranslate />
              {/* <AuthDebug /> */}
            </LanguageProvider>
          </AuthProvider>
        </div>
        <div id="portal-root"></div>
      </body>
    </html>
  )
}
