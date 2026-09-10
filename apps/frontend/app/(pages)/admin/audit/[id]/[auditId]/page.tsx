'use client'

import { AuditPage } from '@/components/admin/audit/AuditPage'
import ErrorNotAllowed from '@/components/common/ErrorNotAllowed'
import { IUserContext, UserContext } from '@/service/User'
import { useContext } from 'react'

const Page = () => {
  const user: IUserContext = useContext(UserContext)

  if (!(user.isAdmin() || user.isSuperUser())) return <ErrorNotAllowed />
  return <AuditPage />
}

export default Page
