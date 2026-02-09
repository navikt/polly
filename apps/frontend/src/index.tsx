import 'json-diff-kit/dist/viewer.css'
// Ensure Norwegian Bokmål locale is available for moment to remove warning messages locally
import 'moment/locale/nb'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import { Root, createRoot } from 'react-dom/client'
import Main from './main'
import './main.css'

const container: HTMLElement | null = document.getElementById('root')
if (container) {
  const root: Root = createRoot(container)
  root.render(<Main />)
}
