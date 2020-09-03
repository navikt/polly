import axios from 'axios'
import {PageResponse, Process, ProcessCount, ProcessField, ProcessFormValues, ProcessShort, ProcessState, ProcessStatus, TRANSFER_GROUNDS_OUTSIDE_EU_OTHER} from '../constants'
import {env} from '../util/env'
import {convertLegalBasesToFormValues} from './PolicyApi'
import * as queryString from 'query-string'

export const getProcess = async (processId: string) => {
  const data = (await axios.get<Process>(`${env.pollyBaseUrl}/process/${processId}`)).data
  data.policies.forEach(p => p.process = {...data, policies: []})
  return data
}

export const getProcessByStateAndStatus = async (processField: ProcessField, processState: ProcessState, processStatus: ProcessStatus = ProcessStatus.All) => {
  return (await axios.get<PageResponse<ProcessShort>>(`${env.pollyBaseUrl}/process/state?processField=${processField}&processState=${processState}&processStatus=${processStatus}`)).data.content
}

export const searchProcess = async (text: string) => {
  return (await axios.get<PageResponse<Process>>(`${env.pollyBaseUrl}/process/search/${text}`)).data
}

export const getProcessesFor = async (params: {productTeam?: string, productArea?: string, documentId?: string, gdprArticle?: string, nationalLaw?: string}) => {
  return (await axios.get<PageResponse<Process>>(`${env.pollyBaseUrl}/process?${queryString.stringify(params, {skipNull: true})}&pageSize=250`)).data
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

const mapBool = (b?: boolean) => b === true ? true : b === false ? false : undefined

export const convertProcessToFormValues: (process?: Partial<Process>) => ProcessFormValues = process => {
  const {
    id,
    purpose,
    name,
    description,
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
    status
  } = (process || {})

  return {
    legalBasesOpen: false,
    id: id,
    name: name || '',
    description: description || '',
    purposeCode: purpose?.code || '',
    affiliation: {
      department: affiliation?.department?.code || '',
      subDepartments: affiliation?.subDepartments.map(sd => sd.code) || [],
      productTeams: affiliation?.productTeams || [],
      products: affiliation?.products.map(p => p.code) || [],
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
      dataProcessorAgreements: dataProcessing?.dataProcessorAgreements || [],
      dataProcessorOutsideEU: mapBool(dataProcessing?.dataProcessorOutsideEU),
      transferGroundsOutsideEU: dataProcessing?.transferGroundsOutsideEU?.code || undefined,
      transferGroundsOutsideEUOther: dataProcessing?.transferGroundsOutsideEUOther || '',
      transferCountries: dataProcessing?.transferCountries || []
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
    affiliation: values.affiliation,
    commonExternalProcessResponsible: values.commonExternalProcessResponsible ? values.commonExternalProcessResponsible : undefined,
    legalBases: values.legalBases ? values.legalBases : [],
    start: values.start,
    end: values.end,
    usesAllInformationTypes: values.usesAllInformationTypes,
    automaticProcessing: values.automaticProcessing,
    profiling: values.profiling,
    dataProcessing: {
      ...values.dataProcessing,
      transferGroundsOutsideEUOther: values.dataProcessing.transferGroundsOutsideEU !== TRANSFER_GROUNDS_OUTSIDE_EU_OTHER ? undefined : values.dataProcessing.transferGroundsOutsideEUOther
    },
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
