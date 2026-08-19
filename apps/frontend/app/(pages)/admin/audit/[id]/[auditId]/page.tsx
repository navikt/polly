import { AuditPage } from '@/components/admin/audit/AuditPage'
import ErrorNotAllowed from '@/components/common/ErrorNotAllowed'
import { user } from '@/service/User'

const Page = () => {
  if (!(user.isAdmin() || user.isSuper())) return <ErrorNotAllowed />
  return <AuditPage />
}

export default Page
