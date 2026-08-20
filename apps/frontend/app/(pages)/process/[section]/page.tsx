import { getProcess } from '@/api/GetAllApi'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default function ProcessSectionOrRedirect() {
  const router = useRouter()
  const { section } = router.query as { section: string }

  useEffect(() => {
    if (!section || !UUID_RE.test(section)) return
    getProcess(section).then((process) => {
      router.replace(`/process/purpose/${process.purposes[0].code}/${process.id}`)
    })
  }, [section, router])

  // If it's a UUID we're redirecting; otherwise this path depth is not a real page.
  return null
}
