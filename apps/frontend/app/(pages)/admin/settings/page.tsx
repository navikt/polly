'use client'

import { SettingsPage } from '@/components/admin/settings/SettingsPage'
import ErrorNotAllowed from '@/components/common/ErrorNotAllowed'
import { EGroup, IUserContext, UserContext } from '@/service/User'
import { useContext } from 'react'

const Page = () => {
  const user: IUserContext = useContext(UserContext)

  if (!user.isLoaded()) return null
  if (!(user.hasGroup(EGroup.ADMIN) || user.hasGroup(EGroup.SUPER))) return <ErrorNotAllowed />
  return <SettingsPage />
}

export default Page
