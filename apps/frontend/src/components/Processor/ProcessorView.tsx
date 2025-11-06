import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BodyShort, Heading, Loader } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router'
import { getProcessesByProcessor, getResourceById, getResourcesByIds } from '../../api/GetAllApi'
import {
  convertProcessorToFormValues,
  deleteProcessor,
  getProcessor,
  updateProcessor,
} from '../../api/ProcessorApi'
import {
  IPageResponse,
  IProcess,
  IProcessor,
  IProcessorFormValues,
  ITeamResource,
  TRANSFER_GROUNDS_OUTSIDE_EU_OTHER,
} from '../../constants'
import { CodelistService } from '../../service/Codelist'
import { user } from '../../service/User'
import { lastModifiedDate } from '../../util/date-formatter'
import { shortenLinksInText } from '../../util/helper-functions'
import Button from '../common/Button/CustomButton'
import DataText from '../common/DataText'
import { boolToText } from '../common/Radio'
import { DeleteProcessorModal } from './DeleteProcessorModal'
import ProcessorModal from './ProcessorModal'
import RelatedProcessesTable from './components/RelatedProcessesTable'

const ProcessorView = () => {
  const [codelistUtils] = CodelistService()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [currentProcessor, setCurrentProcessor] = useState<IProcessor>()
  const [relatedProcesses, setRelatedProcess] = useState<IProcess[]>([])
  const [showEditProcessorModal, setShowEditProcessorModal] = useState<boolean>(false)
  const [showDeleteProcessorModal, setShowDeleteProcessorModal] = useState<boolean>(false)
  const [contractOwner, setContractOwner] = useState<ITeamResource>()
  const [operationalContractManagers, setOperationalContractManagers] = useState<ITeamResource[]>(
    []
  )
  const [modalErrorMessage, setModalErrorMessage] = useState<string>()
  const [usageCount, setUsageCount] = useState<number>(0)

  const hasAccess = (): boolean => user.canWrite()
  const navigate: NavigateFunction = useNavigate()
  const params: Readonly<
    Partial<{
      id?: string
    }>
  > = useParams<{ id?: string }>()

  useEffect(() => {
    ;(async () => {
      if (params.id && showDeleteProcessorModal) {
        const response: IPageResponse<IProcess> = await getProcessesByProcessor(params.id)
        setUsageCount(response.numberOfElements)
      }
    })()
  }, [showDeleteProcessorModal])

  const handleEditDataProcessor = (processor: IProcessorFormValues) => {
    if (!processor) return
    try {
      ;(async () => {
        const newDataProcessor = await updateProcessor(processor)
        setIsLoading(true)
        setCurrentProcessor(await getProcessor(newDataProcessor.id))
        setIsLoading(false)
      })()
      setShowEditProcessorModal(false)
    } catch (error: any) {
      setModalErrorMessage(error.response.data.message)
    }
  }

  const handleDeleteDataProcessor = async (processor: IProcessor) => {
    try {
      await deleteProcessor(processor.id)
      navigate('/processor/')
      return true
    } catch (error: any) {
      setModalErrorMessage(error.response.data.message)
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
        setOperationalContractManagers(
          await getResourcesByIds(currentProcessor.operationalContractManagers)
        )
        setIsLoading(false)
      }
    })()
  }, [currentProcessor])

  return (
    <>
      <div className="flex w-full justify-between">
        <Heading size="large" level="3">
          {currentProcessor?.name}
        </Heading>
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
      {isLoading && <Loader size="xlarge" />}
      {!isLoading && currentProcessor && (
        <>
          <div>
            <DataText label="Referanse til databehandleravtale">
              {currentProcessor.contract
                ? shortenLinksInText(currentProcessor.contract)
                : 'Ikke utfylt'}
            </DataText>
            <DataText
              label="Avtaleeier"
              text={currentProcessor.contractOwner && contractOwner?.fullName}
            />
            <DataText
              label="Fagansvarlig"
              text={
                currentProcessor.operationalContractManagers.length > 0 &&
                operationalContractManagers.map((r) => r.fullName).join(', ')
              }
            />
            <DataText label="Merknad" text={currentProcessor.note} />
            <DataText
              label="Behandler databehandler personopplysninger utenfor EU/EØS?"
              text={boolToText(currentProcessor.outsideEU)}
            />
            {currentProcessor.outsideEU && (
              <>
                <DataText
                  label="Overføringsgrunnlag for behandling utenfor EU/EØS"
                  text={currentProcessor.transferGroundsOutsideEU?.shortName}
                />

                {currentProcessor.transferGroundsOutsideEU?.code ===
                  TRANSFER_GROUNDS_OUTSIDE_EU_OTHER && (
                  <DataText
                    label="Andre overføringsgrunnlag"
                    text={currentProcessor.transferGroundsOutsideEUOther}
                  />
                )}
                <DataText
                  label="Land"
                  text={
                    currentProcessor.countries &&
                    currentProcessor.countries?.length > 0 &&
                    currentProcessor.countries
                      ?.map((country) => codelistUtils.countryName(country))
                      .join(', ')
                  }
                />
              </>
            )}
          </div>
          <div className="flex mb-4 justify-end">
            {currentProcessor.changeStamp && (
              <BodyShort size="small">
                {`Sist endret av ${currentProcessor.changeStamp.lastModifiedBy}, ${lastModifiedDate(currentProcessor.changeStamp?.lastModifiedDate)}`}
              </BodyShort>
            )}
          </div>
          <ProcessorModal
            title="Redigér Databehandler"
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
          <div>
            <RelatedProcessesTable relatedProcesses={relatedProcesses} />
          </div>
        </>
      )}
    </>
  )
}

export default ProcessorView
