'use client'

import { getProcess } from '@/api/GetAllApi'
import { Loader } from '@navikt/ds-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const BNummer_RE = /[0-9]*/i
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const Page = () => {
  const router = useRouter()
  const { section } = useParams<{ section: string }>()

  useEffect(() => {
    if (!section || !UUID_RE.test(section) || !BNummer_RE.test(section)) return
    getProcess(section).then((process) => {
      router.replace(`/process/purpose/${process.purposes[0].code}/${process.id}`)
    })
  }, [section, router])

  return <Loader />
}

export default Page
