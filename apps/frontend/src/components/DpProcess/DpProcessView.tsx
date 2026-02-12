import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Heading } from '@navikt/ds-react'
import { Fragment, useEffect, useState } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router'
import {
  deleteDpProcess,
  dpProcessToFormValues,
  getDpProcess,
  updateDpProcess,
} from '../../api/DpProcessApi'
import { getResourceById } from '../../api/GetAllApi'
import { getProcessorsByIds } from '../../api/ProcessorApi'
import {
  IDpProcess,
  IDpProcessFormValues,
  INomData,
  INomSeksjon,
  IProcessor,
} from '../../constants'
import { CodelistService, EListName } from '../../service/Codelist'
import { user } from '../../service/User'
import { lastModifiedDate } from '../../util/date-formatter'
import { RetentionView } from '../Process/Retention'
import Button from '../common/Button/CustomButton'
import DataText from '../common/DataText'
import { ActiveIndicator } from '../common/Durations'
import { Markdown } from '../common/Markdown'
import { boolToText } from '../common/Radio'
import RouteLink, { urlForObject } from '../common/RouteLink'
import { Spinner } from '../common/Spinner'
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
            <Heading level="1" size="medium" className="m-0">
              {dpProcess?.name}
            </Heading>
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
            {dpProcess?.affiliation.products?.length ? (
              <ul className="list-disc list-inside">
                {dpProcess.affiliation.products.map((system) => (
                  <li key={system.code}>
                    <RouteLink href={urlForObject(EListName.SYSTEM, system.code)}>
                      {codelistUtils.getShortname(EListName.SYSTEM, system.code)}
                    </RouteLink>
                  </li>
                ))}
              </ul>
            ) : (
              'Ikke angitt'
            )}
          </DataText>

          <DataText label="Organisering" text="">
            {dpProcess?.affiliation.nomDepartmentId ? (
              <div className="flex gap-1 items-center">
                <span className="whitespace-nowrap">Avdeling: </span>
                <RouteLink
                  href={urlForObject(EListName.DEPARTMENT, dpProcess.affiliation.nomDepartmentId)}
                >
                  {dpProcess.affiliation.nomDepartmentName || dpProcess.affiliation.nomDepartmentId}
                </RouteLink>
              </div>
            ) : (
              <div className="flex gap-1 items-center">
                <span className="whitespace-nowrap">Avdeling: </span>
                <span>Ikke utfylt</span>
              </div>
            )}

            {dpProcess && dpProcess.affiliation.seksjoner.length !== 0 && (
              <div className="mt-2">
                <span>Seksjon: </span>
                <ul className="list-disc list-inside">
                  {dpProcess.affiliation.seksjoner.map((seksjon: INomSeksjon) => (
                    <li key={seksjon.nomSeksjonId}>{seksjon.nomSeksjonName}</li>
                  ))}
                </ul>
              </div>
            )}

            {!!dpProcess?.affiliation.subDepartments.length && (
              <div className="mt-2">
                <div>
                  <span>Underavdeling: </span>
                  <ul className="list-disc list-inside">
                    {dpProcess.affiliation.subDepartments.map((subDepartment) => (
                      <li key={subDepartment.code}>
                        <RouteLink
                          href={urlForObject(EListName.SUB_DEPARTMENT, subDepartment.code)}
                        >
                          {codelistUtils.getShortname(EListName.SUB_DEPARTMENT, subDepartment.code)}
                        </RouteLink>
                      </li>
                    ))}
                  </ul>
                </div>

                {dpProcess.affiliation.subDepartments.filter((subdep) => subdep.code === 'NAVFYLKE')
                  .length !== 0 &&
                  dpProcess.affiliation.fylker.length !== 0 && (
                    <div className="flex gap-1">
                      <span>Fylke: </span>
                      <span>
                        <div className="inline">
                          {dpProcess.affiliation.fylker.map((fylke: INomData, index) => (
                            <Fragment key={fylke.nomId}>
                              <>{fylke.nomName}</>
                              <span>
                                {index < dpProcess.affiliation.fylker.length - 1 ? ', ' : ''}
                              </span>
                            </Fragment>
                          ))}
                        </div>
                      </span>
                    </div>
                  )}

                {dpProcess.affiliation.subDepartments.filter(
                  (subdep) => subdep.code === 'NAVKONTORSTAT'
                ).length !== 0 &&
                  dpProcess.affiliation.navKontorer.length !== 0 && (
                    <div className="flex gap-1">
                      <span>Nav-kontor: </span>
                      <span>
                        <div className="inline">
                          {dpProcess.affiliation.navKontorer.map((kontor: INomData, index) => (
                            <Fragment key={kontor.nomId}>
                              <>{kontor.nomName}</>
                              <span>
                                {index < dpProcess.affiliation.navKontorer.length - 1 ? ', ' : ''}
                              </span>
                            </Fragment>
                          ))}
                        </div>
                      </span>
                    </div>
                  )}
              </div>
            )}

            <div className="mt-2">
              <span className="whitespace-nowrap">Team:</span>
              {dpProcess?.affiliation.productTeams?.length ? (
                <TeamList teamIds={dpProcess?.affiliation.productTeams} variant="list" />
              ) : (
                <div>Ikke utfylt</div>
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
                  <div>
                    <div className="whitespace-nowrap">Ref. til databehandleravtale</div>
                    <ul className="list-disc list-inside">
                      {dpProcess?.dataProcessingAgreements?.map((ref, index) => (
                        <li key={`${ref}-${index}`}>
                          <Markdown source={ref} compact inline />
                        </li>
                      ))}
                    </ul>
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
                        <ul className="list-disc list-inside">
                          {processors.map((processor: IProcessor) => (
                            <li key={processor.id}>
                              <RouteLink href={'/processor/' + processor.id}>
                                {processor.name}
                              </RouteLink>
                            </li>
                          ))}
                        </ul>
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
          {showModal && (
            <DpProcessModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              initialValues={dpProcessToFormValues(dpProcess ? dpProcess : {})}
              submit={handleEditDpProcess}
              errorOnCreate={errorDpProcessModal}
            />
          )}
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
