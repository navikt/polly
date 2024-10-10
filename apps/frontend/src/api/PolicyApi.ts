import axios from 'axios'
import shortid from 'shortid'
import {
  ELegalBasesUse,
  ILegalBasis,
  IPageResponse,
  IPolicy,
  IPolicyFormValues,
} from '../constants'
import { ICode } from '../service/Codelist'
import { env } from '../util/env'

export const getPoliciesForInformationType = async (informationTypeId: string) => {
  return (
    await axios.get<IPageResponse<IPolicy>>(
      `${env.pollyBaseUrl}/policy?informationTypeId=${informationTypeId}`
    )
  ).data
}

export const getPolicy = async (policyId: string) => {
  return (await axios.get<IPolicy>(`${env.pollyBaseUrl}/policy/${policyId}`)).data
}

export const createPolicy = async (policy: IPolicyFormValues) => {
  const body = mapPolicyFromForm(policy)
  return (await axios.post<IPageResponse<IPolicy>>(`${env.pollyBaseUrl}/policy`, [body])).data
    .content[0]
}

export const createPolicies = async (policies: IPolicyFormValues[]) => {
  const body = policies.map(mapPolicyFromForm)
  return (await axios.post<IPageResponse<IPolicy>>(`${env.pollyBaseUrl}/policy`, body)).data.content
}

export const updatePolicy = async (policy: IPolicyFormValues) => {
  const body = mapPolicyFromForm(policy)
  return (await axios.put<IPolicy>(`${env.pollyBaseUrl}/policy/${policy.id}`, body)).data
}

export const deletePolicy = async (policyId: string) => {
  return (await axios.delete<IPolicy>(`${env.pollyBaseUrl}/policy/${policyId}`)).data
}

export const deletePoliciesByProcessId = async (processId: string) => {
  return (await axios.delete<IPolicy[]>(`${env.pollyBaseUrl}/policy/process/${processId}`)).data
}

export const mapPolicyFromForm = (values: IPolicyFormValues) => {
  return {
    ...values,
    subjectCategories: values.subjectCategories,
    informationType: undefined,
    informationTypeId: values.informationType?.id,
    process: undefined,
    processId: values.process.id,
    legalBases:
      values.legalBasesUse !== ELegalBasesUse.DEDICATED_LEGAL_BASES ? [] : values.legalBases,
    legalBasesUse: values.legalBasesUse,
  }
}

export const convertLegalBasesToFormValues = (legalBases?: ILegalBasis[]) =>
  (legalBases || []).map((legalBasis) => ({
    gdpr: legalBasis.gdpr && legalBasis.gdpr.code,
    nationalLaw: (legalBasis.nationalLaw && legalBasis.nationalLaw.code) || undefined,
    description: legalBasis.description || undefined,
    key: shortid.generate(),
  }))

export const convertPolicyToFormValues = (
  policy: IPolicy,
  otherPolicies: IPolicy[]
): IPolicyFormValues => ({
  legalBasesOpen: false,
  id: policy.id,
  process: policy.process,
  purposes: policy.purposes.map((p) => p.code),
  informationType: policy.informationType,
  subjectCategories: policy.subjectCategories.map((code: ICode) => code.code),
  legalBasesUse: policy.legalBasesUse,
  legalBases: convertLegalBasesToFormValues(policy.legalBases),
  documentIds: policy.documentIds || [],
  otherPolicies,
})
