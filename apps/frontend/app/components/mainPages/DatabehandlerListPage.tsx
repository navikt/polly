'use client'

import { PlusCircleIcon } from '@navikt/aksel-icons'
import { Button, Heading, Loader } from '@navikt/ds-react'
import { useContext, useEffect, useState } from 'react'
import {
  convertDatabehandlerToFormValues,
  createDatabehandler,
  getDatabehandlereByPageAndPageSize,
} from '@/api/DatabehandlerApi'
import { getAll } from '@/api/GetAllApi'
import { IDatabehandler, IDatabehandlerFormValues } from '@/constants'
import { IUserContext, UserContext } from '@/provider/userProvider'
import { useNavigate } from '@/util/router'
import DatabehandlerModal from '../Databehandler/DatabehandlerModal'
import AlphabeticList from '../common/AlphabeticList'

const DatabehandlerListPage = () => {
  const user: IUserContext = useContext(UserContext)

  const [databehandlere, setDatabehandlere] = useState<IDatabehandler[]>([])
  const [showCreateDatabehandlerModal, setShowCreateDatabehandlerModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [modalErrorMessage, setModalErrorMessage] = useState<string>()
  const navigate = useNavigate()
  const hasAccess = () => user.canWrite()

  const handleCreateDatabehandler = (databehandler: IDatabehandlerFormValues) => {
    if (!databehandler) return
    try {
      ;(async () => {
        const newDatabehandler = await createDatabehandler(databehandler)
        navigate(`/databehandler/${newDatabehandler.id}`)
      })()
      setShowCreateDatabehandlerModal(false)
    } catch (error: any) {
      setModalErrorMessage(error.response.data.message)
    }
  }

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const res = await getAll(getDatabehandlereByPageAndPageSize)()
      if (res) {
        setDatabehandlere(res)
      }
      setIsLoading(false)
    })()
  }, [])

  return (
    <>
      {isLoading && (
        <div className='flex w-full justify-center'>
          <Loader size='3xlarge' />
        </div>
      )}
      {!isLoading && (
        <>
          <Heading size='large'>Databehandlere</Heading>
          <div className='flex w-full justify-end'>
            <div className='mt-auto'>
              {hasAccess() && (
                <Button
                  variant='secondary'
                  icon={
                    <span className='flex items-center leading-none'>
                      <PlusCircleIcon aria-hidden className='block' />
                    </span>
                  }
                  onClick={() => setShowCreateDatabehandlerModal(true)}
                >
                  Opprett ny databehandler
                </Button>
              )}
            </div>
          </div>
          <div>
            <AlphabeticList
              items={databehandlere.map((value) => {
                return { id: value.id, label: value.navn }
              })}
              baseUrl={'/databehandler/'}
              columns={1}
            />
          </div>
          <DatabehandlerModal
            title='Opprett ny databehandler'
            isOpen={showCreateDatabehandlerModal}
            initialValues={convertDatabehandlerToFormValues({})}
            submit={handleCreateDatabehandler}
            errorMessage={modalErrorMessage}
            onClose={() => setShowCreateDatabehandlerModal(false)}
          />
        </>
      )}
    </>
  )
}

export default DatabehandlerListPage
