import { MailLogPage } from '@/components/admin/maillog/MailLogPage'
import ErrorNotAllowed from '@/components/common/ErrorNotAllowed'
import { user } from '@/service/User'

export default function AdminMaillogPage() {
  if (!(user.isAdmin() || user.isSuper())) return <ErrorNotAllowed />
  return <MailLogPage />
}
