import 'json-diff-kit/dist/viewer.css'
// Ensure Norwegian Bokmål locale is available for moment to remove warning messages locally
import 'moment/locale/nb'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import { Root, createRoot } from 'react-dom/client'
import Main from './main'
import './main.css'

const setFaviconForHostname = () => {
  const hostname = window.location.hostname
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
  const isDev = hostname.endsWith('.dev.nav.no')

  const faviconFilename = isLocalhost
    ? 'favicon_Behandlingskatalog_localhost.ico'
    : isDev
      ? 'favicon_Behandlingskatalog_dev.ico'
      : 'favicon_Behandlingskatalog_prod.ico'

  const link = document.querySelector<HTMLLinkElement>('link[rel~="icon"]')
  if (!link) return

  const publicUrl = (process.env.PUBLIC_URL || '').replace(/\/$/, '')
  link.href = `${publicUrl}/${faviconFilename}`
}

setFaviconForHostname()

const container: HTMLElement | null = document.getElementById('root')
if (container) {
  const root: Root = createRoot(container)
  root.render(<Main />)
}
