import CodelistPage from '@/components/admin/CodeList/CodelistPage'
import ErrorNotAllowed from '@/components/common/ErrorNotAllowed'
import { EGroup, user } from '@/service/User'

export default function AdminCodelistPage() {
  if (!user.isLoaded()) return null
  if (!(user.hasGroup(EGroup.ADMIN) || user.hasGroup(EGroup.SUPER))) return <ErrorNotAllowed />
  return <CodelistPage />
}
