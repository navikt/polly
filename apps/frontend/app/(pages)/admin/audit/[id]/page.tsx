'use client'

import { AuditPage } from '@/components/admin/audit/AuditPage'
import ErrorNotAllowed from '@/components/common/ErrorNotAllowed'
import { EGroup, IUserContext, UserContext } from '@/provider/userProvider'
import { useContext } from 'react'

const Page = () => {
  const user: IUserContext = useContext(UserContext)

  if (!user.isLoaded()) return null
  if (!(user.hasGroup(EGroup.ADMIN) || user.hasGroup(EGroup.SUPER))) return <ErrorNotAllowed />
  return <AuditPage />
}

export default Page
