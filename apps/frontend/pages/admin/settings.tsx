import { SettingsPage } from '@/components/admin/settings/SettingsPage'
import ErrorNotAllowed from '@/components/common/ErrorNotAllowed'
import { EGroup, user } from '@/service/User'

export default function AdminSettingsPage() {
  if (!user.isLoaded()) return null
  if (!(user.hasGroup(EGroup.ADMIN) || user.hasGroup(EGroup.SUPER))) return <ErrorNotAllowed />
  return <SettingsPage />
}
