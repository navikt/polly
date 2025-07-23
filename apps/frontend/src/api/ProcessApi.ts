import axios from 'axios'
import queryString from 'query-string'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  EProcessField,
  EProcessState,
  EProcessStatus,
  EProcessStatusFilter,
  IPageResponse,
  IProcess,
  IProcessCount,
  IProcessFormValues,
  IProcessShort,
  IRecentEdits,
} from '../constants'
import { useDebouncedState } from '../util'
import { env } from '../util/env'
import { mapBool } from '../util/helper-functions'
import { convertLegalBasesToFormValues } from './PolicyApi'

export const getProcess = async (processId: string) => {
  const data = (await axios.get<IProcess>(`${env.pollyBaseUrl}/process/${processId}`)).data
  data.policies.forEach((p) => (p.process = { ...data, policies: [] }))
  return data
}

export const getProcessByStateAndStatus = async (
  processField: EProcessField,
  processState: EProcessState,
  processStatus: EProcessStatusFilter = EProcessStatusFilter.All
) => {
  return (
    await axios.get<IPageResponse<IProcessShort>>(
      `${env.pollyBaseUrl}/process/state?processField=${processField}&processState=${processState}&processStatus=${processStatus}`
    )
  ).data.content
}

export const getProcessByStateAndStatusForProductArea = async (
  processField: EProcessField,
  processState: EProcessState,
  processStatus: EProcessStatusFilter = EProcessStatusFilter.All,
  productreaId: string
) => {
  return (
    await axios.get<IPageResponse<IProcessShort>>(
      `${env.pollyBaseUrl}/process/state?processField=${processField}&processState=${processState}&processStatus=${processStatus}&productAreaId=${productreaId}`
    )
  ).data.content
}

export const getProcessByStateAndStatusForDepartment = async (
  processField: EProcessField,
  processState: EProcessState,
  processStatus: EProcessStatusFilter = EProcessStatusFilter.All,
  departmentCode: string
) => {
  return (
    await axios.get<IPageResponse<IProcessShort>>(
      `${env.pollyBaseUrl}/process/state?processField=${processField}&processState=${processState}&processStatus=${processStatus}&department=${departmentCode}`
    )
  ).data.content
}

export const searchProcess = async (text: string) => {
  return (await axios.get<IPageResponse<IProcess>>(`${env.pollyBaseUrl}/process/search/${text}`))
    .data
}

export const getProcessesByPurpose = async (text: string) => {
  return (await axios.get<IPageResponse<IProcess>>(`${env.pollyBaseUrl}/process/purpose/${text}`))
    .data
}

export const getProcessesByProcessor = async (processorId: string) => {
  return (
    await axios.get<IPageResponse<IProcess>>(
      `${env.pollyBaseUrl}/process?pageNumber=0&pageSize=200&processorId=${processorId}`
    )
  ).data
}

export const getProcessesFor = async (params: {
  productTeam?: string
  productArea?: string
  documentId?: string
  gdprArticle?: string
  nationalLaw?: string
}) => {
  return (
    await axios.get<IPageResponse<IProcess>>(
      `${env.pollyBaseUrl}/process?${queryString.stringify(params, { skipNull: true })}&pageSize=250`
    )
  ).data
}

export const getProcessPurposeCount = async (
  query: 'purpose' | 'department' | 'subDepartment' | 'team'
) => {
  return (await axios.get<IProcessCount>(`${env.pollyBaseUrl}/process/count?${query}`)).data
}

export const createProcess = async (process: IProcessFormValues) => {
  const body = convertFormValuesToProcess(process)
  return (await axios.post<IProcess>(`${env.pollyBaseUrl}/process`, body)).data
}

export const deleteProcess = async (processId: string) => {
  return (await axios.delete<IProcess>(`${env.pollyBaseUrl}/process/${processId}`)).data
}

export const updateProcess = async (process: IProcessFormValues) => {
  const body = convertFormValuesToProcess(process)
  const data = (await axios.put<IProcess>(`${env.pollyBaseUrl}/process/${process.id}`, body)).data
  data.policies.forEach((p) => (p.process = { ...data, policies: [] }))
  return data
}

export const getRecentEditedProcesses = async () => {
  return (await axios.get<IPageResponse<IRecentEdits>>(`${env.pollyBaseUrl}/process/myedits`)).data
    .content
}

export const convertProcessToFormValues: (process?: Partial<IProcess>) => IProcessFormValues = (
  process
) => {
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
    aiUsageDescription,
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
      nomDepartmentId: affiliation?.nomDepartmentId || '',
      nomDepartmentName: affiliation?.nomDepartmentName || '',
      subDepartments: affiliation?.subDepartments.map((sd) => sd.code) || [],
      productTeams: affiliation?.productTeams || [],
      products: affiliation?.products.map((p) => p.code) || [],
      disclosureDispatchers: affiliation?.disclosureDispatchers.map((d) => d.code) || [],
    },
    commonExternalProcessResponsible:
      (commonExternalProcessResponsible && commonExternalProcessResponsible.code) || undefined,
    legalBases: convertLegalBasesToFormValues(legalBases),
    start: start || env.defaultStartDate,
    end: end || undefined,
    usesAllInformationTypes: process && !!usesAllInformationTypes,
    automaticProcessing: process ? mapBool(automaticProcessing) : false,
    profiling: process ? mapBool(profiling) : false,
    aiUsageDescription: {
      aiUsage: mapBool(aiUsageDescription?.aiUsage),
      description: aiUsageDescription?.description || '',
      reusingPersonalInformation: mapBool(aiUsageDescription?.reusingPersonalInformation),
      startDate: aiUsageDescription?.startDate || env.defaultStartDate,
      endDate: aiUsageDescription?.endDate || undefined,
      registryNumber: aiUsageDescription?.registryNumber || '',
    },
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
    status: status || EProcessStatus.IN_PROGRESS,
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

export const convertFormValuesToProcess = (values: IProcessFormValues) => {
  return {
    id: values.id,
    name: values.name,
    description: values.description,
    additionalDescription: values.additionalDescription,
    purposes: values.purposes,
    affiliation: values.affiliation,
    commonExternalProcessResponsible: values.commonExternalProcessResponsible
      ? values.commonExternalProcessResponsible
      : undefined,
    legalBases: values.legalBases ? values.legalBases : [],
    start: values.start,
    end: values.end,
    usesAllInformationTypes: values.usesAllInformationTypes,
    automaticProcessing: values.automaticProcessing,
    profiling: values.profiling,
    aiUsageDescription: {
      aiUsage: values.aiUsageDescription.aiUsage,
      description: values.aiUsageDescription.description,
      reusingPersonalInformation: values.aiUsageDescription.reusingPersonalInformation,
      startDate: values.aiUsageDescription.startDate,
      endDate: values.aiUsageDescription.endDate,
      registryNumber: values.aiUsageDescription.registryNumber,
    },
    dataProcessing: {
      dataProcessor: values.dataProcessing.dataProcessor,
      processors: values.dataProcessing.processors || [],
    },
    retention: values.retention,
    status: values.status,
    dpia: {
      grounds: values.dpia?.needForDpia
        ? ''
        : (values.dpia.noDpiaReasons || []).filter((r) => r === 'OTHER').length > 0
          ? values.dpia?.grounds
          : '',
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
  const [processSearchResult, setProcessSearchResult] = useState<IProcess[]>([])
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

  return [processSearchResult, setProcessSearch, loading] as [
    IProcess[],
    Dispatch<SetStateAction<string>>,
    boolean,
  ]
}

export const searchProcessOptions = async (searchParam: string) => {
  if (searchParam && searchParam.length > 2) {
    const behandlinger = (await searchProcess(searchParam)).content
    if (behandlinger && behandlinger.length) {
      return behandlinger.map((behandling) => {
        return {
          value: behandling.id,
          label:
            'B' +
            behandling.number +
            ' ' +
            behandling.purposes[0].shortName +
            ': ' +
            behandling.name,
          ...behandling,
        }
      })
    }
  }
  return []
}
