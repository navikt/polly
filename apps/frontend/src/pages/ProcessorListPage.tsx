import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { HeadingMedium, LabelLarge } from 'baseui/typography'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAll } from '../api/GetAllApi'
import {
  convertProcessorToFormValues,
  createProcessor,
  getProcessorsByPageAndPageSize,
} from '../api/ProcessorApi'
import ProcessorModal from '../components/Processor/ProcessorModal'
import AlphabeticList from '../components/common/AlphabeticList'
import Button from '../components/common/Button/CustomButton'
import { Spinner } from '../components/common/Spinner'
import { IProcessor, IProcessorFormValues } from '../constants'
import { ampli } from '../service/Amplitude'
import { user } from '../service/User'
import { theme } from '../util'

export const ProcessorListPage = () => {
  const [processors, setProcessors] = useState<IProcessor[]>([])
  const [showCreateProcessorModal, setShowCreateProcessorModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [modalErrorMessage, setModalErrorMessage] = useState<string>()
  const navigate = useNavigate()
  const hasAccess = () => user.canWrite()

  ampli.logEvent('besøk', {
    side: 'Databehandlere',
    url: '/processor',
    app: 'Behandlingskatalogen',
  })

  const handleCreateProcessor = (processor: IProcessorFormValues) => {
    if (!processor) return
    try {
      ;(async () => {
        const newDataProcessor = await createProcessor(processor)
        navigate(`/processor/${newDataProcessor.id}`)
      })()
      setShowCreateProcessorModal(false)
    } catch (error: any) {
      setModalErrorMessage(error.response.data.message)
    }
  }

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const res = await getAll(getProcessorsByPageAndPageSize)()
      if (res) {
        setProcessors(res)
      }
      setIsLoading(false)
    })()
  }, [])

  return (
    <>
      {isLoading && <Spinner size={theme.sizing.scale1200} />}
      {!isLoading && (
        <>
          <HeadingMedium>Databehandlere</HeadingMedium>
          <div className="flex w-full justify-between">
            <div>
              <LabelLarge>Databehandlere</LabelLarge>
            </div>

            <div className="mt-auto">
              {hasAccess() && (
                <Button kind="outline" onClick={() => setShowCreateProcessorModal(true)}>
                  <FontAwesomeIcon icon={faPlusCircle} />
                  &nbsp;Opprett ny databehandler
                </Button>
              )}
            </div>
          </div>
          <div>
            <AlphabeticList
              items={processors.map((value) => {
                return { id: value.id, label: value.name }
              })}
              baseUrl={'/processor/'}
            />
          </div>
          <ProcessorModal
            title="Opprett ny databehandler"
            isOpen={showCreateProcessorModal}
            initialValues={convertProcessorToFormValues({})}
            submit={handleCreateProcessor}
            errorMessage={modalErrorMessage}
            onClose={() => setShowCreateProcessorModal(false)}
          />
        </>
      )}
    </>
  )
}

export default ProcessorListPage
