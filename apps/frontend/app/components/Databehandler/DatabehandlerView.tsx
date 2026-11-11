'use client'

import { DocPencilIcon, TrashIcon } from '@navikt/aksel-icons'
import { BodyShort, Heading, Loader } from '@navikt/ds-react'
import { useParams } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { CodelistContext } from '@/provider/kodeverkProvider'
import { IUserContext, UserContext } from '@/provider/userProvider'
import { TNavigateFunction, useNavigate } from '@/util/router'
import {
  convertDatabehandlerToFormValues,
  deleteDatabehandler,
  getDatabehandler,
  updateDatabehandler,
} from '../../api/DatabehandlerApi'
// TODO: databehandler (getProcessesByProcessor)
import { getProcessesByProcessor, getResourceById, getResourcesByIds } from '../../api/GetAllApi'
import {
  IDatabehandler,
  IDatabehandlerFormValues,
  IPageResponse,
  IProcess,
  ITeamResource,
  TRANSFER_GROUNDS_OUTSIDE_EU_OTHER,
} from '../../constants'
import { lastModifiedDate } from '../../util/date-formatter'
import { shortenLinksInText } from '../../util/helper-functions'
import {
  CONFLICT_MESSAGE,
  getConflictAwareErrorMessage,
  isConflictError,
} from '../../util/optimisticLocking'
import Button from '../common/Button/CustomButton'
import DataText from '../common/DataText'
import { boolToText } from '../common/Radio'
import DatabehandlerModal from './DatabehandlerModal'
import { DeleteDatabehandlerModal } from './DeleteDatabehandlerModal'
import RelatedProcessesTable from './components/RelatedProcessesTable'

const DatabehandlerView = () => {
  const user: IUserContext = useContext(UserContext)
  const { utils: codelistUtils } = useContext(CodelistContext)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [currentDatabehandler, setCurrentDatabehandler] = useState<IDatabehandler>()
  const [relatedProcesses, setRelatedProcess] = useState<IProcess[]>([])
  const [showEditDatabehandlerModal, setShowEditDatabehandlerModal] = useState<boolean>(false)
  const [showDeleteDatabehandlerModal, setShowDeleteDatabehandlerModal] = useState<boolean>(false)
  const [avtaleeier, setAvtaleeier] = useState<ITeamResource>()
  const [fagansvarlig, setFagansvarlig] = useState<ITeamResource[]>([])
  const [modalErrorMessage, setModalErrorMessage] = useState<string>()
  const [usageCount, setUsageCount] = useState<number>(0)

  const hasAccess = (): boolean => user.canWrite()
  const navigate: TNavigateFunction = useNavigate()
  const params: Readonly<
    Partial<{
      id?: string
    }>
  > = useParams<{ id?: string }>()

  useEffect(() => {
    ;(async () => {
      if (params.id && showDeleteDatabehandlerModal) {
        const response: IPageResponse<IProcess> = await getProcessesByProcessor(params.id)
        setUsageCount(response.numberOfElements)
      }
    })()
  }, [showDeleteDatabehandlerModal])

  const handleEditDatabehandler = (databehandler: IDatabehandlerFormValues) => {
    if (!databehandler) return
    ;(async () => {
      try {
        const newDatabehandler = await updateDatabehandler(databehandler)
        setIsLoading(true)
        setCurrentDatabehandler(await getDatabehandler(newDatabehandler.id))
        setIsLoading(false)
        setModalErrorMessage('')
        setShowEditDatabehandlerModal(false)
      } catch (error: any) {
        if (isConflictError(error)) {
          // Optimistisk låsing: databehandleren er endret av en annen bruker.
          // Hent inn gjeldende data på nytt i stedet for å overskrive i stillhet.
          setModalErrorMessage(CONFLICT_MESSAGE)
          if (params.id) {
            setCurrentDatabehandler(await getDatabehandler(params.id))
          }
          return
        }
        setModalErrorMessage(getConflictAwareErrorMessage(error))
      }
    })()
  }

  const handleDeleteDatabehandler = async (databehandler: IDatabehandler) => {
    try {
      await deleteDatabehandler(databehandler.id)
      navigate('/databehandler/')
      return true
    } catch (error: any) {
      setModalErrorMessage(error.response.data.message)
      setShowDeleteDatabehandlerModal(true)
      return false
    }
  }

  useEffect(() => {
    ;(async () => {
      if (params.id) {
        setIsLoading(true)
        setCurrentDatabehandler(await getDatabehandler(params.id))
        setRelatedProcess((await getProcessesByProcessor(params.id)).content)
        setIsLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      if (currentDatabehandler?.avtaleeier) {
        setIsLoading(true)
        setAvtaleeier(await getResourceById(currentDatabehandler?.avtaleeier))
        setIsLoading(false)
      }
      if (currentDatabehandler?.fagansvarlig) {
        setIsLoading(true)
        setFagansvarlig(await getResourcesByIds(currentDatabehandler.fagansvarlig))
        setIsLoading(false)
      }
    })()
  }, [currentDatabehandler])

  return (
    <>
      <div className='flex w-full justify-between'>
        <Heading size='large' level='3'>
          {currentDatabehandler?.navn}
        </Heading>
        <div className='mt-auto'>
          {hasAccess() && (
            <>
              <Button
                kind='outline'
                icon={
                  <span className='flex items-center leading-none'>
                    <DocPencilIcon aria-hidden className='block' />
                  </span>
                }
                onClick={() => setShowEditDatabehandlerModal(true)}
              >
                Redigér
              </Button>
              <Button
                kind='outline'
                icon={
                  <span className='flex items-center leading-none'>
                    <TrashIcon aria-hidden className='block' />
                  </span>
                }
                onClick={() => {
                  setShowDeleteDatabehandlerModal(true)
                }}
                marginLeft={true}
              >
                Slett
              </Button>
            </>
          )}
        </div>
      </div>
      {isLoading && (
        <div className='flex w-full justify-center'>
          <Loader size='3xlarge' />
        </div>
      )}
      {!isLoading && currentDatabehandler && (
        <>
          <div>
            <DataText label='Referanse til databehandleravtale'>
              {currentDatabehandler.avtalereferanse
                ? shortenLinksInText(currentDatabehandler.avtalereferanse)
                : 'Ikke utfylt'}
            </DataText>
            <DataText
              label='Avtaleeier'
              text={currentDatabehandler.avtaleeier && avtaleeier?.fullName}
            />
            <DataText
              label='Fagansvarlig'
              text={
                currentDatabehandler.fagansvarlig.length > 0 &&
                fagansvarlig.map((r) => r.fullName).join(', ')
              }
            />
            <DataText label='Merknad' text={currentDatabehandler.merknad} />
            <DataText
              label='Behandler databehandler personopplysninger utenfor EU/EØS?'
              text={boolToText(currentDatabehandler.behandlingUtenforEuEos)}
            />
            {currentDatabehandler.behandlingUtenforEuEos && (
              <>
                <DataText
                  label='Overføringsgrunnlag for behandling utenfor EU/EØS'
                  text={currentDatabehandler.overforingsgrunnlagUtenforEuEos?.shortName}
                />

                {currentDatabehandler.overforingsgrunnlagUtenforEuEos?.code ===
                  TRANSFER_GROUNDS_OUTSIDE_EU_OTHER && (
                  <DataText
                    label='Andre overføringsgrunnlag'
                    text={currentDatabehandler.overforingsgrunnlagUtenforEuEosAnnet}
                  />
                )}
                <DataText
                  label='Land'
                  text={
                    currentDatabehandler.landDataOverforesTil &&
                    currentDatabehandler.landDataOverforesTil?.length > 0 &&
                    currentDatabehandler.landDataOverforesTil
                      ?.map((country) => codelistUtils.countryName(country))
                      .join(', ')
                  }
                />
              </>
            )}
          </div>
          <div className='flex mb-4 justify-end'>
            {currentDatabehandler.changeStamp && (
              <BodyShort size='small'>
                {`Sist endret av ${currentDatabehandler.changeStamp.lastModifiedBy}, ${lastModifiedDate(currentDatabehandler.changeStamp?.lastModifiedDate)}`}
              </BodyShort>
            )}
          </div>
          <DatabehandlerModal
            title='Redigér Databehandler'
            isOpen={showEditDatabehandlerModal}
            initialValues={convertDatabehandlerToFormValues(currentDatabehandler)}
            submit={handleEditDatabehandler}
            errorMessage={modalErrorMessage}
            onClose={() => setShowEditDatabehandlerModal(false)}
          />
          <DeleteDatabehandlerModal
            isOpen={showDeleteDatabehandlerModal}
            databehandler={currentDatabehandler}
            submitDeleteDatabehandler={handleDeleteDatabehandler}
            onClose={() => setShowDeleteDatabehandlerModal(false)}
            errorDatabehandlerModal={modalErrorMessage}
            usageCount={usageCount}
          />
          <div>
            <RelatedProcessesTable relatedProcesses={relatedProcesses} />
          </div>
        </>
      )}
    </>
  )
}

export default DatabehandlerView
