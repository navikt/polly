import React, { useEffect, useReducer, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DpProcess, DpProcessFormValues, Processor } from '../../constants'
import { deleteDpProcess, dpProcessToFormValues, getDpProcess, updateDpProcess } from '../../api/DpProcessApi'
import { Spinner } from 'baseui/spinner'
import { Block } from 'baseui/block'
import { HeadingMedium } from 'baseui/typography'
import { intl, theme } from '../../util'
import { DotTag, DotTags } from '../common/DotTag'
import DataText from '../common/DataText'
import { codelist, ListName } from '../../service/Codelist'
import { TeamList } from '../common/Team'
import { RetentionView } from '../Process/Retention'
import { ActiveIndicator } from '../common/Durations'
import { boolToText } from '../common/Radio'
import RouteLink from '../common/RouteLink'
import Button from '../common/Button'
import DpProcessModal from './DpProcessModal'
import { DpProcessDeleteModal } from './DpProcessDeleteModal'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { SIZE as ButtonSize } from 'baseui/button'
import { user } from '../../service/User'
import { getProcessorsByIds } from '../../api/ProcessorApi'
import { lastModifiedDate } from '../../util/date-formatter'
import { getResourceById } from '../../api'
import {ampli} from "../../service/Amplitude";

const DpProcessView = () => {
  const navigate = useNavigate()
  const params = useParams<{ id?: string }>()
  const [dpProcess, setDpProcess] = useState<DpProcess>()
  const [isLoading, setLoading] = useState<boolean>(true)
  const [showModal, toggleModal] = useReducer((prevState) => !prevState, false)
  const [showDeleteModal, toggleDeleteModal] = useReducer((prevState) => !prevState, false)
  const [processors, setProcessors] = useState<Processor[]>([])

  ampli.logEvent("besøk", {side: 'NAV som databehandler', url: 'dpprocess/:id', app: 'Behandlingskatalogen', type: 'view'})

  const [errorDpProcessModal, setErrorDpProcessModal] = React.useState<string>('')
  const [lastModifiedUserEmail, setLastModifiedUserEmail] = React.useState('')

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
    } catch (err: any) {
      if (err.response.data.message.includes('already exists')) {
        setErrorDpProcessModal("Databehandlingen eksisterer allerede.")
        return
      }
      setErrorDpProcessModal(err.response.data.message)
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
    } catch (err: any) {
      if (err.response.data.message.includes('already exists')) {
        setErrorDpProcessModal("Databehandlingen eksisterer allerede.")
        return
      }
      setErrorDpProcessModal(err.response.data.message)
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
        const res = await getProcessorsByIds(dpProcess.subDataProcessing.processors)
        setProcessors([...res])
      }

      if (dpProcess) {
        const userIdent = dpProcess.changeStamp.lastModifiedBy.split(' ')[0]
        await getResourceById(userIdent)
          .then((res) => setLastModifiedUserEmail(res.email))
          .catch((e) => console.log('Unable to get email for user that last modified'))
      }
    })()
  }, [dpProcess])

  return (
    <>
      {!isLoading ? (
        <>
          <Block display="flex" justifyContent={'space-between'} alignItems={'center'}>
            <HeadingMedium>{dpProcess?.name}</HeadingMedium>
            {user.canWrite() /*!env.disableDpProcess &&*/ && (
              <Block>
                <Button size="compact" kind="outline" icon={faEdit} marginRight onClick={toggleModal}>
                  Redigér
                </Button>
                <Button size={ButtonSize.compact} kind="outline" onClick={toggleDeleteModal} icon={faTrash}>
                  Slett
                </Button>
              </Block>
            )}
          </Block>

          <DataText label="Behandlingsansvarlig" text={''}>
            <span>
              {!!dpProcess?.externalProcessResponsible ? (
                <RouteLink href={`/thirdparty/${dpProcess.externalProcessResponsible.code}`}>{codelist.getShortnameForCode(dpProcess.externalProcessResponsible)}</RouteLink>
              ) : (
                "Nei"
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
              <Block>
                <span>Avdeling: </span>
                <span>
                  <DotTags list={ListName.DEPARTMENT} codes={[dpProcess?.affiliation.department]} commaSeparator linkCodelist />{' '}
                </span>
              </Block>
            ) : (
              <span>
                Avdeling: Ikke utfylt
              </span>
            )}
            {!!dpProcess?.affiliation.subDepartments.length && (
              <Block>
                <Block display="flex">
                  <span>Underavdeling: </span>
                  <DotTags list={ListName.SUB_DEPARTMENT} codes={dpProcess?.affiliation.subDepartments} linkCodelist />
                </Block>
              </Block>
            )}

            <Block display="flex">
              <span>Team: </span>
              {!!dpProcess?.affiliation.productTeams?.length ? <TeamList teamIds={dpProcess?.affiliation.productTeams} /> : "Ikke utfylt"}
            </Block>
          </DataText>
          <DataText label="Lagringsbehov" text={''}>
            <>
              <Block>
                <RetentionView retention={dpProcess?.retention} />
              </Block>
            </>
          </DataText>
          <DataText label="Databehandleravtale med behandlingsansvarlig" text={''}>
            <>
              <Block>
                <Block>
                  {isDataProcessingAgreementsAvailable && (
                    <Block display="flex" alignItems="center">
                      <Block $style={{ whiteSpace: 'nowrap', margin: '1rem 0' }}>Ref. til databehandleravtale</Block>
                      <DotTags items={dpProcess?.dataProcessingAgreements} markdown />
                    </Block>
                  )}
                </Block>
              </Block>
            </>
          </DataText>

          <DataText label="Underdatabehandler" text={''}>
            <>
              {dpProcess?.subDataProcessing?.dataProcessor === null && "Uavklart om databehandler brukes"}
              {dpProcess?.subDataProcessing?.dataProcessor === false && "Databehandler benyttes ikke"}
            </>
            <>
              {dpProcess?.subDataProcessing.dataProcessor && (
                <Block>
                  <Block>Databehandler benyttes</Block>
                  <Block>
                    {processors && (
                      <Block display="flex" alignItems="center">
                        <Block $style={{ whiteSpace: 'nowrap', margin: '1rem 0' }} />
                        <Block display="flex" flexWrap>
                          {processors.map((dp, i) => (
                            <Block key={dp.id} marginRight={i < processors.length ? theme.sizing.scale200 : 0}>
                              <DotTag key={dp.id}>
                                <RouteLink href={'/processor/' + dp.id}>{dp.name}</RouteLink>
                              </DotTag>
                            </Block>
                          ))}
                        </Block>
                      </Block>
                    )}
                  </Block>
                </Block>
              )}
            </>
          </DataText>
          {dpProcess && (
            <Block
              $style={{
                fontFamily: 'system-ui, Helvetica Neue, Helvetica, Arial, sans-serif',
                fontSize: '14px',
                color: '#3e3832',
              }}
            >
              <Block display="flex" justifyContent="flex-end">
                <span>
                  <i>
                    {intl.formatString(intl.lastModified, '', '').toString().slice(0, -2)} <a href={'mailto: ' + lastModifiedUserEmail}>{lastModifiedUserEmail}</a>,{' '}
                    {lastModifiedDate(dpProcess.changeStamp.lastModifiedDate)}
                  </i>
                </span>
              </Block>
            </Block>
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
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default DpProcessView
