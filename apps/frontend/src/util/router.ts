/**
 * Compatibility shim so existing components that import from 'react-router'
 * can be pointed here instead, with equivalent hooks backed by next/router.
 *
 * Replace:  import { useNavigate, useParams, useLocation } from 'react-router'
 * With:     import { useNavigate, useParams, useLocation } from '@/util/router'
 */
import { useRouter } from 'next/router'
import type { NavigateFunction, To } from 'react-router'

// Types are re-exported from react-router so callers get the same shapes.
export { generatePath } from 'react-router'
export type { Location, NavigateFunction } from 'react-router'

export function useNavigate(): NavigateFunction {
  const router = useRouter()
  const navigate = (to: To | number, options?: { replace?: boolean }) => {
    if (typeof to === 'number') {
      if (to === -1) router.back()
      return
    }
    const url = typeof to === 'string' ? to : (to.pathname ?? '/')
    if (options?.replace) {
      router.replace(url)
    } else {
      router.push(url)
    }
  }
  return navigate as unknown as NavigateFunction
}

export function useParams<T extends Record<string, string | undefined>>(): Partial<T> {
  const router = useRouter()
  return router.query as unknown as Partial<T>
}

export function useLocation() {
  const router = useRouter()
  const asPath = router.asPath
  const hashIdx = asPath.indexOf('#')
  const withoutHash = hashIdx >= 0 ? asPath.substring(0, hashIdx) : asPath
  const hash = hashIdx >= 0 ? asPath.substring(hashIdx) : ''
  const qIdx = withoutHash.indexOf('?')
  const pathname = qIdx >= 0 ? withoutHash.substring(0, qIdx) : withoutHash
  const search = qIdx >= 0 ? withoutHash.substring(qIdx) : ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return {
    pathname,
    search,
    hash,
    state: null as unknown,
    key: 'default',
    unstable_mask: undefined as any,
  }
}
