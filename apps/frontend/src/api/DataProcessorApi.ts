import axios from "axios"
import {DataProcessor, DataProcessorFormValues, PageResponse} from "../constants"
import {env} from "../util/env"


export const getDataProcessor = async (dataProcessorId: string) => {
  return (await axios.get<DataProcessor>(`${env.pollyBaseUrl}/dataprocessor/${dataProcessorId}`)).data
}

export const getDataProcessorsByPageAndPageSize = async (pageNumber: number, pageSize: number) => {
  return (await axios.get<PageResponse<DataProcessor>>(`${env.pollyBaseUrl}/dataprocessor?pageNumber=${pageNumber}&pageSize=${pageSize}`)).data
}

export const createDataProcessor = async (dataProcessor: DataProcessorFormValues) => {
  let body = convertFormValuesToDataProcessor(dataProcessor)
  return (await axios.post<DataProcessor>(`${env.pollyBaseUrl}/dataprocessor`, body)).data
}

export const searchDataProcessor = async (name: string) => {
  return (await axios.get<PageResponse<DataProcessor>>(`${env.pollyBaseUrl}/dataprocessor/search/${name}`)).data
}
export const updateDataProcessor = async (dataProcessor: DataProcessorFormValues) => {
  let body = convertFormValuesToDataProcessor(dataProcessor)
  return (
    await axios.put<DataProcessor>(`${env.pollyBaseUrl}/dataprocessor/${body.id}`, body)
  ).data
}

export const deleteDataProcessor = async (dataProcessorId: string) => {
  return (await axios.delete<DataProcessor>(`${env.pollyBaseUrl}/dataprocessor/${dataProcessorId}`)).data
}

export const convertFormValuesToDataProcessor = (values: DataProcessorFormValues) => {
  return {
    id: values.id,
    name: values.name,
    contract: values.contract,
    contractOwner: values.contractOwner,
    operationalContractManagers: values.operationalContractManagers,
    note: values.note,
    outsideEU: values.outsideEU,
    transferGroundsOutsideEU: values.transferGroundsOutsideEU,
    transferGroundsOutsideEUOther: values.transferGroundsOutsideEUOther,
    countries: values.countries,
    changeStamp: values.changeStamp,
  }
}

