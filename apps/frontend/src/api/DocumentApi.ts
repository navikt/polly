import axios from "axios"
import { Document, DocumentFormValues, PageResponse } from "../constants"
import { env } from "../util/env"

export const getDocument = async (documentId: string) => {
  return (await axios.get<Document>(`${env.pollyBaseUrl}/document/${documentId}`)).data
}

export const getDocumentsForInformationType = async (informationTypeId: string) => {
  return (await axios.get<PageResponse<Document>>(`${env.pollyBaseUrl}/document/?informationTypeId=${informationTypeId}`)).data
}

export const searchDocuments = async (name: string) => {
  return (await axios.get<PageResponse<Document>>(`${env.pollyBaseUrl}/document/search/${name}`)).data
}

export const createDocument = async (document: DocumentFormValues) => {
  const doc = {...document, informationTypes: mapToInfoTypes(document)}
  return (await axios.post<Document>(`${env.pollyBaseUrl}/document`, doc)).data
}

export const updateDocument = async (document: DocumentFormValues) => {
  const doc = {...document, informationTypes: mapToInfoTypes(document)}
  return (await axios.put<Document>(`${env.pollyBaseUrl}/document/${doc.id}`, doc)).data
}

const mapToInfoTypes = (document: DocumentFormValues) => document.informationTypes.map(it => ({informationTypeId: it.id, subjectCategories: []}))
