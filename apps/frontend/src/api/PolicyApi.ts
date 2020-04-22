import axios from "axios"
import { LegalBasesStatus, LegalBasis, PageResponse, Policy, PolicyFormValues } from "../constants"
import { Code } from "../service/Codelist";
import { env } from "../util/env"

export const getPoliciesForInformationType = async (informationTypeId: string) => {
  return (await axios.get<PageResponse<Policy>>(`${env.pollyBaseUrl}/policy/?informationTypeId=${informationTypeId}`)).data
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

export const mapPolicyFromForm = (values: PolicyFormValues) => {
  return {
    ...values,
    subjectCategories: values.subjectCategories,
    informationType: undefined,
    informationTypeId: values.informationType?.id,
    process: undefined,
    processId: values.process.id,
    legalBases: values.legalBasesStatus !== LegalBasesStatus.OWN ? [] : values.legalBases,
    legalBasesInherited: values.legalBasesStatus === LegalBasesStatus.INHERITED,
    legalBasesStatus: undefined
  }
}

const getInitialLegalBasesStatus = (legalBasesInherited: boolean, legalBases: LegalBasis[]) => {
  if (legalBasesInherited) return LegalBasesStatus.INHERITED
  else {
    if (!legalBases || !legalBases.length) return LegalBasesStatus.UNKNOWN
    return LegalBasesStatus.OWN
  }
}

export const convertLegalBasesToFormValues = (legalBases?: LegalBasis[]) => (legalBases || [])
.map((legalBasis) => ({
  gdpr: legalBasis.gdpr && legalBasis.gdpr.code,
  nationalLaw: (legalBasis.nationalLaw && legalBasis.nationalLaw.code) || undefined,
  description: legalBasis.description || undefined,
}))

export const convertPolicyToFormValues = (policy: Policy): PolicyFormValues => ({
  legalBasesOpen: false,
  id: policy.id,
  process: policy.process,
  purposeCode: policy.purposeCode.code,
  informationType: policy.informationType,
  subjectCategories: policy.subjectCategories.map((code: Code) => code.code),
  legalBasesStatus: getInitialLegalBasesStatus(policy.legalBasesInherited, policy.legalBases),
  legalBases: convertLegalBasesToFormValues(policy.legalBases),
  start: policy.start || undefined,
  end: policy.end || undefined,
  documentIds: policy.documentIds || []
})
