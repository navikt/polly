import { SettingsPage } from '@/components/admin/settings/SettingsPage'
import ErrorNotAllowed from '@/components/common/ErrorNotAllowed'
import { user } from '@/service/User'

export default function AdminSettingsPage() {
  if (!(user.isAdmin() || user.isSuper())) return <ErrorNotAllowed />
  return <SettingsPage />
}
