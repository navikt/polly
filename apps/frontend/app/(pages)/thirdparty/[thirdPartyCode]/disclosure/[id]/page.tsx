'use client'

import { getDisclosure } from '@/api/GetAllApi'
import { IDisclosure } from '@/constants'
import { Loader } from '@navikt/ds-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Page = () => {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (!id) return
    getDisclosure(id).then((disclosure: IDisclosure) => {
      router.replace(`/thirdparty/${disclosure.recipient.code}/disclosure/${id}`)
    })
  }, [id, router])
  return <Loader />
}

export default Page
