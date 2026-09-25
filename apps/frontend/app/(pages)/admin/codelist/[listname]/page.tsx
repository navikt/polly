'use client'

import { useContext } from 'react'
import CodelistPage from '@/components/admin/CodeList/CodelistPage'
import ErrorNotAllowed from '@/components/common/ErrorNotAllowed'
import { IUserContext, UserContext } from '@/provider/userProvider'

const Page = () => {
  const user: IUserContext = useContext(UserContext)

  if (!(user.isAdmin() || user.isSuperUser())) return <ErrorNotAllowed />
  return <CodelistPage />
}

export default Page
