import axios from 'axios'
import {Disclosure, DisclosureFormValues, PageResponse} from '../constants'
import {env} from '../util/env'
import {convertLegalBasesToFormValues} from './PolicyApi'
import {mapBool} from '../util/helper-functions'
import {Code} from '../service/Codelist'

export const getDisclosure = async (disclosureId: string) => {
  return (await axios.get<Disclosure>(`${env.pollyBaseUrl}/disclosure/${disclosureId}`)).data;
}

export const getDisclosuresByPageAndPageSize = async (pageNumber: number, pageSize: number) => {
  return (await axios.get<PageResponse<Disclosure>>(`${env.pollyBaseUrl}/disclosure?pageNumber=${pageNumber}&pageSize=${pageSize}`)).data
}

export const getDisclosureSummaries = async () => {
  return (await axios.get<PageResponse<DisclosureSummary>>(`${env.pollyBaseUrl}/disclosure/summary`)).data
}

export const getDisclosuresWithEmptyLegalBases = async () => {
  return (await axios.get<PageResponse<Disclosure>>(`${env.pollyBaseUrl}/disclosure/?emptyLegalBases=true`)).data.content
}

export const getDisclosuresByRecipient = async (recipient: string) => {
  return (await axios.get<PageResponse<Disclosure>>(`${env.pollyBaseUrl}/disclosure/?recipient=${recipient}`)).data.content
}

export const getDisclosuresByInformationTypeId = async (informationTypeId: string) => {
  return (await axios.get<PageResponse<Disclosure>>(`${env.pollyBaseUrl}/disclosure/?informationTypeId=${informationTypeId}`)).data.content
}

export const createDisclosure = async (disclosure: DisclosureFormValues) => {
  let body = convertFormValuesToDisclosure(disclosure)
  return (await axios.post<Disclosure>(`${env.pollyBaseUrl}/disclosure`, body)).data
}

export const updateDisclosure = async (disclosure: DisclosureFormValues) => {
  let body = convertFormValuesToDisclosure(disclosure)
  return (
    await axios.put<Disclosure>(`${env.pollyBaseUrl}/disclosure/${body.id}`, body)
  ).data
}

export const deleteDisclosure = async (disclosureId: string) => {
  return (await axios.delete<Disclosure>(`${env.pollyBaseUrl}/disclosure/${disclosureId}`)).data
}

export const convertFormValuesToDisclosure = (values: DisclosureFormValues) => {
  return {
    id: values.id,
    recipient: values.recipient,
    name: values.name,
    recipientPurpose: values.recipientPurpose,
    description: values.description,
    documentId: values.document?.id,
    legalBases: values.legalBases ? values.legalBases : [],
    start: values.start,
    end: values.end,
    processIds: values.processes.map(p => p.id) || [],
    informationTypeIds: values.informationTypes ? values.informationTypes.map(i => i.id) : [],
    abroad: {
      abroad: mapBool(values.abroad.abroad),
      countries: values.abroad.countries,
      refToAgreement: values.abroad.refToAgreement,
      businessArea: values.abroad.businessArea
    }
  }
}

export const convertDisclosureToFormValues: (disclosure: Disclosure) => DisclosureFormValues = (disclosure) => {
  return {
    id: disclosure.id,
    recipient: disclosure.recipient.code || '',
    name: disclosure.name || '',
    recipientPurpose: disclosure ? disclosure.recipientPurpose : '',
    description: disclosure ? disclosure.description : '',
    document: disclosure.document,
    legalBases: convertLegalBasesToFormValues(disclosure?.legalBases || []),
    legalBasesOpen: false,
    start: disclosure.start || undefined,
    end: disclosure.end || undefined,
    processes: disclosure.processes || [],
    informationTypes: disclosure.informationTypes || [],
    abroad: {
      abroad: mapBool(disclosure.abroad.abroad),
      countries: disclosure.abroad.countries || [],
      refToAgreement: disclosure.abroad.refToAgreement || '',
      businessArea: disclosure.abroad.businessArea || ''
    }
  }
}

export interface DisclosureSummary {
  id: string;
  name: string;
  recipient: Code;
  processes: {id: string, name: string, number: number, purposes: Code[]}[]
  legalBases: number
}
