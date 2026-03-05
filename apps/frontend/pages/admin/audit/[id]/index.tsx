import { AuditPage } from '@/components/admin/audit/AuditPage'
import ErrorNotAllowed from '@/components/common/ErrorNotAllowed'
import { user } from '@/service/User'

export default function AdminAuditIdPage() {
  if (!(user.isAdmin() || user.isSuper())) return <ErrorNotAllowed />
  return <AuditPage />
}
