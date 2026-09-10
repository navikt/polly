'use client'

import CodelistPage from '@/components/admin/CodeList/CodelistPage'
import ErrorNotAllowed from '@/components/common/ErrorNotAllowed'
import { IUserContext, UserContext } from '@/service/User'
import { useContext } from 'react'

const Page = () => {
  const user: IUserContext = useContext(UserContext)

  if (!(user.isAdmin() || user.isSuperUser())) return <ErrorNotAllowed />
  return <CodelistPage />
}

export default Page
