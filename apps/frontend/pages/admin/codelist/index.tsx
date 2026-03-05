import CodelistPage from '@/components/admin/CodeList/CodelistPage'
import ErrorNotAllowed from '@/components/common/ErrorNotAllowed'
import { user } from '@/service/User'

export default function AdminCodelistPage() {
  if (!(user.isAdmin() || user.isSuper())) return <ErrorNotAllowed />
  return <CodelistPage />
}
