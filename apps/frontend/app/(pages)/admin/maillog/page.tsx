'use client'

import { MailLogPage } from '@/components/admin/maillog/MailLogPage'
import ErrorNotAllowed from '@/components/common/ErrorNotAllowed'
import { EGroup, IUserContext, UserContext } from '@/provider/userProvider'
import { Loader } from '@navikt/ds-react'
import { useContext } from 'react'

const Page = () => {
  const user: IUserContext = useContext(UserContext)

  if (!user.isLoaded())
    return (
      <div className='w-full flex justify-center mt-12'>
        <Loader size='3xlarge' title='Venter...' />
      </div>
    )
  if (!(user.hasGroup(EGroup.ADMIN) || user.hasGroup(EGroup.SUPER))) return <ErrorNotAllowed />
  return <MailLogPage />
}

export default Page
