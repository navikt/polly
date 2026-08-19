import { getPolicy } from '@/api/GetAllApi'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function PolicyRedirect() {
  const router = useRouter()
  const { id } = router.query as { id: string }

  useEffect(() => {
    if (!id) return
    getPolicy(id).then((policy) => {
      router.replace(`/process/purpose/${policy.purposes[0].code}/${policy.process.id}`)
    })
  }, [id, router])

  return null
}
