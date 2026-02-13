import 'json-diff-kit/dist/viewer.css'
// Ensure Norwegian Bokmål locale is available for moment to remove warning messages locally
import 'moment/locale/nb'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import { Root, createRoot } from 'react-dom/client'
import Main from './main'
import './main.css'

const cacheBustFavicon = () => {
  const mainScriptSrc = Array.from(document.scripts)
    .map((s) => s.src)
    .find((src) => /\/static\/js\/main\.[a-f0-9]+\.js$/i.test(src))

  const buildHash = mainScriptSrc?.match(/main\.([a-f0-9]+)\.js$/i)?.[1]
  if (!buildHash) return

  const links = Array.from(
    document.querySelectorAll<HTMLLinkElement>('link[rel="icon"], link[rel="shortcut icon"]')
  )

  for (const link of links) {
    const baseHref = link.href.split('?')[0]
    link.href = `${baseHref}?v=${buildHash}`
  }
}

cacheBustFavicon()

const container: HTMLElement | null = document.getElementById('root')
if (container) {
  const root: Root = createRoot(container)
  root.render(<Main />)
}
