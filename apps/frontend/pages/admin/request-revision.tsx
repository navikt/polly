import { RequestRevisionPage } from '@/components/admin/revision/RequestRevisionPage'
import ErrorNotAllowed from '@/components/common/ErrorNotAllowed'
import { user } from '@/service/User'

export default function AdminRequestRevisionPage() {
  if (!(user.isAdmin() || user.isSuper())) return <ErrorNotAllowed />
  return <RequestRevisionPage />
}
