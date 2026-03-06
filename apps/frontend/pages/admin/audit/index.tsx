import { AuditPage } from '@/components/admin/audit/AuditPage'
import ErrorNotAllowed from '@/components/common/ErrorNotAllowed'
import { EGroup, user } from '@/service/User'

export default function AdminAuditPage() {
  if (!user.isLoaded()) return null
  if (!(user.hasGroup(EGroup.ADMIN) || user.hasGroup(EGroup.SUPER))) return <ErrorNotAllowed />
  return <AuditPage />
}
