import React, { useEffect, useReducer, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { DpProcess, DpProcessFormValues, Processor } from '../../constants'
import { deleteDpProcess, dpProcessToFormValues, getDpProcess, updateDpProcess } from '../../api/DpProcessApi'
import { StyledSpinnerNext } from 'baseui/spinner'
import { Block } from 'baseui/block'
import { H4 } from 'baseui/typography'
import { intl, theme } from '../../util'
import { DotTags, DotTag } from '../common/DotTag'
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

const DpProcessView = () => {
  const history = useHistory()
  const params = useParams<{ id?: string }>()
  const [dpProcess, setDpProcess] = useState<DpProcess>()
  const [isLoading, setLoading] = useState<boolean>(true)
  const [showModal, toggleModal] = useReducer(prevState => !prevState, false)
  const [showDeleteModal, toggleDeleteModal] = useReducer(prevState => !prevState, false)
  const [processors, setProcessors] = useState<Processor[]>([])

  const [errorDpProcessModal, setErrorDpProcessModal] = React.useState<string>('')

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
    } catch (err) {
      if (err.response.data.message.includes('already exists')) {
        setErrorDpProcessModal(intl.dpProcessDuplicatedError)
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
        history.push(`/dpprocess`)
      }
    } catch (err) {
      if (err.response.data.message.includes('already exists')) {
        setErrorDpProcessModal(intl.dpProcessDuplicatedError)
        return
      }
      setErrorDpProcessModal(err.response.data.message)
    }
  }

  useEffect(() => {
    (async () => {
      if (params.id) {
        setLoading(true)
        setDpProcess(await getDpProcess(params.id))
        setLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      if (dpProcess?.subDataProcessing.processors?.length) {
        const res = await getProcessorsByIds(dpProcess.subDataProcessing.processors)
        setProcessors([...res])
      }
    })()
  }, [])

  return (
    <>
      {!isLoading ? (
        <>
          <Block display="flex" justifyContent={"space-between"} alignItems={"center"}>
            <H4>{dpProcess?.name}</H4>
            {user.canWrite() && /*!env.disableDpProcess &&*/
              <Block>
                <Button size="compact" kind="outline" tooltip={intl.edit} icon={faEdit} marginRight onClick={toggleModal}>
                  {intl.edit}
                </Button>
                <Button size={ButtonSize.compact} kind='outline' onClick={toggleDeleteModal} tooltip={intl.delete} icon={faTrash}>
                  {intl.delete}
                </Button>
              </Block>
            }
          </Block>

          <DataText label={intl.externalProcessResponsible} text={""}>
            <span>{!!dpProcess?.externalProcessResponsible ?
              <RouteLink href={`/thirdparty/${dpProcess.externalProcessResponsible.code}`}>
                {codelist.getShortnameForCode(dpProcess.externalProcessResponsible)}
              </RouteLink>
              : intl.no}</span>
          </DataText>

          <DataText label={intl.description} text={dpProcess?.description} />

          <DataText label={intl.purpose} text={dpProcess?.purposeDescription} />

          <DataText label={intl.validityOfProcess} text={""}>
            <ActiveIndicator alwaysShow={true} showDates={true} {...dpProcess} />
          </DataText>

          <DataText label={intl.article9} text={boolToText(dpProcess?.art9)} />
          <DataText label={intl.article10} text={boolToText(dpProcess?.art10)} />

          <DataText label={intl.system} text={""}>
            {dpProcess && (<DotTags list={ListName.SYSTEM} codes={dpProcess.affiliation.products} linkCodelist />)}
          </DataText>

          <DataText label={intl.organizing} text={""}>
            {dpProcess?.affiliation.department ? <Block>
              <span>{intl.department}: </span>
              <span><DotTags list={ListName.DEPARTMENT} codes={[dpProcess?.affiliation.department]} commaSeparator linkCodelist /> </span>
            </Block> : <span>{intl.department}: {intl.notFilled}</span>}
            {!!dpProcess?.affiliation.subDepartments.length && <Block>
              <Block display="flex">
                <span>{intl.subDepartment}: </span>
                <DotTags list={ListName.SUB_DEPARTMENT} codes={dpProcess?.affiliation.subDepartments} linkCodelist />
              </Block>
            </Block>
            }

            <Block display="flex">
              <span>{intl.productTeam}: </span>
              {!!dpProcess?.affiliation.productTeams?.length ? <TeamList teamIds={dpProcess?.affiliation.productTeams} /> : intl.notFilled}
            </Block>
          </DataText>
          <DataText label={intl.retention} text={""}>
            <>
              <Block>
                <RetentionView retention={dpProcess?.retention} />
              </Block>
            </>
          </DataText>
          <DataText label={intl.dpProcessDataProcessor} text={""}>
            <>
              <Block>
                <Block>
                  {isDataProcessingAgreementsAvailable &&
                    <Block display='flex' alignItems="center">
                      <Block $style={{ whiteSpace: 'nowrap', margin: '1rem 0' }}>
                        {`${intl.processorAgreement}: `}
                      </Block>
                      <DotTags items={dpProcess?.dataProcessingAgreements} markdown />
                    </Block>
                  }
                </Block>
              </Block>
            </>
          </DataText>

          <DataText label={intl.subDataProcessor} text={""}>
            <>
              {dpProcess?.subDataProcessing?.dataProcessor === null && intl.processorUnclarified}
              {dpProcess?.subDataProcessing?.dataProcessor === false && intl.processorNo}
            </>
            <>
              {dpProcess?.subDataProcessing?.dataProcessor &&
                <Block>
                  <Block>{intl.processorYes}</Block>
                  <Block>
                    {processors && (
                      <Block display='flex' alignItems='center'>
                        <Block $style={{ whiteSpace: 'nowrap', margin: '1rem 0' }} />
                        <Block display='flex' flexWrap>
                          {processors.map((dp, i) => (
                            <Block key={dp.id} marginRight={i < processors.length ? theme.sizing.scale200 : 0}>
                              <DotTag key={dp.id}>
                                <RouteLink href={"/processor/" + dp.id}>
                                  {dp.name}
                                </RouteLink>
                              </DotTag>
                            </Block>
                          ))}
                        </Block>
                      </Block>
                    )}
                  </Block>
                </Block>}
            </>
          </DataText>
          <DpProcessModal
            isOpen={showModal}
            onClose={toggleModal}
            initialValues={dpProcessToFormValues(dpProcess ? dpProcess : {})}
            submit={handleEditDpProcess}
            errorOnCreate={errorDpProcessModal}
          />
          <DpProcessDeleteModal
            title={intl.confirmDeleteHeader}
            isOpen={showDeleteModal}
            onClose={toggleDeleteModal}
            onSubmit={() => handleDeleteDpProcess(dpProcess?.id)}
            errorOnDeletion={errorDpProcessModal}
          />
        </>
      ) : (
        <StyledSpinnerNext />
      )}
    </>
  )
}

export default DpProcessView
