import { getPolicy } from '@/api/GetAllApi'
import { Loader } from '@navikt/ds-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Page = () => {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (!id) return
    getPolicy(id).then((policy) => {
      router.replace(`/process/purpose/${policy.purposes[0].code}/${policy.process.id}`)
    })
  }, [id, router])

  return <Loader />
}

export default Page
