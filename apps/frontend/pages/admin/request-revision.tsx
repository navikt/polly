import { RequestRevisionPage } from '@/components/admin/revision/RequestRevisionPage'
import ErrorNotAllowed from '@/components/common/ErrorNotAllowed'
import { EGroup, user } from '@/service/User'

export default function AdminRequestRevisionPage() {
  if (!user.isLoaded()) return null
  if (!(user.hasGroup(EGroup.ADMIN) || user.hasGroup(EGroup.SUPER))) return <ErrorNotAllowed />
  return <RequestRevisionPage />
}
