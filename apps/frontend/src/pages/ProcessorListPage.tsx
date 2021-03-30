import React, {useEffect, useState} from 'react'
import {convertProcessorToFormValues, createProcessor, getProcessorsByPageAndPageSize} from "../api/ProcessorApi";
import {Processor, ProcessorFormValues} from "../constants";
import {intl, theme} from "../util";
import {H4, Label1} from "baseui/typography";
import {Block} from "baseui/block";
import Button from "../components/common/Button";
import {user} from "../service/User";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import {getAll} from "../api";
import AlphabeticList from "../components/common/AlphabeticList";
import {Spinner} from "../components/common/Spinner";
import {useHistory} from "react-router-dom";
import ProcessorModal from "../components/Processor/ProcessorModal";


export const ProcessorListPage = () => {
  const [processors, setProcessors] = useState<Processor[]>([])
  const [showCreateProcessorModal, setShowCreateProcessorModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [modalErrorMessage,setModalErrorMessage] = useState<string>()
  const history = useHistory()
  const hasAccess = () => user.canWrite()

  const fetchProcessors = async () => {
    const res = (await getAll(getProcessorsByPageAndPageSize)())
    if(res){
      setProcessors(res)
    }
  }

  const handleCreateProcessor = (processor: ProcessorFormValues) => {
    if (!processor) return
    try {
      (async()=>{
        const newDataProcessor = await createProcessor(processor)
        history.push(`/processor/${newDataProcessor.id}`)
      })()
      setShowCreateProcessorModal(false)
    } catch (err) {
      setModalErrorMessage(err.response.data.message)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    fetchProcessors()
    setIsLoading(false)
  }, [])

  return isLoading ?
    (<Spinner size={theme.sizing.scale1200}/>) :
    (<>
        <H4>{intl.processors}</H4>
        <Block display={'flex'} width={'100%'} justifyContent={'space-between'}>
          <Block>
            <Label1>{intl.processorSelect}</Label1>
          </Block>

          <Block marginTop={'auto'}>
            {hasAccess() && (
              <Button
                kind="outline"
                onClick={() => setShowCreateProcessorModal(true)}
              >
                <FontAwesomeIcon icon={faPlusCircle}/>&nbsp;{intl.createProcessor}
              </Button>
            )}
          </Block>
        </Block>
        <Block>
          <AlphabeticList items={processors.map(value => {
            return {id: value.id, label: value.name}
          })} baseUrl={"/processor/"}/>
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


