import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Process, Processor, ProcessorFormValues, TeamResource, TRANSFER_GROUNDS_OUTSIDE_EU_OTHER } from '../../constants'
import { convertProcessorToFormValues, deleteProcessor, getProcessor, updateProcessor } from '../../api/ProcessorApi'
import { getProcessesByProcessor, getResourceById, getResourcesByIds } from '../../api'
import { Block, BlockProps } from 'baseui/block'
import { theme } from '../../util'
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import TextWithLabel from '../common/TextWithLabel'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { HeadingMedium, ParagraphSmall } from 'baseui/typography'
import { user } from '../../service/User'
import { Spinner } from '../common/Spinner'
import { boolToText } from '../common/Radio'
import { codelist } from '../../service/Codelist'
import { marginZero } from '../common/Style'
import Button from '../common/Button'
import ProcessorModal from './ProcessorModal'
import { DeleteProcessorModal } from './DeleteProcessorModal'
import { shortenLinksInText } from '../../util/helper-functions'
import { lastModifiedDate } from '../../util/date-formatter'
import RelatedProcessesTable from './components/RelatedProcessesTable'
import {ampli} from "../../service/Amplitude";

const blockProps: BlockProps = {
  font: 'ParagraphMedium',
  whiteSpace: 'pre-wrap',
  ...marginZero,
  display: 'flex',
}
const ProcessorView = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [currentProcessor, setCurrentProcessor] = useState<Processor>()
  const [relatedProcesses, setRelatedProcess] = useState<Process[]>([])
  const [showEditProcessorModal, setShowEditProcessorModal] = useState<boolean>(false)
  const [showDeleteProcessorModal, setShowDeleteProcessorModal] = useState<boolean>(false)
  const [contractOwner, setContractOwner] = useState<TeamResource>()
  const [operationalContractManagers, setOperationalContractManagers] = useState<TeamResource[]>([])
  const [modalErrorMessage, setModalErrorMessage] = useState<string>()
  const [usageCount, setUsageCount] = useState<number>(0)

  ampli.logEvent("besøk", {side: 'Databehandlere', url:'/processor/:id', app: 'Behandlingskatalogen', type: 'view'})

  const hasAccess = () => user.canWrite()
  const navigate = useNavigate()
  const params = useParams<{ id?: string }>()
  const dividerDistance = theme.sizing.scale2400

  useEffect(() => {
    ;(async () => {
      if (params.id && showDeleteProcessorModal === true) {
        let res = await getProcessesByProcessor(params.id)
        setUsageCount(res.numberOfElements)
      }
    })()
  }, [showDeleteProcessorModal])

  const handleEditDataProcessor = (processor: ProcessorFormValues) => {
    if (!processor) return
    try {
      ;(async () => {
        const newDataProcessor = await updateProcessor(processor)
        setIsLoading(true)
        setCurrentProcessor(await getProcessor(newDataProcessor.id))
        setIsLoading(false)
      })()
      setShowEditProcessorModal(false)
    } catch (err: any) {
      setModalErrorMessage(err.response.data.message)
    }
  }

  const handleDeleteDataProcessor = async (processor: Processor) => {
    try {
      await deleteProcessor(processor.id)
      navigate('/processor/')
      return true
    } catch (err: any) {
      setModalErrorMessage(err.response.data.message)
      setShowDeleteProcessorModal(true)
      return false
    }
  }

  useEffect(() => {
    ;(async () => {
      if (params.id) {
        setIsLoading(true)
        setCurrentProcessor(await getProcessor(params.id))
        setRelatedProcess((await getProcessesByProcessor(params.id)).content)
        setIsLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      if (currentProcessor?.contractOwner) {
        setIsLoading(true)
        setContractOwner(await getResourceById(currentProcessor?.contractOwner))
        setIsLoading(false)
      }
      if (currentProcessor?.operationalContractManagers) {
        setIsLoading(true)
        setOperationalContractManagers(await getResourcesByIds(currentProcessor.operationalContractManagers))
        setIsLoading(false)
      }
    })()
  }, [currentProcessor])

  return (
    <>
      <Block display={'flex'} width={'100%'} justifyContent={'space-between'}>
        <HeadingMedium marginTop="0">{currentProcessor?.name}</HeadingMedium>
        <Block marginTop={'auto'}>
          {hasAccess() && (
            <>
              <Button kind="outline" onClick={() => setShowEditProcessorModal(true)}>
                <FontAwesomeIcon icon={faEdit} />
                &nbsp;Redigér
              </Button>
              <Button
                kind="outline"
                onClick={() => {
                  setShowDeleteProcessorModal(true)
                }}
                marginLeft={true}
              >
                <FontAwesomeIcon icon={faTrash} />
                &nbsp;Slett
              </Button>
            </>
          )}
        </Block>
      </Block>
      {!isLoading ? (
        currentProcessor && (
          <>
            <Block display="flex" marginBottom="1rem">
              <Block width="40%" paddingRight={dividerDistance}>
                <FlexGrid flexGridColumnCount={1} flexGridRowGap={theme.sizing.scale800}>
                  <FlexGridItem>
                    <TextWithLabel label='Ref. på databehandleravtale' text={currentProcessor.contract ? shortenLinksInText(currentProcessor.contract) : 'Ikke utfylt'} />
                  </FlexGridItem>
                  <FlexGridItem>
                    <TextWithLabel label='Avtaleeier' text={currentProcessor.contractOwner ? contractOwner?.fullName : 'Ikke utfylt'} />
                  </FlexGridItem>
                  <FlexGridItem>
                    <TextWithLabel
                      label='Fagansvarlig'
                      text={currentProcessor.operationalContractManagers.length > 0 ? operationalContractManagers.map((r) => r.fullName).join(', ') : 'Ikke utfylt'}
                    />
                  </FlexGridItem>
                </FlexGrid>
              </Block>
              <Block width="60%" paddingLeft={dividerDistance} $style={{ borderLeft: `1px solid ${theme.colors.mono600}` }}>
                <FlexGrid flexGridColumnCount={1} flexGridRowGap={theme.sizing.scale800}>
                  <FlexGridItem>
                    <TextWithLabel label='Merknad'text={currentProcessor.note ? currentProcessor.note : 'Ikke utfylt'} />
                  </FlexGridItem>
                  <FlexGridItem>
                    <TextWithLabel label='Behandler databehandler personopplysninger utenfor EU/EØS?' text={''}>
                      <Block {...blockProps}>
                        {currentProcessor?.outsideEU === null && 'Uavklart'}
                        {currentProcessor.outsideEU === false && 'Nei'}
                      </Block>
                      <>
                        {currentProcessor.outsideEU && (
                          <Block>
                            <Block {...blockProps}>
                              <span>{boolToText(currentProcessor.outsideEU)}</span>
                            </Block>
                          </Block>
                        )}
                        {currentProcessor.outsideEU && (
                          <>
                            <TextWithLabel label='Overføringsgrunnlag for behandling utenfor EU/EØS' text={''}>
                              <Block {...blockProps}>
                                {currentProcessor.transferGroundsOutsideEU && <span>{codelist.getShortnameForCode(currentProcessor.transferGroundsOutsideEU)} </span>}
                                {!currentProcessor.transferGroundsOutsideEU && <span>Ikke angitt</span>}
                                {currentProcessor.transferGroundsOutsideEU?.code === TRANSFER_GROUNDS_OUTSIDE_EU_OTHER && currentProcessor.transferGroundsOutsideEUOther && (
                                  <span>: {currentProcessor.transferGroundsOutsideEUOther}</span>
                                )}
                              </Block>
                            </TextWithLabel>
                            {currentProcessor.countries && !!currentProcessor?.countries.length && (
                              <TextWithLabel label='Land' text={''}>
                                <Block {...blockProps}>
                                  <span>{currentProcessor.countries.map((c) => codelist.countryName(c)).join(', ')}</span>
                                </Block>
                              </TextWithLabel>
                            )}
                          </>
                        )}
                      </>
                    </TextWithLabel>
                  </FlexGridItem>
                </FlexGrid>
                <Block display="flex" justifyContent="flex-end">
                  {currentProcessor.changeStamp && (
                    <ParagraphSmall>
                       <i>{`Sist endret av ${currentProcessor.changeStamp.lastModifiedBy}, ${lastModifiedDate(currentProcessor.changeStamp?.lastModifiedDate)}`}</i>
                    </ParagraphSmall>
                  )}
                </Block>
                <ProcessorModal
                  title='Databehandler'
                  isOpen={showEditProcessorModal}
                  initialValues={convertProcessorToFormValues(currentProcessor)}
                  submit={handleEditDataProcessor}
                  errorMessage={modalErrorMessage}
                  onClose={() => setShowEditProcessorModal(false)}
                />
                <DeleteProcessorModal
                  isOpen={showDeleteProcessorModal}
                  processor={currentProcessor}
                  submitDeleteProcessor={handleDeleteDataProcessor}
                  onClose={() => setShowDeleteProcessorModal(false)}
                  errorProcessorModal={modalErrorMessage}
                  usageCount={usageCount}
                />
              </Block>
            </Block>
            <Block>
              <RelatedProcessesTable relatedProcesses={relatedProcesses} />
            </Block>
          </>
        )
      ) : (
        <Spinner size={theme.sizing.scale1200} />
      )}
    </>
  )
}

export default ProcessorView
