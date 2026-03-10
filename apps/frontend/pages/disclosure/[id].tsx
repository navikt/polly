import { getDisclosure } from '@/api/GetAllApi'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function DisclosureRedirect() {
  const router = useRouter()
  const { id } = router.query as { id: string }

  useEffect(() => {
    if (!id) return
    getDisclosure(id).then((disclosure) => {
      router.replace(`/thirdparty/${disclosure.recipient.code}/disclosure/${id}`)
    })
  }, [id, router])

  return null
}
