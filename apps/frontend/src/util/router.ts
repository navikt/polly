/**
 * Compatibility shim with React Router-like helpers backed by next/router.
 *
 * With:     import { useNavigate, useParams, useLocation } from '@/util/router'
 */
import { useRouter } from 'next/router'

type TPath = {
  pathname: string
  search: string
  hash: string
}

type TTo = string | Partial<TPath>

type TNavigateOptions = {
  replace?: boolean
  state?: unknown
}

export type TNavigateFunction = (to: TTo | number, options?: TNavigateOptions) => void

export type TLocation<State = unknown> = {
  pathname: string
  search: string
  hash: string
  state: State
  key: string
}

export const generatePath = (
  path: string,
  params: Record<string, string | number | boolean | null | undefined> = {}
) => {
  const withOptional = path.replace(/\/:([A-Za-z0-9_]+)\?/g, (_segment, key: string) => {
    const value = params[key]
    if (value === undefined || value === null || value === '') {
      return ''
    }
    return `/${encodeURIComponent(String(value))}`
  })

  const withRequired = withOptional.replace(/:([A-Za-z0-9_]+)/g, (_segment, key: string) => {
    const value = params[key]
    if (value === undefined || value === null || value === '') {
      throw new Error(`Missing parameter '${key}' for path '${path}'`)
    }
    return encodeURIComponent(String(value))
  })

  return withRequired.replace(/\/+/g, '/')
}

export function useNavigate(): TNavigateFunction {
  const router = useRouter()

  const normalizeUrl = (to: TTo): string => {
    const pathname = typeof to === 'string' ? to.trim() : (to.pathname ?? '/')
    const search = typeof to === 'string' ? '' : (to.search ?? '')
    const hash = typeof to === 'string' ? '' : (to.hash ?? '')

    const lower = pathname.toLowerCase()
    if (
      lower.startsWith('javascript:') ||
      lower.startsWith('data:') ||
      lower.startsWith('vbscript:')
    ) {
      return '/'
    }

    const normalizedPath =
      pathname.startsWith('/') || pathname.startsWith('?') || pathname.startsWith('#')
        ? pathname
        : `/${pathname}`
    const normalizedSearch = search && !search.startsWith('?') ? `?${search}` : search
    const normalizedHash = hash && !hash.startsWith('#') ? `#${hash}` : hash

    const path = `${normalizedPath}${normalizedSearch}${normalizedHash}`
    // Explicitly encode HTML meta-characters to break XSS taint chain
    return path.replace(/</g, '%3C').replace(/>/g, '%3E').replace(/"/g, '%22').replace(/'/g, '%27')
  }

  const navigate = (to: TTo | number, options?: { replace?: boolean }) => {
    if (typeof to === 'number') {
      if (to === -1) router.back()
      return
    }
    const url = normalizeUrl(to)
    if (options?.replace) {
      router.replace(url)
    } else {
      router.push(url)
    }
  }
  return navigate
}

export function useParams<T extends Record<string, string | undefined>>(): Partial<T> {
  const router = useRouter()
  const safe = Object.fromEntries(
    Object.entries(router.query)
      .filter(([, v]) => typeof v !== 'string' || !/^[a-z][a-z0-9+\-.]*:/i.test(v))
      .map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
  )
  return safe as unknown as Partial<T>
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
  const location: TLocation = {
    pathname,
    search,
    hash,
    state: null as unknown,
    key: 'default',
  }

  return location
}
