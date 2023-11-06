import React, { useEffect, useState } from 'react'
import { convertProcessorToFormValues, createProcessor, getProcessorsByPageAndPageSize } from '../api/ProcessorApi'
import { Processor, ProcessorFormValues } from '../constants'
import { intl, theme } from '../util'
import { HeadingMedium, LabelLarge } from 'baseui/typography'
import { Block } from 'baseui/block'
import Button from '../components/common/Button'
import { user } from '../service/User'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { getAll } from '../api'
import AlphabeticList from '../components/common/AlphabeticList'
import { Spinner } from '../components/common/Spinner'
import { useNavigate } from 'react-router-dom'
import ProcessorModal from '../components/Processor/ProcessorModal'
import {ampli} from "../service/Amplitude";

export const ProcessorListPage = () => {
  const [processors, setProcessors] = useState<Processor[]>([])
  const [showCreateProcessorModal, setShowCreateProcessorModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [modalErrorMessage, setModalErrorMessage] = useState<string>()
  const navigate = useNavigate()
  const hasAccess = () => user.canWrite()

  ampli.logEvent("besøk", {side: 'Databehandlere'})

  const handleCreateProcessor = (processor: ProcessorFormValues) => {
    if (!processor) return
    try {
      ;(async () => {
        const newDataProcessor = await createProcessor(processor)
        navigate(`/processor/${newDataProcessor.id}`)
      })()
      setShowCreateProcessorModal(false)
    } catch (err: any) {
      setModalErrorMessage(err.response.data.message)
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

  return isLoading ? (
    <Spinner size={theme.sizing.scale1200} />
  ) : (
    <>
      <HeadingMedium>{intl.processors}</HeadingMedium>
      <Block display={'flex'} width={'100%'} justifyContent={'space-between'}>
        <Block>
          <LabelLarge>{intl.processorSelect}</LabelLarge>
        </Block>

        <Block marginTop={'auto'}>
          {hasAccess() && (
            <Button kind="outline" onClick={() => setShowCreateProcessorModal(true)}>
              <FontAwesomeIcon icon={faPlusCircle} />
              &nbsp;{intl.createProcessor}
            </Button>
          )}
        </Block>
      </Block>
      <Block>
        <AlphabeticList
          items={processors.map((value) => {
            return { id: value.id, label: value.name }
          })}
          baseUrl={'/processor/'}
        />
      </Block>
      <ProcessorModal
        title={intl.createProcessor}
        isOpen={showCreateProcessorModal}
        initialValues={convertProcessorToFormValues({})}
        submit={handleCreateProcessor}
        errorMessage={modalErrorMessage}
        onClose={() => setShowCreateProcessorModal(false)}
      />
    </>
  )
}
export default ProcessorListPage
