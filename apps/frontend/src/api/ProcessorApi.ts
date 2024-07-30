import axios from 'axios'
import { Option } from 'baseui/select'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { PageResponse, Processor, ProcessorFormValues } from '../constants'
import { useDebouncedState } from '../util'
import { env } from '../util/env'
import { mapBool } from '../util/helper-functions'

export const getProcessor = async (processorId: string) => {
  return (await axios.get<Processor>(`${env.pollyBaseUrl}/processor/${processorId}`)).data
}

export const getProcessorsByIds = async (ids: string[]) => {
  const processesPromise: Promise<any>[] = []
  for (const id of ids) {
    processesPromise.push(getProcessor(id))
  }
  return processesPromise.length > 0 ? await Promise.all(processesPromise) : []
}

export const getProcessorsByPageAndPageSize = async (pageNumber: number, pageSize: number) => {
  return (await axios.get<PageResponse<Processor>>(`${env.pollyBaseUrl}/processor?pageNumber=${pageNumber}&pageSize=${pageSize}`)).data
}

export const getAllProcessors = async () => {
  return (await axios.get<PageResponse<Processor>>(`${env.pollyBaseUrl}/processor`)).data
}

export const createProcessor = async (processor: ProcessorFormValues) => {
  let body = convertFormValuesToProcessor(processor)
  return (await axios.post<Processor>(`${env.pollyBaseUrl}/processor`, body)).data
}

export const searchProcessor = async (name: string) => {
  return (await axios.get<PageResponse<Processor>>(`${env.pollyBaseUrl}/processor/search/${name}`)).data
}

export const updateProcessor = async (processor: ProcessorFormValues) => {
  let body = convertFormValuesToProcessor(processor)
  return (await axios.put<Processor>(`${env.pollyBaseUrl}/processor/${body.id}`, body)).data
}

export const deleteProcessor = async (processorId: string) => {
  return (await axios.delete<Processor>(`${env.pollyBaseUrl}/processor/${processorId}`)).data
}

export const convertProcessorToFormValues = (values?: Partial<Processor>): ProcessorFormValues => {
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

export const convertProcessorToOption = (processor: Processor) => {
  return {
    id: processor.id,
    label: processor.name,
  }
}

export const convertFormValuesToProcessor = (values: ProcessorFormValues) => {
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
  const [processorSearchResult, setProcessorSearchResult] = useState<Option[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      if (processorSearch && processorSearch.length > 2) {
        setLoading(true)
        setProcessorSearchResult((await searchProcessor(processorSearch)).content.map(convertProcessorToOption))
        setLoading(false)
      } else {
        setProcessorSearchResult([])
      }
    })()
  }, [processorSearch])

  return [processorSearchResult, setProcessorSearch, loading] as [Processor[], Dispatch<SetStateAction<string>>, boolean]
}
