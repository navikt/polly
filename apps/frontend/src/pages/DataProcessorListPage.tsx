import React, {useEffect, useState} from 'react'
import {convertDataProcessorToFormValues, createDataProcessor, getDataProcessorsByPageAndPageSize} from "../api/DataProcessorApi";
import {DataProcessor, DataProcessorFormValues} from "../constants";
import {intl, theme} from "../util";
import {H4, Label1} from "baseui/typography";
import {Block} from "baseui/block";
import Button from "../components/common/Button";
import {user} from "../service/User";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import DataProcessorModal from "../components/DataProcessor/DataProcessorModal";
import {getAll} from "../api";
import AlphabeticList from "../components/common/AlphabeticList";
import {Spinner} from "../components/common/Spinner";


export const DataProcessorListPage = () => {
  const [dataProcessors, setDataProcessors] = useState<DataProcessor[]>([])
  const [showCreateDataProcessorModal, setShowCreateDataProcessorModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const hasAccess = () => user.canWrite()

  const fetchDataProcessors = async () => {
    const dataProcessors = (await getAll(getDataProcessorsByPageAndPageSize)())
    if (dataProcessors) {
      setDataProcessors(dataProcessors)
      console.log(dataProcessors)
    }
  }

  const handleCreateDataProcessor = (dataProcessor: DataProcessorFormValues) => {
    if (!dataProcessor) return
    try {
      createDataProcessor(dataProcessor)
      console.log(dataProcessor,"HERE")
      setShowCreateDataProcessorModal(false)
    } catch (err) {
      // if (err.response.data.message.includes('already exists')) {
      //   setErrorProcessModal('Behandlingen eksisterer allerede.')
      //   return
      // }
      // setErrorProcessModal(err.response.data.message)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    fetchDataProcessors()
    setIsLoading(false)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    fetchDataProcessors()
    setIsLoading(false)
  }, [showCreateDataProcessorModal])

  return isLoading ?
    (<Spinner size={theme.sizing.scale1200}/>) :
    (<>
        {/*<PageHeader section={Section.dataprocessor} code={id}/>*/}
        <H4>{intl.dataProcessors}</H4>
        <Block display={'flex'} width={'100%'} justifyContent={'space-between'}>
          <Block>
            <Label1>{intl.dataProcessorSelect}</Label1>
          </Block>

          <Block marginTop={'auto'}>
            {hasAccess() && (
              <Button
                kind="outline"
                onClick={() => setShowCreateDataProcessorModal(true)}
              >
                <FontAwesomeIcon icon={faPlusCircle}/>&nbsp;{intl.createDataProcessor}
              </Button>
            )}
          </Block>
        </Block>
        <Block>
          <AlphabeticList items={dataProcessors.map(value => {
            return {id: value.id, label: value.name}
          })} baseUrl={"/DataProcessor/"}/>
        </Block>
        <DataProcessorModal
          title={"Test"}
          isOpen={showCreateDataProcessorModal}
          initialValues={convertDataProcessorToFormValues({})}
          submit={handleCreateDataProcessor}
          onClose={() => setShowCreateDataProcessorModal(false)}
        />
      </>
    )
}
export default DataProcessorListPage


