import axios from "axios"
import { Document, DocumentFormValues } from "../constants"
import { env } from "../util/env"

export const getDocument = async (documentId: string) => {
  return (await axios.get<Document>(`${env.pollyBaseUrl}/document/${documentId}`)).data
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
