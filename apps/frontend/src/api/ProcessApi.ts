import axios from 'axios'
import { PageResponse, Process, ProcessCount, ProcessField, ProcessFormValues, ProcessShort, ProcessState, ProcessStatus, ProcessStatusFilter, RecentEdits } from '../constants'
import { env } from '../util/env'
import { convertLegalBasesToFormValues } from './PolicyApi'
import queryString from 'query-string'
import { mapBool } from '../util/helper-functions'
import { useDebouncedState } from '../util'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export const getProcess = async (processId: string) => {
  const data = (await axios.get<Process>(`${env.pollyBaseUrl}/process/${processId}`)).data
  data.policies.forEach((p) => (p.process = { ...data, policies: [] }))
  return data
}

export const getProcessByStateAndStatus = async (processField: ProcessField, processState: ProcessState, processStatus: ProcessStatusFilter = ProcessStatusFilter.All) => {
  return (await axios.get<PageResponse<ProcessShort>>(`${env.pollyBaseUrl}/process/state?processField=${processField}&processState=${processState}&processStatus=${processStatus}`))
    .data.content
}

export const getProcessByStateAndStatusForProductArea = async (
  processField: ProcessField,
  processState: ProcessState,
  processStatus: ProcessStatusFilter = ProcessStatusFilter.All,
  productreaId: string,
) => {
  return (
    await axios.get<PageResponse<ProcessShort>>(
      `${env.pollyBaseUrl}/process/state?processField=${processField}&processState=${processState}&processStatus=${processStatus}&productAreaId=${productreaId}`,
    )
  ).data.content
}

export const getProcessByStateAndStatusForDepartment = async (
  processField: ProcessField,
  processState: ProcessState,
  processStatus: ProcessStatusFilter = ProcessStatusFilter.All,
  departmentCode: string,
) => {
  return (
    await axios.get<PageResponse<ProcessShort>>(
      `${env.pollyBaseUrl}/process/state?processField=${processField}&processState=${processState}&processStatus=${processStatus}&department=${departmentCode}`,
    )
  ).data.content
}

export const searchProcess = async (text: string) => {
  return (await axios.get<PageResponse<Process>>(`${env.pollyBaseUrl}/process/search/${text}`)).data
}

export const getProcessesByPurpose = async (text: string) => {
  return (await axios.get<PageResponse<Process>>(`${env.pollyBaseUrl}/process/purpose/${text}`)).data
}

export const getProcessesByProcessor = async (processorId: string) => {
  return (await axios.get<PageResponse<Process>>(`${env.pollyBaseUrl}/process?pageNumber=0&pageSize=200&processorId=${processorId}`)).data
}

export const getProcessesFor = async (params: { productTeam?: string; productArea?: string; documentId?: string; gdprArticle?: string; nationalLaw?: string }) => {
  return (await axios.get<PageResponse<Process>>(`${env.pollyBaseUrl}/process?${queryString.stringify(params, { skipNull: true })}&pageSize=250`)).data
}

export const getProcessPurposeCount = async (query: 'purpose' | 'department' | 'subDepartment' | 'team') => {
  return (await axios.get<ProcessCount>(`${env.pollyBaseUrl}/process/count?${query}`)).data
}

export const createProcess = async (process: ProcessFormValues) => {
  let body = convertFormValuesToProcess(process)
  return (await axios.post<Process>(`${env.pollyBaseUrl}/process`, body)).data
}

export const deleteProcess = async (processId: string) => {
  return (await axios.delete<Process>(`${env.pollyBaseUrl}/process/${processId}`)).data
}

export const updateProcess = async (process: ProcessFormValues) => {
  let body = convertFormValuesToProcess(process)
  const data = (await axios.put<Process>(`${env.pollyBaseUrl}/process/${process.id}`, body)).data
  data.policies.forEach((p) => (p.process = { ...data, policies: [] }))
  return data
}

export const getRecentEditedProcesses = async () => {
  return (await axios.get<PageResponse<RecentEdits>>(`${env.pollyBaseUrl}/process/myedits`)).data.content
}

export const convertProcessToFormValues: (process?: Partial<Process>) => ProcessFormValues = (process) => {
  const {
    id,
    purposes,
    name,
    description,
    additionalDescription,
    affiliation,
    commonExternalProcessResponsible,
    legalBases,
    start,
    end,
    usesAllInformationTypes,
    automaticProcessing,
    profiling,
    dataProcessing,
    retention,
    dpia,
    status,
  } = process || {}

  return {
    legalBasesOpen: false,
    id: id,
    name: name || '',
    description: description || '',
    additionalDescription: additionalDescription || '',
    purposes: purposes?.map((p) => p.code) || [],
    affiliation: {
      department: affiliation?.department?.code || '',
      subDepartments: affiliation?.subDepartments.map((sd) => sd.code) || [],
      productTeams: affiliation?.productTeams || [],
      products: affiliation?.products.map((p) => p.code) || [],
      disclosureDispatchers: affiliation?.disclosureDispatchers.map((d) => d.code) || [],
    },
    commonExternalProcessResponsible: (commonExternalProcessResponsible && commonExternalProcessResponsible.code) || undefined,
    legalBases: convertLegalBasesToFormValues(legalBases),
    start: start || env.defaultStartDate,
    end: end || undefined,
    usesAllInformationTypes: process && !!usesAllInformationTypes,
    automaticProcessing: process ? mapBool(automaticProcessing) : false,
    profiling: process ? mapBool(profiling) : false,
    dataProcessing: {
      dataProcessor: mapBool(dataProcessing?.dataProcessor),
      processors: dataProcessing?.processors || [],
    },
    retention: {
      retentionPlan: mapBool(retention?.retentionPlan),
      retentionMonths: retention?.retentionMonths || 0,
      retentionStart: retention?.retentionStart || '',
      retentionDescription: retention?.retentionDescription || '',
    },
    status: status || ProcessStatus.IN_PROGRESS,
    dpia: {
      grounds: dpia?.grounds || '',
      needForDpia: mapBool(dpia?.needForDpia),
      processImplemented: dpia?.processImplemented || false,
      refToDpia: dpia?.refToDpia || '',
      riskOwner: dpia?.riskOwner || '',
      riskOwnerFunction: dpia?.riskOwnerFunction || '',
      noDpiaReasons: dpia?.noDpiaReasons || [],
    },
    disclosures: [],
  }
}

export const convertFormValuesToProcess = (values: ProcessFormValues) => {
  return {
    id: values.id,
    name: values.name,
    description: values.description,
    additionalDescription: values.additionalDescription,
    purposes: values.purposes,
    affiliation: values.affiliation,
    commonExternalProcessResponsible: values.commonExternalProcessResponsible ? values.commonExternalProcessResponsible : undefined,
    legalBases: values.legalBases ? values.legalBases : [],
    start: values.start,
    end: values.end,
    usesAllInformationTypes: values.usesAllInformationTypes,
    automaticProcessing: values.automaticProcessing,
    profiling: values.profiling,
    dataProcessing: {
      dataProcessor: values.dataProcessing.dataProcessor,
      processors: values.dataProcessing.processors || [],
    },
    retention: values.retention,
    status: values.status,
    dpia: {
      grounds: values.dpia?.needForDpia ? '' : (values.dpia.noDpiaReasons || []).filter((r) => r === 'OTHER').length > 0 ? values.dpia?.grounds : '',
      needForDpia: values.dpia.needForDpia,
      refToDpia: values.dpia?.needForDpia ? values.dpia.refToDpia : '',
      processImplemented: values.dpia?.processImplemented,
      riskOwner: values.dpia?.riskOwner,
      riskOwnerFunction: values.dpia?.riskOwnerFunction,
      noDpiaReasons: values.dpia.noDpiaReasons || [],
    },
  }
}

export const useProcessSearch = () => {
  const [processSearch, setProcessSearch] = useDebouncedState<string>('', 200)
  const [processSearchResult, setProcessSearchResult] = useState<Process[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      if (processSearch && processSearch.length > 2) {
        setLoading(true)
        setProcessSearchResult((await searchProcess(processSearch)).content)
        setLoading(false)
      } else {
        setProcessSearchResult([])
      }
    })()
  }, [processSearch])

  return [processSearchResult, setProcessSearch, loading] as [Process[], Dispatch<SetStateAction<string>>, boolean]
}
