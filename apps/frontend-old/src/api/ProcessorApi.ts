import axios from 'axios'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { IPageResponse, IProcessor, IProcessorFormValues } from '../constants'
import { useDebouncedState } from '../util'
import { env } from '../util/env'
import { mapBool } from '../util/helper-functions'

export const getProcessor = async (processorId: string) => {
  return (await axios.get<IProcessor>(`${env.pollyBaseUrl}/processor/${processorId}`)).data
}

export const getProcessorsByIds = async (ids: string[]) => {
  const processesPromise: Promise<any>[] = []
  for (const id of ids) {
    processesPromise.push(getProcessor(id))
  }
  return processesPromise.length > 0 ? await Promise.all(processesPromise) : []
}

export const getProcessorsByPageAndPageSize = async (pageNumber: number, pageSize: number) => {
  return (
    await axios.get<IPageResponse<IProcessor>>(
      `${env.pollyBaseUrl}/processor?pageNumber=${pageNumber}&pageSize=${pageSize}`
    )
  ).data
}

export const getAllProcessors = async () => {
  return (await axios.get<IPageResponse<IProcessor>>(`${env.pollyBaseUrl}/processor`)).data
}

export const createProcessor = async (processor: IProcessorFormValues) => {
  const body = convertFormValuesToProcessor(processor)
  return (await axios.post<IProcessor>(`${env.pollyBaseUrl}/processor`, body)).data
}

export const searchProcessor = async (name: string) => {
  return (
    await axios.get<IPageResponse<IProcessor>>(`${env.pollyBaseUrl}/processor/search/${name}`)
  ).data
}

export const updateProcessor = async (processor: IProcessorFormValues) => {
  const body = convertFormValuesToProcessor(processor)
  return (await axios.put<IProcessor>(`${env.pollyBaseUrl}/processor/${body.id}`, body)).data
}

export const deleteProcessor = async (processorId: string) => {
  return (await axios.delete<IProcessor>(`${env.pollyBaseUrl}/processor/${processorId}`)).data
}

export const convertProcessorToFormValues = (
  values?: Partial<IProcessor>
): IProcessorFormValues => {
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
    countries,
  } = values || {}

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

export const convertProcessorToOption = (processor: IProcessor) => {
  return {
    value: processor.id,
    label: processor.name,
  }
}

export const convertFormValuesToProcessor = (values: IProcessorFormValues) => {
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

export const useProcessorSearch = () => {
  const [processorSearch, setProcessorSearch] = useDebouncedState<string>('', 200)
  const [processorSearchResult, setProcessorSearchResult] = useState<IProcessor[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      if (processorSearch && processorSearch.length > 2) {
        setLoading(true)
        setProcessorSearchResult((await searchProcessor(processorSearch)).content)
        setLoading(false)
      } else {
        setProcessorSearchResult([])
      }
    })()
  }, [processorSearch])

  return [processorSearchResult, setProcessorSearch, loading] as [
    IProcessor[],
    Dispatch<SetStateAction<string>>,
    boolean,
  ]
}
