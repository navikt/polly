import axios from "axios";
import { Disclosure, DisclosureFormValues, PageResponse } from "../constants";
import { env } from "../util/env"
import { convertLegalBasesToFormValues } from "./PolicyApi"

export const getAllDisclosures = async (pageSize: number, pageNumber: number) => {
  return (await axios.get<PageResponse<Disclosure>>(`${env.pollyBaseUrl}/disclosure?pageSize=${pageSize}&pageNumber=${pageNumber}`)).data.content;
};

export const getDisclosure = async (disclosureId: string) => {
  return (await axios.get<Disclosure>(`${env.pollyBaseUrl}/disclosure/${disclosureId}`)).data;
};

export const getDisclosuresByRecipient = async (recipient: string) => {
  return (await axios.get<PageResponse<Disclosure>>(`${env.pollyBaseUrl}/disclosure/?recipient=${recipient}`)).data.content
}

export const getDisclosuresByInformationTypeId = async (informationTypeId: string) => {
  return (await axios.get<PageResponse<Disclosure>>(`${env.pollyBaseUrl}/disclosure/?informationTypeId=${informationTypeId}`)).data.content
}

export const createDisclosure = async (disclosure: DisclosureFormValues) => {
  let body = mapDisclosureFromForm(disclosure);
  return (await axios.post<Disclosure>(`${env.pollyBaseUrl}/disclosure`, body)).data;
};

export const updateDisclosure = async (disclosure: DisclosureFormValues) => {
  let body = mapDisclosureFromForm(disclosure);
  return (
    await axios.put<Disclosure>(`${env.pollyBaseUrl}/disclosure/${body.id}`, body)
  ).data;
};

export const deleteDisclosure = async (disclosureId: string) => {
  return (await axios.delete<Disclosure>(`${env.pollyBaseUrl}/disclosure/${disclosureId}`)).data
}

export const mapDisclosureFromForm = (values: DisclosureFormValues) => {
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
    informationTypeIds: values.informationTypes ? values.informationTypes.map(i => i.id) : []
  };
};

export const mapDisclosureToFormValues: (disclosure: Disclosure) => DisclosureFormValues = (disclosure) => {
  console.log(disclosure, "TOFRO")

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
  }
}

