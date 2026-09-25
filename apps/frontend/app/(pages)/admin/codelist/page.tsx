'use client'

import { Loader } from '@navikt/ds-react'
import { useContext } from 'react'
import CodelistPage from '@/components/admin/CodeList/CodelistPage'
import ErrorNotAllowed from '@/components/common/ErrorNotAllowed'
import { EGroup, IUserContext, UserContext } from '@/provider/userProvider'

const Page = () => {
  const user: IUserContext = useContext(UserContext)

  if (!user.isLoaded())
    return (
      <div className='w-full flex justify-center mt-12'>
        <Loader size='3xlarge' title='Venter...' />
      </div>
    )
  if (!(user.hasGroup(EGroup.ADMIN) || user.hasGroup(EGroup.SUPER))) return <ErrorNotAllowed />
  return <CodelistPage />
}

export default Page
