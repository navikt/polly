import axios from "axios"
import { LegalBasesStatus, LegalBasis, PageResponse, Policy, PolicyFormValues } from "../constants"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

export const getPoliciesForInformationType = async (informationTypeId: string) => {
  return (await axios.get<PageResponse<Policy>>(`${server_polly}/policy/?informationTypeId=${informationTypeId}`)).data
}

export const getPolicy = async (policyId: string) => {
  return (await axios.get<Policy>(`${server_polly}/policy/${policyId}`)).data
}

export const createPolicy = async (policy: PolicyFormValues) => {
  let body = mapPolicyFromForm(policy)
  return (await axios.post<PageResponse<Policy>>(`${server_polly}/policy`, [body])).data.content[0]
}

export const updatePolicy = async (policy: PolicyFormValues) => {
  let body = mapPolicyFromForm(policy)
  return (await axios.put<Policy>(`${server_polly}/policy/${policy.id}`, body)).data
}

export const deletePolicy = async (policyId: string) => {
  return (await axios.delete<Policy>(`${server_polly}/policy/${policyId}`)).data
}

export const mapPolicyFromForm = (values: PolicyFormValues) => {
  return {
    ...values,
    subjectCategory: undefined,
    subjectCategories: [values.subjectCategory],
    informationType: undefined,
    informationTypeName: values.informationType && values.informationType.name,
    process: values.process.name,
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

export const convertPolicyToFormValues = (policy: Policy): PolicyFormValues => {
  let parsedLegalBases = policy.legalBases && policy.legalBases.map((legalBasis) => ({
    gdpr: legalBasis.gdpr && legalBasis.gdpr.code,
    nationalLaw: (legalBasis.nationalLaw && legalBasis.nationalLaw.code) || undefined,
    description: legalBasis.description || undefined,
    start: legalBasis.start || undefined,
    end: legalBasis.end || undefined
  }))

  return {
    legalBasesOpen: false,
    id: policy.id,
    process: policy.process,
    purposeCode: policy.purposeCode.code,
    informationType: policy.informationType,
    subjectCategory: policy?.subjectCategories.length ? policy.subjectCategories[0].code : '',
    legalBasesStatus: getInitialLegalBasesStatus(policy.legalBasesInherited, policy.legalBases),
    legalBases: parsedLegalBases,
    start: policy.start || undefined,
    end: policy.end || undefined
  }
}
