import axios from "axios"
import { PageResponse, Process, ProcessFormValues, ProcessCount } from "../constants"
import { env } from "../util/env"
import { convertLegalBasesToFormValues } from "./PolicyApi"

export const getProcess = async (processId: string) => {
  const data = (await axios.get<Process>(`${env.pollyBaseUrl}/process/${processId}`)).data
  data.policies.forEach(p => p.process = {...data, policies: []})
  return data
}

export const searchProcess = async (text: string) => {
  return (await axios.get<PageResponse<Process>>(`${env.pollyBaseUrl}/process/search/${text}`)).data
}

export const getProcessesForPurpose = async (purpose: string) => {
  return (await axios.get<PageResponse<Process>>(`${env.pollyBaseUrl}/process/purpose/${purpose}`)).data
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
};

const mapBool = (b?: boolean) => b === true ? true : b === false ? false : undefined

export const convertProcessToFormValues: (process?: Partial<Process>) => ProcessFormValues = process => {
  const {
    id,
    purposeCode,
    name,
    description,
    department,
    subDepartment,
    productTeam,
    products,
    legalBases,
    start,
    end,
    automaticProcessing,
    profiling,
    dataProcessing,
    retention
  } = (process || {})

  return {
    legalBasesOpen: false,
    id: id,
    name: name || '',
    description: description || '',
    purposeCode: purposeCode,
    department: (department && department.code) || undefined,
    subDepartment: (subDepartment && subDepartment.code) || undefined,
    productTeam: productTeam || undefined,
    products: (products && products.map(p => p.code)) || [],
    legalBases: convertLegalBasesToFormValues(legalBases),
    start: start || undefined,
    end: end || undefined,
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
    subDepartment: values.subDepartment ? values.subDepartment : undefined,
    productTeam: values.productTeam,
    products: values.products,
    legalBases: values.legalBases ? values.legalBases : [],
    start: values.start,
    end: values.end,
    automaticProcessing: values.automaticProcessing,
    profiling: values.profiling,
    dataProcessing: values.dataProcessing,
    retention: values.retention
  }
}
