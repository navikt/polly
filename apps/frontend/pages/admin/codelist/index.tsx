import CodelistPage from '@/components/admin/CodeList/CodelistPage'
import ErrorNotAllowed from '@/components/common/ErrorNotAllowed'
import { EGroup, user } from '@/service/User'
import { Loader } from '@navikt/ds-react'

export default function AdminCodelistPage() {
  if (!user.isLoaded())
    return (
      <div className="w-full flex justify-center mt-12">
        <Loader size="3xlarge" title="Venter..." />
      </div>
    )
  if (!(user.hasGroup(EGroup.ADMIN) || user.hasGroup(EGroup.SUPER))) return <ErrorNotAllowed />
  return <CodelistPage />
}
