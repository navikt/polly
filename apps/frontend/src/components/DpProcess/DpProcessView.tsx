import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { SIZE as ButtonSize } from 'baseui/button'
import { Spinner } from 'baseui/spinner'
import { HeadingMedium } from 'baseui/typography'
import { useEffect, useReducer, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getResourceById } from '../../api'
import { deleteDpProcess, dpProcessToFormValues, getDpProcess, updateDpProcess } from '../../api/DpProcessApi'
import { getProcessorsByIds } from '../../api/ProcessorApi'
import { DpProcess, DpProcessFormValues, Processor } from '../../constants'
import { ampli } from '../../service/Amplitude'
import { ListName, codelist } from '../../service/Codelist'
import { user } from '../../service/User'
import { lastModifiedDate } from '../../util/date-formatter'
import { RetentionView } from '../Process/Retention'
import Button from '../common/Button'
import DataText from '../common/DataText'
import { DotTag, DotTags } from '../common/DotTag'
import { ActiveIndicator } from '../common/Durations'
import { boolToText } from '../common/Radio'
import RouteLink from '../common/RouteLink'
import { TeamList } from '../common/Team'
import { DpProcessDeleteModal } from './DpProcessDeleteModal'
import DpProcessModal from './DpProcessModal'

const DpProcessView = () => {
  const navigate = useNavigate()
  const params = useParams<{ id?: string }>()
  const [dpProcess, setDpProcess] = useState<DpProcess>()
  const [isLoading, setLoading] = useState<boolean>(true)
  const [showModal, toggleModal] = useReducer((prevState) => !prevState, false)
  const [showDeleteModal, toggleDeleteModal] = useReducer((prevState) => !prevState, false)
  const [processors, setProcessors] = useState<Processor[]>([])

  ampli.logEvent('besøk', { side: 'NAV som databehandler', url: 'dpprocess/:id', app: 'Behandlingskatalogen', type: 'view' })

  const [errorDpProcessModal, setErrorDpProcessModal] = useState<string>('')
  const [lastModifiedUserEmail, setLastModifiedUserEmail] = useState('')

  const isDataProcessingAgreementsAvailable = !!dpProcess?.dataProcessingAgreements.length

  const handleEditDpProcess = async (dpProcess: DpProcessFormValues) => {
    if (!dpProcess) return
    try {
      if (dpProcess.id) {
        const updatedDpProcess = await updateDpProcess(dpProcess.id, dpProcess)
        setDpProcess(updatedDpProcess)
      }
      setErrorDpProcessModal('')
      toggleModal()
    } catch (error: any) {
      if (error.response.data.message.includes('already exists')) {
        setErrorDpProcessModal('Databehandlingen eksisterer allerede.')
        return
      }
      setErrorDpProcessModal(error.response.data.message)
    }
  }

  const handleDeleteDpProcess = async (id?: string) => {
    try {
      if (id) {
        await deleteDpProcess(id)
        setErrorDpProcessModal('')
        toggleModal()
        navigate(`/dpprocess`)
      }
    } catch (error: any) {
      if (error.response.data.message.includes('already exists')) {
        setErrorDpProcessModal('Databehandlingen eksisterer allerede.')
        return
      }
      setErrorDpProcessModal(error.response.data.message)
    }
  }

  useEffect(() => {
    ;(async () => {
      if (params.id) {
        setLoading(true)
        setDpProcess(await getDpProcess(params.id))
        setLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      if (dpProcess?.subDataProcessing.processors.length) {
        const result = await getProcessorsByIds(dpProcess.subDataProcessing.processors)
        setProcessors([...result])
      }

      if (dpProcess) {
        const userIdent = dpProcess.changeStamp.lastModifiedBy.split(' ')[0]
        await getResourceById(userIdent)
          .then((result) => setLastModifiedUserEmail(result.email))
          .catch((error) => console.log('Unable to get email for user that last modified'))
      }
    })()
  }, [dpProcess])

  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && (
        <>
          <div className="flex justify-between items-center">
            <HeadingMedium>{dpProcess?.name}</HeadingMedium>
            {user.canWrite() /*!env.disableDpProcess &&*/ && (
              <div>
                <Button size="compact" kind="outline" icon={faEdit} marginRight onClick={toggleModal}>
                  Redigér
                </Button>
                <Button size={ButtonSize.compact} kind="outline" onClick={toggleDeleteModal} icon={faTrash}>
                  Slett
                </Button>
              </div>
            )}
          </div>
          <div className="mt-4">
            <DataText label="Behandlingsnummer" text={'D' + dpProcess?.dpProcessNumber.toString()} />
          </div>
          <DataText label="Behandlingsansvarlig" text={''}>
            <span>
              {!!dpProcess?.externalProcessResponsible ? (
                <RouteLink href={`/thirdparty/${dpProcess.externalProcessResponsible.code}`}>{codelist.getShortnameForCode(dpProcess.externalProcessResponsible)}</RouteLink>
              ) : (
                'Nei'
              )}
            </span>
          </DataText>

          <DataText label="Beskrivelse" text={dpProcess?.description} />

          <DataText label="Formål" text={dpProcess?.purposeDescription} />

          <DataText label="Gyldighetsperiode for behandlingen" text={''}>
            <ActiveIndicator alwaysShow={true} showDates={true} {...dpProcess} />
          </DataText>

          <DataText label="Behandles det særlige kategorier av personopplysninger?" text={boolToText(dpProcess?.art9)} />
          <DataText label="Behandles det personopplysninger om straffedommer og lovovertredelser?" text={boolToText(dpProcess?.art10)} />

          <DataText label="System" text={''}>
            {dpProcess && <DotTags list={ListName.SYSTEM} codes={dpProcess.affiliation.products} linkCodelist />}
          </DataText>

          <DataText label="Organisering" text={''}>
            {dpProcess?.affiliation.department ? (
              <div>
                <span>Avdeling: </span>
                <span>
                  <DotTags list={ListName.DEPARTMENT} codes={[dpProcess?.affiliation.department]} commaSeparator linkCodelist />{' '}
                </span>
              </div>
            ) : (
              <span>Avdeling: Ikke utfylt</span>
            )}
            {!!dpProcess?.affiliation.subDepartments.length && (
              <div>
                <div className="flex">
                  <span>Underavdeling: </span>
                  <DotTags list={ListName.SUB_DEPARTMENT} codes={dpProcess?.affiliation.subDepartments} linkCodelist />
                </div>
              </div>
            )}

            <div className="flex">
              <span>Team: </span>
              {!!dpProcess?.affiliation.productTeams?.length ? <TeamList teamIds={dpProcess?.affiliation.productTeams} /> : 'Ikke utfylt'}
            </div>
          </DataText>
          <DataText label="Lagringsbehov" text={''}>
            <div>
              <RetentionView retention={dpProcess?.retention} />
            </div>
          </DataText>
          <DataText label="Databehandleravtale med behandlingsansvarlig" text={''}>
            <div>
              <div>
                {isDataProcessingAgreementsAvailable && (
                  <div className="flex items-center">
                    <div className="whitespace-nowrap mt-1 mr-0">Ref. til databehandleravtale</div>
                    <DotTags items={dpProcess?.dataProcessingAgreements} markdown />
                  </div>
                )}
              </div>
            </div>
          </DataText>

          <DataText label="Underdatabehandler" text={''}>
            <>
              {dpProcess?.subDataProcessing?.dataProcessor === null && 'Uavklart om databehandler brukes'}
              {dpProcess?.subDataProcessing?.dataProcessor === false && 'Databehandler benyttes ikke'}
            </>
            <>
              {dpProcess?.subDataProcessing.dataProcessor && (
                <div>
                  <div>Databehandler benyttes</div>
                  <div>
                    {processors && (
                      <div className="flex items-center">
                        <div className="whitespace-nowrap mt-4 mr-0" />
                        <div className="flex flexWrap">
                          {processors.map((dp, i) => (
                            <div className={i < processors.length ? 'mr-1.5' : ''}>
                              <DotTag key={dp.id}>
                                <RouteLink href={'/processor/' + dp.id}>{dp.name}</RouteLink>
                              </DotTag>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          </DataText>
          {dpProcess && (
            <div className="flex justify-end">
              <span>
                <i>
                  {`Sist endret av `}
                  <a href={'mailto: ' + lastModifiedUserEmail}>{lastModifiedUserEmail}</a>
                  {` ${lastModifiedDate(dpProcess?.changeStamp?.lastModifiedDate)}`}
                </i>
              </span>
            </div>
          )}
          <DpProcessModal
            isOpen={showModal}
            onClose={toggleModal}
            initialValues={dpProcessToFormValues(dpProcess ? dpProcess : {})}
            submit={handleEditDpProcess}
            errorOnCreate={errorDpProcessModal}
          />
          <DpProcessDeleteModal
            title="Bekreft sletting"
            isOpen={showDeleteModal}
            onClose={toggleDeleteModal}
            onSubmit={() => handleDeleteDpProcess(dpProcess?.id)}
            errorOnDeletion={errorDpProcessModal}
          />
        </>
      )}{' '}
    </>
  )
}

export default DpProcessView
