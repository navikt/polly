import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Spinner } from 'baseui/spinner'
import { HeadingMedium } from 'baseui/typography'
import { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router'
import {
  deleteDpProcess,
  dpProcessToFormValues,
  getDpProcess,
  updateDpProcess,
} from '../../api/DpProcessApi'
import { getResourceById } from '../../api/GetAllApi'
import { getProcessorsByIds } from '../../api/ProcessorApi'
import { IDpProcess, IDpProcessFormValues, IProcessor } from '../../constants'
import { ampli } from '../../service/Amplitude'
import { CodelistService, EListName } from '../../service/Codelist'
import { user } from '../../service/User'
import { lastModifiedDate } from '../../util/date-formatter'
import { RetentionView } from '../Process/Retention'
import Button from '../common/Button/CustomButton'
import DataText from '../common/DataText'
import { DotTag, DotTags } from '../common/DotTag'
import { ActiveIndicator } from '../common/Durations'
import { boolToText } from '../common/Radio'
import RouteLink from '../common/RouteLink'
import { TeamList } from '../common/Team'
import { DpProcessDeleteModal } from './DpProcessDeleteModal'
import DpProcessModal from './DpProcessModal'

const DpProcessView = () => {
  const navigate: NavigateFunction = useNavigate()
  const params: Readonly<
    Partial<{
      id?: string
    }>
  > = useParams<{ id?: string }>()
  const [codelistUtils] = CodelistService()

  const [dpProcess, setDpProcess] = useState<IDpProcess>()
  const [isLoading, setLoading] = useState<boolean>(true)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [processors, setProcessors] = useState<IProcessor[]>([])

  ampli.logEvent('besøk', {
    side: 'NAV som databehandler',
    url: 'dpprocess/:id',
    app: 'Behandlingskatalogen',
    type: 'view',
  })

  const [errorDpProcessModal, setErrorDpProcessModal] = useState<string>('')
  const [lastModifiedUserEmail, setLastModifiedUserEmail] = useState('')

  const isDataProcessingAgreementsAvailable = !!dpProcess?.dataProcessingAgreements.length

  const handleEditDpProcess = async (dpProcess: IDpProcessFormValues): Promise<void> => {
    if (!dpProcess) return
    try {
      if (dpProcess.id) {
        const updatedDpProcess: IDpProcess = await updateDpProcess(dpProcess.id, dpProcess)
        setDpProcess(updatedDpProcess)
      }
      setErrorDpProcessModal('')
      setShowModal(false)
    } catch (error: any) {
      if (error.response.data.message.includes('already exists')) {
        setErrorDpProcessModal('Databehandlingen eksisterer allerede.')
        return
      }
      setErrorDpProcessModal(error.response.data.message)
    }
  }

  const handleDeleteDpProcess = async (id?: string): Promise<void> => {
    try {
      if (id) {
        await deleteDpProcess(id)
        setErrorDpProcessModal('')
        setShowModal(false)
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
        const response = await getProcessorsByIds(dpProcess.subDataProcessing.processors)
        setProcessors([...response])
      }

      if (dpProcess) {
        const userIdent = dpProcess.changeStamp.lastModifiedBy.split(' ')[0]
        await getResourceById(userIdent)
          .then((response) => setLastModifiedUserEmail(response.email))
          .catch(() => console.debug('Unable to get email for user that last modified'))
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
                <Button
                  size="xsmall"
                  kind="outline"
                  icon={faEdit}
                  marginRight
                  onClick={() => setShowModal(true)}
                >
                  Redigér
                </Button>
                <Button
                  size="xsmall"
                  kind="outline"
                  onClick={() => setShowDeleteModal(true)}
                  icon={faTrash}
                >
                  Slett
                </Button>
              </div>
            )}
          </div>
          <div className="mt-4">
            <DataText
              label="Behandlingsnummer"
              text={'D' + dpProcess?.dpProcessNumber.toString()}
            />
          </div>
          <DataText label="Behandlingsansvarlig" text="">
            <span>
              {dpProcess?.externalProcessResponsible ? (
                <RouteLink href={`/thirdparty/${dpProcess.externalProcessResponsible.code}`}>
                  {codelistUtils.getShortnameForCode(dpProcess.externalProcessResponsible)}
                </RouteLink>
              ) : (
                'Nei'
              )}
            </span>
          </DataText>

          <DataText label="Beskrivelse" text={dpProcess?.description} />

          <DataText label="Formål" text={dpProcess?.purposeDescription} />

          <DataText label="Gyldighetsperiode for behandlingen" text="">
            <ActiveIndicator alwaysShow={true} showDates={true} {...dpProcess} />
          </DataText>

          <DataText
            label="Behandles det særlige kategorier av personopplysninger?"
            text={boolToText(dpProcess?.art9)}
          />
          <DataText
            label="Behandles det personopplysninger om straffedommer og lovovertredelser?"
            text={boolToText(dpProcess?.art10)}
          />

          <DataText label="System" text="">
            {dpProcess && (
              <DotTags
                list={EListName.SYSTEM}
                codes={dpProcess.affiliation.products}
                linkCodelist
                codelistUtils={codelistUtils}
              />
            )}
          </DataText>

          <DataText label="Organisering" text="">
            {dpProcess?.affiliation.department ? (
              <div>
                <span>Avdeling: </span>
                <span>
                  <DotTags
                    list={EListName.DEPARTMENT}
                    codes={[dpProcess?.affiliation.department]}
                    commaSeparator
                    linkCodelist
                    codelistUtils={codelistUtils}
                  />{' '}
                </span>
              </div>
            ) : (
              <span>Avdeling: Ikke utfylt</span>
            )}
            {!!dpProcess?.affiliation.subDepartments.length && (
              <div>
                <div className="flex">
                  <span>Underavdeling: </span>
                  <DotTags
                    list={EListName.SUB_DEPARTMENT}
                    codes={dpProcess?.affiliation.subDepartments}
                    linkCodelist
                    codelistUtils={codelistUtils}
                  />
                </div>
              </div>
            )}

            <div className="flex">
              <span>Team: </span>
              {dpProcess?.affiliation.productTeams?.length ? (
                <TeamList teamIds={dpProcess?.affiliation.productTeams} />
              ) : (
                'Ikke utfylt'
              )}
            </div>
          </DataText>
          <DataText label="Lagringsbehov" text="">
            <div>
              <RetentionView retention={dpProcess?.retention} />
            </div>
          </DataText>
          <DataText label="Databehandleravtale med behandlingsansvarlig" text="">
            <div>
              <div>
                {isDataProcessingAgreementsAvailable && (
                  <div className="flex items-center">
                    <div className="whitespace-nowrap mt-1 mr-0">Ref. til databehandleravtale</div>
                    <DotTags
                      items={dpProcess?.dataProcessingAgreements}
                      markdown
                      codelistUtils={codelistUtils}
                    />
                  </div>
                )}
              </div>
            </div>
          </DataText>

          <DataText label="Underdatabehandler" text="">
            <>
              {dpProcess?.subDataProcessing?.dataProcessor === null &&
                'Uavklart om databehandler brukes'}
              {dpProcess?.subDataProcessing?.dataProcessor === false &&
                'Databehandler benyttes ikke'}
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
                          {processors.map((processor: IProcessor, index) => (
                            <div
                              key={processor.id}
                              className={index < processors.length ? 'mr-1.5' : ''}
                            >
                              <DotTag key={processor.id}>
                                <RouteLink href={'/processor/' + processor.id}>
                                  {processor.name}
                                </RouteLink>
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
                  Sist endret av{' '}
                  <a href={'mailto: ' + lastModifiedUserEmail}>{lastModifiedUserEmail}</a>
                  {lastModifiedDate(dpProcess?.changeStamp?.lastModifiedDate)}
                </i>
              </span>
            </div>
          )}
          <DpProcessModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            initialValues={dpProcessToFormValues(dpProcess ? dpProcess : {})}
            submit={handleEditDpProcess}
            errorOnCreate={errorDpProcessModal}
          />
          <DpProcessDeleteModal
            title="Bekreft sletting"
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onSubmit={() => handleDeleteDpProcess(dpProcess?.id)}
            errorOnDeletion={errorDpProcessModal}
          />
        </>
      )}{' '}
    </>
  )
}

export default DpProcessView
