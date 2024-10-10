import axios from 'axios'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { IAffiliation, IDisclosure, IDisclosureFormValues, IPageResponse } from '../constants'
import { ICode } from '../service/Codelist'
import { useDebouncedState } from '../util'
import { env } from '../util/env'
import { mapBool } from '../util/helper-functions'
import { convertLegalBasesToFormValues } from './PolicyApi'

export const getAllDisclosures = async (pageSize: number, pageNumber: number) => {
  return (
    await axios.get<IPageResponse<IDisclosure>>(
      `${env.pollyBaseUrl}/disclosure?pageSize=${pageSize}&pageNumber=${pageNumber}`
    )
  ).data.content
}

export const getDisclosure = async (disclosureId: string) => {
  return (await axios.get<IDisclosure>(`${env.pollyBaseUrl}/disclosure/${disclosureId}`)).data
}

export const getDisclosuresByPageAndPageSize = async (pageNumber: number, pageSize: number) => {
  return (
    await axios.get<IPageResponse<IDisclosure>>(
      `${env.pollyBaseUrl}/disclosure?pageNumber=${pageNumber}&pageSize=${pageSize}`
    )
  ).data
}

export const getDisclosureSummaries = async () => {
  return (
    await axios.get<IPageResponse<IDisclosureSummary>>(`${env.pollyBaseUrl}/disclosure/summary`)
  ).data
}

export const getDisclosuresWithEmptyLegalBases = async () => {
  return (
    await axios.get<IPageResponse<IDisclosure>>(
      `${env.pollyBaseUrl}/disclosure?emptyLegalBases=true`
    )
  ).data.content
}

export const getDisclosuresByRecipient = async (recipient: string) => {
  return (
    await axios.get<IPageResponse<IDisclosure>>(
      `${env.pollyBaseUrl}/disclosure?recipient=${recipient}`
    )
  ).data.content
}

export const getDisclosuresByProcessId = async (processId: string) => {
  return (
    await axios.get<IPageResponse<IDisclosure>>(
      `${env.pollyBaseUrl}/disclosure?processId=${processId}`
    )
  ).data.content
}

export const getDisclosuresByInformationTypeId = async (informationTypeId: string) => {
  return (
    await axios.get<IPageResponse<IDisclosure>>(
      `${env.pollyBaseUrl}/disclosure?informationTypeId=${informationTypeId}`
    )
  ).data.content
}

export const searchDisclosure = async (text: string) => {
  return (
    await axios.get<IPageResponse<IDisclosure>>(`${env.pollyBaseUrl}/disclosure/search/${text}`)
  ).data
}

export const getDisclosureByDepartment = async (department: string) => {
  return (
    await axios.get<IPageResponse<IDisclosure>>(
      `${env.pollyBaseUrl}/disclosure/department/${department}`
    )
  ).data
}

export const getDisclosureByProductTeam = async (productTeam: string) => {
  return (
    await axios.get<IPageResponse<IDisclosure>>(
      `${env.pollyBaseUrl}/disclosure/productTeam/${productTeam}`
    )
  ).data
}

export const createDisclosure = async (disclosure: IDisclosureFormValues) => {
  const body = convertFormValuesToDisclosure(disclosure)
  return (await axios.post<IDisclosure>(`${env.pollyBaseUrl}/disclosure`, body)).data
}

export const updateDisclosure = async (disclosure: IDisclosureFormValues) => {
  const body = convertFormValuesToDisclosure(disclosure)
  return (await axios.put<IDisclosure>(`${env.pollyBaseUrl}/disclosure/${body.id}`, body)).data
}

export const deleteDisclosure = async (disclosureId: string) => {
  return (await axios.delete<IDisclosure>(`${env.pollyBaseUrl}/disclosure/${disclosureId}`)).data
}

export const convertFormValuesToDisclosure = (values: IDisclosureFormValues) => {
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
    processIds:
      values.processIds.length > 0 ? values.processIds : values.processes.map((p) => p.id) || [],
    informationTypeIds: values.informationTypes ? values.informationTypes.map((i) => i.id) : [],
    abroad: {
      abroad: mapBool(values.abroad.abroad),
      countries: values.abroad.countries,
      refToAgreement: values.abroad.refToAgreement,
      businessArea: values.abroad.businessArea,
    },
    administrationArchiveCaseNumber: values.administrationArchiveCaseNumber,
    thirdCountryReceiver: mapBool(values.thirdCountryReceiver),
    assessedConfidentiality: mapBool(values.assessedConfidentiality),
    confidentialityDescription: values.confidentialityDescription,
    productTeams: values.productTeams,
    department: values.department,
  }
}

export const convertDisclosureToFormValues: (disclosure: IDisclosure) => IDisclosureFormValues = (
  disclosure
) => {
  return {
    id: disclosure.id,
    recipient: disclosure.recipient.code || '',
    name: disclosure.name || '',
    recipientPurpose: disclosure ? disclosure.recipientPurpose : '',
    description: disclosure.description || '',
    document: disclosure.document
      ? {
          name: disclosure.document.name,
          description: disclosure.document.description,
          dataAccessClass: disclosure.document.dataAccessClass
            ? disclosure.document.dataAccessClass.code
            : '',
          informationTypes: disclosure.document.informationTypes,
        }
      : undefined,
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
      businessArea: disclosure.abroad.businessArea || '',
    },
    productTeams: disclosure.productTeams || [],
    department: disclosure?.department?.code || '',
    processIds: disclosure.processIds || [],
    administrationArchiveCaseNumber: disclosure.administrationArchiveCaseNumber || '',
    thirdCountryReceiver: mapBool(disclosure.thirdCountryReceiver),
    assessedConfidentiality: mapBool(disclosure.assessedConfidentiality),
    confidentialityDescription: disclosure.confidentialityDescription || '',
  }
}

export const useDisclosureSearch = () => {
  const [disclosureSearch, setDisclosureSearch] = useDebouncedState<string>('', 200)
  const [disclosureSearchResult, setDisclosureSearchResult] = useState<IDisclosure[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      if (disclosureSearch && disclosureSearch.length > 2) {
        setLoading(true)
        setDisclosureSearchResult((await searchDisclosure(disclosureSearch)).content)
        setLoading(false)
      } else {
        setDisclosureSearchResult([])
      }
    })()
  }, [disclosureSearch])

  return [disclosureSearchResult, setDisclosureSearch, loading] as [
    IDisclosure[],
    Dispatch<SetStateAction<string>>,
    boolean,
  ]
}

export interface IDisclosureSummary {
  id: string
  name: string
  recipient: ICode
  processes: { id: string; name: string; number: number; purposes: ICode[] }[]
  legalBases: number
  affiliation: IAffiliation
}
