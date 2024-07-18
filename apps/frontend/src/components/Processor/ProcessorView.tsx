import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Block } from 'baseui/block'
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import { HeadingMedium, ParagraphSmall } from 'baseui/typography'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProcessesByProcessor, getResourceById, getResourcesByIds } from '../../api'
import { convertProcessorToFormValues, deleteProcessor, getProcessor, updateProcessor } from '../../api/ProcessorApi'
import { Process, Processor, ProcessorFormValues, TeamResource, TRANSFER_GROUNDS_OUTSIDE_EU_OTHER } from '../../constants'
import { ampli } from '../../service/Amplitude'
import { codelist } from '../../service/Codelist'
import { user } from '../../service/User'
import { theme } from '../../util'
import { lastModifiedDate } from '../../util/date-formatter'
import { shortenLinksInText } from '../../util/helper-functions'
import Button from '../common/Button'
import { boolToText } from '../common/Radio'
import { Spinner } from '../common/Spinner'
import TextWithLabel from '../common/TextWithLabel'
import RelatedProcessesTable from './components/RelatedProcessesTable'
import { DeleteProcessorModal } from './DeleteProcessorModal'
import ProcessorModal from './ProcessorModal'

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

  ampli.logEvent('besøk', { side: 'Databehandlere', url: '/processor/:id', app: 'Behandlingskatalogen', type: 'view' })

  const hasAccess = () => user.canWrite()
  const navigate = useNavigate()
  const params = useParams<{ id?: string }>()

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
      <div className="flex w-full justify-between">
        <HeadingMedium marginTop="0">{currentProcessor?.name}</HeadingMedium>
        <div className="mt-auto">
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
        </div>
      </div>
      {!isLoading ? (
        currentProcessor && (
          <>
            <div className="flex mb-4">
              <div className="w-[40%] pr-24">
                <FlexGrid flexGridColumnCount={1} flexGridRowGap={theme.sizing.scale800}>
                  <FlexGridItem>
                    <TextWithLabel label="Ref. på databehandleravtale" text={currentProcessor.contract ? shortenLinksInText(currentProcessor.contract) : 'Ikke utfylt'} />
                  </FlexGridItem>
                  <FlexGridItem>
                    <TextWithLabel label="Avtaleeier" text={currentProcessor.contractOwner ? contractOwner?.fullName : 'Ikke utfylt'} />
                  </FlexGridItem>
                  <FlexGridItem>
                    <TextWithLabel
                      label="Fagansvarlig"
                      text={currentProcessor.operationalContractManagers.length > 0 ? operationalContractManagers.map((r) => r.fullName).join(', ') : 'Ikke utfylt'}
                    />
                  </FlexGridItem>
                </FlexGrid>
              </div>
              <div className="w-[60%] pl-24 border-l-[1px] border-solid border-[#AFAFAF]">
                <FlexGrid flexGridColumnCount={1} flexGridRowGap={theme.sizing.scale800}>
                  <FlexGridItem>
                    <TextWithLabel label="Merknad" text={currentProcessor.note ? currentProcessor.note : 'Ikke utfylt'} />
                  </FlexGridItem>
                  <FlexGridItem>
                    <TextWithLabel label="Behandler databehandler personopplysninger utenfor EU/EØS?" text={''}>
                      <div className="flex whitespace-pre-wrap m-0 text-base">
                        {currentProcessor?.outsideEU === null && 'Uavklart'}
                        {currentProcessor.outsideEU === false && 'Nei'}
                      </div>
                      <>
                        {currentProcessor.outsideEU && (
                          <div>
                            <div className="flex whitespace-pre-wrap m-0 text-base">
                              <span>{boolToText(currentProcessor.outsideEU)}</span>
                            </div>
                          </div>
                        )}
                        {currentProcessor.outsideEU && (
                          <>
                            <TextWithLabel label="Overføringsgrunnlag for behandling utenfor EU/EØS" text={''}>
                              <div className="flex whitespace-pre-wrap m-0 text-base">
                                {currentProcessor.transferGroundsOutsideEU && <span>{codelist.getShortnameForCode(currentProcessor.transferGroundsOutsideEU)} </span>}
                                {!currentProcessor.transferGroundsOutsideEU && <span>Ikke angitt</span>}
                                {currentProcessor.transferGroundsOutsideEU?.code === TRANSFER_GROUNDS_OUTSIDE_EU_OTHER && currentProcessor.transferGroundsOutsideEUOther && (
                                  <span>: {currentProcessor.transferGroundsOutsideEUOther}</span>
                                )}
                              </div>
                            </TextWithLabel>
                            {currentProcessor.countries && !!currentProcessor?.countries.length && (
                              <TextWithLabel label="Land" text={''}>
                                <div className="flex whitespace-pre-wrap m-0 text-base">
                                  <span>{currentProcessor.countries.map((c) => codelist.countryName(c)).join(', ')}</span>
                                </div>
                              </TextWithLabel>
                            )}
                          </>
                        )}
                      </>
                    </TextWithLabel>
                  </FlexGridItem>
                </FlexGrid>
                <div className="flex justify-end">
                  {currentProcessor.changeStamp && (
                    <ParagraphSmall>
                      <i>{`Sist endret av ${currentProcessor.changeStamp.lastModifiedBy}, ${lastModifiedDate(currentProcessor.changeStamp?.lastModifiedDate)}`}</i>
                    </ParagraphSmall>
                  )}
                </div>
                <ProcessorModal
                  title="Databehandler"
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
              </div>
            </div>
            <div>
              <RelatedProcessesTable relatedProcesses={relatedProcesses} />
            </div>
          </>
        )
      ) : (
        <Spinner size={theme.sizing.scale1200} />
      )}
    </>
  )
}

export default ProcessorView
