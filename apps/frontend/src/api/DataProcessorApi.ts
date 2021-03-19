import axios from "axios"
import {DataProcessor, DataProcessorFormValues, PageResponse} from "../constants"
import {env} from "../util/env"
import {mapBool} from "../util/helper-functions";
import {useDebouncedState} from "../util";
import {default as React, Dispatch, SetStateAction, useEffect} from "react";
import {Option} from "baseui/select";


export const getDataProcessor = async (dataProcessorId: string) => {
  return (await axios.get<DataProcessor>(`${env.pollyBaseUrl}/processor/${dataProcessorId}`)).data
}

export const getDataProcessorsByIds = async (ids: string[]) => {
  let dataProcessors: DataProcessor[] = []
  for (const id of ids) {
    dataProcessors = [...dataProcessors, await getDataProcessor(id)]
  }
  return dataProcessors
}

export const getDataProcessorsByPageAndPageSize = async (pageNumber: number, pageSize: number) => {
  return (await axios.get<PageResponse<DataProcessor>>(`${env.pollyBaseUrl}/processor?pageNumber=${pageNumber}&pageSize=${pageSize}`)).data
}

export const getAllDataProcessors = async () => {
  return (await axios.get<PageResponse<DataProcessor>>(`${env.pollyBaseUrl}/processor`)).data
}

export const createDataProcessor = async (dataProcessor: DataProcessorFormValues) => {
  let body = convertFormValuesToDataProcessor(dataProcessor)
  return (await axios.post<DataProcessor>(`${env.pollyBaseUrl}/processor`, body)).data
}

export const searchDataProcessor = async (name: string) => {
  return (await axios.get<PageResponse<DataProcessor>>(`${env.pollyBaseUrl}/processor/search/${name}`)).data
}

export const updateDataProcessor = async (dataProcessor: DataProcessorFormValues) => {
  let body = convertFormValuesToDataProcessor(dataProcessor)
  return (
    await axios.put<DataProcessor>(`${env.pollyBaseUrl}/processor/${body.id}`, body)
  ).data
}

export const deleteDataProcessor = async (dataProcessorId: string) => {
  return (await axios.delete<DataProcessor>(`${env.pollyBaseUrl}/processor/${dataProcessorId}`)).data
}

export const convertDataProcessorToFormValues = (values?: Partial<DataProcessor>): DataProcessorFormValues => {
  const {
    id,
    name,
    contract,
    contractOwner,
    operationalContractManagers,
    note,
    outsideEU,
    transferGroundsOutsideEU,
    transferGroundsOutsideEUOther,
    countries
  } = (values || {})

  return {
    id: id || '',
    name: name || '',
    contract: contract || '',
    contractOwner: contractOwner || '',
    operationalContractManagers: operationalContractManagers || [],
    note: note || '',
    outsideEU: mapBool(outsideEU),
    transferGroundsOutsideEU: transferGroundsOutsideEU?.code || undefined,
    transferGroundsOutsideEUOther: transferGroundsOutsideEUOther || '',
    countries: countries || [],
  }
}

export const convertDataProcessorToOption = (dataProcessor:DataProcessor)=>{
  return {
    id:dataProcessor.id,
    label: dataProcessor.name
  }
}

export const convertFormValuesToDataProcessor = (values: DataProcessorFormValues) => {
  return {
    id: values.id,
    name: values.name,
    contract: values.contract,
    contractOwner: values.contractOwner,
    operationalContractManagers: values.operationalContractManagers || [],
    note: values.note,
    outsideEU: values.outsideEU,
    transferGroundsOutsideEU: values.transferGroundsOutsideEU,
    transferGroundsOutsideEUOther: values.transferGroundsOutsideEUOther,
    countries: values.countries,
  }
}

export const useDataProcessorSearch = () => {
  const [dataProcessorSearch, setDataProcessorSearch] = useDebouncedState<string>('', 200)
  const [dataProcessorSearchResult, setDataProcessorSearchResult] = React.useState<Option[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)

  useEffect(() => {
    (async () => {
      if (dataProcessorSearch && dataProcessorSearch.length > 2) {
        setLoading(true)
        setDataProcessorSearchResult((await searchDataProcessor(dataProcessorSearch)).content.map(convertDataProcessorToOption))
        setLoading(false)
      } else {
        setDataProcessorSearchResult([])
      }
    })()
  }, [dataProcessorSearch])

  return [dataProcessorSearchResult, setDataProcessorSearch, loading] as [DataProcessor[], Dispatch<SetStateAction<string>>, boolean]
}
