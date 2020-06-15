import axios from 'axios'
import {PageResponse, Process, ProcessCount, ProcessFormValues, ProcessStatus} from '../constants'
import {env} from '../util/env'
import {convertLegalBasesToFormValues} from './PolicyApi'

export const getProcess = async (processId: string) => {
  const data = (await axios.get<Process>(`${env.pollyBaseUrl}/process/${processId}`)).data
  data.policies.forEach(p => p.process = {...data, policies: []})
  return data
}

export const getAllProcesses = async () =>{
  const data = (await axios.get<PageResponse<Process>>(`${env.pollyBaseUrl}/process/`)).data.content
  return data
}

export const searchProcess = async (text: string) => {
  return (await axios.get<PageResponse<Process>>(`${env.pollyBaseUrl}/process/search/${text}`)).data
}

export const getProcessesForPurpose = async (purpose: string) => {
  return (await axios.get<PageResponse<Process>>(`${env.pollyBaseUrl}/process/purpose/${purpose}`)).data
}

export const getProcessesForTeam = async (teamId: string) => {
  return (await axios.get<PageResponse<Process>>(`${env.pollyBaseUrl}/process?productTeam=${teamId}&pageSize=250`)).data
}

export const getProcessesForProductArea = async (productAreaId: string) => {
  return (await axios.get<PageResponse<Process>>(`${env.pollyBaseUrl}/process?productArea=${productAreaId}&pageSize=250`)).data
}

export const getProcessPurposeCount = async (query: 'purpose' | 'department' | 'subDepartment' | 'team') => {
  return (await axios.get<ProcessCount>(`${env.pollyBaseUrl}/process/count?${query}`)).data
}

export const createProcess = async (process: ProcessFormValues) => {
  let body = mapProcessFromForm(process)
  return (await axios.post<Process>(`${env.pollyBaseUrl}/process`, body)).data
}

export const deleteProcess = async (processId: string) => {
  return (await axios.delete<Process>(`${env.pollyBaseUrl}/process/${processId}`)).data
}

export const updateProcess = async (process: ProcessFormValues) => {
  let body = mapProcessFromForm(process)
  const data = (await axios.put<Process>(`${env.pollyBaseUrl}/process/${process.id}`, body)).data
  data.policies.forEach(p => p.process = {...data, policies: []})
  return data
}

export const getProcessesByDocument = async (documentId: string) => {
  return (await axios.get(`${env.pollyBaseUrl}/process/?documentId=${documentId}`)).data
}

const mapBool = (b?: boolean) => b === true ? true : b === false ? false : undefined

export const convertProcessToFormValues: (process?: Partial<Process>) => ProcessFormValues = process => {
  const {
    id,
    purposeCode,
    name,
    description,
    department,
    subDepartments,
    commonExternalProcessResponsible,
    productTeams,
    products,
    legalBases,
    start,
    end,
    usesAllInformationTypes,
    automaticProcessing,
    profiling,
    dataProcessing,
    retention,
    dpia,
    status
  } = (process || {})

  return {
    legalBasesOpen: false,
    id: id,
    name: name || '',
    description: description || '',
    purposeCode: purposeCode,
    department: (department && department.code) || undefined,
    subDepartments: (subDepartments && subDepartments.map(sd => sd.code)) || [],
    commonExternalProcessResponsible: (commonExternalProcessResponsible && commonExternalProcessResponsible.code) || undefined,
    productTeams: productTeams || [],
    products: (products && products.map(p => p.code)) || [],
    legalBases: convertLegalBasesToFormValues(legalBases),
    start: start || env.defaultStartDate,
    end: end || undefined,
    usesAllInformationTypes: process && !!usesAllInformationTypes,
    automaticProcessing: process ? mapBool(automaticProcessing) : false,
    profiling: process ? mapBool(profiling) : false,
    dataProcessing: {
      dataProcessor: mapBool(dataProcessing?.dataProcessor),
      dataProcessorAgreements: dataProcessing?.dataProcessorAgreements || [],
      dataProcessorOutsideEU: mapBool(dataProcessing?.dataProcessorOutsideEU)
    },
    retention: {
      retentionPlan: mapBool(retention?.retentionPlan),
      retentionMonths: retention?.retentionMonths || 0,
      retentionStart: retention?.retentionStart || '',
      retentionDescription: retention?.retentionDescription || ''
    },
    status: status === ProcessStatus.COMPLETED ? ProcessStatus.COMPLETED : ProcessStatus.IN_PROGRESS,
    dpia: {
      grounds: dpia?.grounds || '',
      needForDpia: mapBool(dpia?.needForDpia),
      processImplemented: dpia?.processImplemented || false,
      refToDpia: dpia?.refToDpia || '',
      riskOwner: dpia?.riskOwner || '',
      riskOwnerFunction: dpia?.riskOwnerFunction || ''
    }
  }
}

export const mapProcessFromForm = (values: ProcessFormValues) => {
  return {
    id: values.id,
    name: values.name,
    description: values.description,
    purposeCode: values.purposeCode,
    department: values.department ? values.department : undefined,
    subDepartments: values.subDepartments ? values.subDepartments : [],
    commonExternalProcessResponsible: values.commonExternalProcessResponsible ? values.commonExternalProcessResponsible : undefined,
    productTeams: values.productTeams,
    products: values.products,
    legalBases: values.legalBases ? values.legalBases : [],
    start: values.start,
    end: values.end,
    usesAllInformationTypes: values.usesAllInformationTypes,
    automaticProcessing: values.automaticProcessing,
    profiling: values.profiling,
    dataProcessing: values.dataProcessing,
    retention: values.retention,
    status: values.status,
    dpia: {
      grounds: values.dpia?.needForDpia ? '' : values.dpia?.grounds,
      needForDpia: values.dpia.needForDpia,
      refToDpia: values.dpia?.needForDpia ? values.dpia.refToDpia : '',
      processImplemented: values.dpia?.processImplemented,
      riskOwner: values.dpia?.riskOwner,
      riskOwnerFunction: values.dpia?.riskOwnerFunction
    }
  }
}
