import CodelistPage from '@/components/admin/CodeList/CodelistPage'
import ErrorNotAllowed from '@/components/common/ErrorNotAllowed'
import { user } from '@/service/User'

const Page = () => {
  if (!(user.isAdmin() || user.isSuper())) return <ErrorNotAllowed />
  return <CodelistPage />
}

export default Page
