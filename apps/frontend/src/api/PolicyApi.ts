import axios from 'axios'
import { LegalBasesUse, LegalBasis, PageResponse, Policy, PolicyFormValues } from '../constants'
import { Code } from '../service/Codelist'
import { env } from '../util/env'
import shortid from 'shortid'

export const getPoliciesForInformationType = async (informationTypeId: string) => {
  return (await axios.get<PageResponse<Policy>>(`${env.pollyBaseUrl}/policy?informationTypeId=${informationTypeId}`)).data
}

export const getPolicy = async (policyId: string) => {
  return (await axios.get<Policy>(`${env.pollyBaseUrl}/policy/${policyId}`)).data
}

export const createPolicy = async (policy: PolicyFormValues) => {
  let body = mapPolicyFromForm(policy)
  return (await axios.post<PageResponse<Policy>>(`${env.pollyBaseUrl}/policy`, [body])).data.content[0]
}

export const createPolicies = async (policies: PolicyFormValues[]) => {
  let body = policies.map(mapPolicyFromForm)
  return (await axios.post<PageResponse<Policy>>(`${env.pollyBaseUrl}/policy`, body)).data.content
}

export const updatePolicy = async (policy: PolicyFormValues) => {
  let body = mapPolicyFromForm(policy)
  return (await axios.put<Policy>(`${env.pollyBaseUrl}/policy/${policy.id}`, body)).data
}

export const deletePolicy = async (policyId: string) => {
  return (await axios.delete<Policy>(`${env.pollyBaseUrl}/policy/${policyId}`)).data
}

export const deletePoliciesByProcessId = async (processId: string) => {
  return (await axios.delete<Policy[]>(`${env.pollyBaseUrl}/policy/process/${processId}`)).data
}

export const mapPolicyFromForm = (values: PolicyFormValues) => {
  return {
    ...values,
    subjectCategories: values.subjectCategories,
    informationType: undefined,
    informationTypeId: values.informationType?.id,
    process: undefined,
    processId: values.process.id,
    legalBases: values.legalBasesUse !== LegalBasesUse.DEDICATED_LEGAL_BASES ? [] : values.legalBases,
    legalBasesUse: values.legalBasesUse,
  }
}

export const convertLegalBasesToFormValues = (legalBases?: LegalBasis[]) =>
  (legalBases || []).map((legalBasis) => ({
    gdpr: legalBasis.gdpr && legalBasis.gdpr.code,
    nationalLaw: (legalBasis.nationalLaw && legalBasis.nationalLaw.code) || undefined,
    description: legalBasis.description || undefined,
    key: shortid.generate(),
  }))

export const convertPolicyToFormValues = (policy: Policy, otherPolicies: Policy[]): PolicyFormValues => ({
  legalBasesOpen: false,
  id: policy.id,
  process: policy.process,
  purposes: policy.purposes.map((p) => p.code),
  informationType: policy.informationType,
  subjectCategories: policy.subjectCategories.map((code: Code) => code.code),
  legalBasesUse: policy.legalBasesUse,
  legalBases: convertLegalBasesToFormValues(policy.legalBases),
  documentIds: policy.documentIds || [],
  otherPolicies,
})
