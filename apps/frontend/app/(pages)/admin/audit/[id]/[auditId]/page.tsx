'use client'

import { useContext } from 'react'
import { AuditPage } from '@/components/admin/audit/AuditPage'
import ErrorNotAllowed from '@/components/common/ErrorNotAllowed'
import { IUserContext, UserContext } from '@/provider/userProvider'

const Page = () => {
  const user: IUserContext = useContext(UserContext)

  if (!(user.isAdmin() || user.isSuperUser())) return <ErrorNotAllowed />
  return <AuditPage />
}

export default Page
