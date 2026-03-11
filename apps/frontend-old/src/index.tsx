import 'json-diff-kit/dist/viewer.css'
// Ensure Norwegian Bokmål locale is available for moment to remove warning messages locally
import 'moment/locale/nb'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import { Root, createRoot } from 'react-dom/client'
import Main from './main'
import './main.css'

const suppressResizeObserverOverlayOnLocalhost = () => {
  const hostname = window.location.hostname
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
  if (!isLocalhost) {
    return
  }

  const isResizeObserverError = (message: unknown) =>
    typeof message === 'string' &&
    (message.includes('ResizeObserver loop completed with undelivered notifications') ||
      message.includes('ResizeObserver loop limit exceeded'))

  // Prevent the browser from throwing the ResizeObserver loop error by
  // scheduling the callback on the next animation frame.
  // This is a common workaround for react-select / modal layouts in Chromium.
  const NativeResizeObserver: any = (window as any).ResizeObserver

  if (NativeResizeObserver) {
    class ResizeObserverShim {
      private ro: any

      constructor(callback: ResizeObserverCallback) {
        this.ro = new NativeResizeObserver((entries: any, observer: any) => {
          window.requestAnimationFrame(() => {
            callback(entries, observer)
          })
        })
      }

      observe(target: Element, options?: ResizeObserverOptions) {
        this.ro.observe(target, options)
      }

      unobserve(target: Element) {
        this.ro.unobserve(target)
      }

      disconnect() {
        this.ro.disconnect()
      }
    }

    ;(window as any).ResizeObserver = ResizeObserverShim as any
  }

  // Use capture-phase so we get a chance to cancel it as early as possible.
  window.addEventListener(
    'error',
    (event) => {
      const errorEvent = event as ErrorEvent
      if (
        isResizeObserverError(errorEvent.message) ||
        isResizeObserverError(errorEvent.error?.message)
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
      }
    },
    true
  )

  const originalConsoleError = console.error
  console.error = (...args: unknown[]) => {
    if (args.some(isResizeObserverError)) {
      return
    }
    originalConsoleError(...args)
  }
}

suppressResizeObserverOverlayOnLocalhost()

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
