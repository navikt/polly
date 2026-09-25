'use client'
import { Loader } from '@navikt/ds-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { getDisclosure } from '@/api/DisclosureApi'

const Page = () => {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    getDisclosure(id).then((disclosure) => {
      router.replace(`/thirdparty/${disclosure.recipient.code}/disclosure/${id}`)
    })
  }, [id, router])

  return <Loader />
}

export default Page
