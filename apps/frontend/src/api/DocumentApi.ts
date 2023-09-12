import { default as React, Dispatch, SetStateAction, useEffect } from 'react'
import axios from 'axios'
import { Document, DocumentFormValues, DocumentInformationTypes, PageResponse } from '../constants'
import { env } from '../util/env'
import { getSettings } from './SettingsApi'
import { useDebouncedState } from '../util'

export const getDocument = async (documentId: string) => {
  return (await axios.get<Document>(`${env.pollyBaseUrl}/document/${documentId}`)).data
}

export const getDocumentByPageAndPageSize = async (pageNumber: number, pageSize: number) => {
  return (await axios.get<PageResponse<Document>>(`${env.pollyBaseUrl}/document?pageNumber=${pageNumber}&pageSize=${pageSize}`)).data
}

export const getDefaultProcessDocument = async () => {
  const settings = await getSettings()
  return await getDocument(settings.defaultProcessDocument)
}

export const getDocumentsForInformationType = async (informationTypeId: string) => {
  return (await axios.get<PageResponse<Document>>(`${env.pollyBaseUrl}/document?informationTypeId=${informationTypeId}`)).data
}

export const searchDocuments = async (name: string) => {
  return (await axios.get<PageResponse<Document>>(`${env.pollyBaseUrl}/document/search/${name}`)).data
}

export const updateInformationTypesDocument = async (document: DocumentFormValues) => {
  const body = mapFormValuesToDocument(document)
  return (await axios.put<Document>(`${env.pollyBaseUrl}/document/${document.id}`, body)).data
}

export const createInformationTypesDocument = async (document: DocumentFormValues) => {
  const body = mapFormValuesToDocument(document)
  return (await axios.post(`${env.pollyBaseUrl}/document`, body)).data
}

export const deleteDocument = async (id: string) => {
  return (await axios.delete<Document>(`${env.pollyBaseUrl}/document/${id}`)).data
}

const mapFormValuesToDocument = (document: DocumentFormValues) => ({
  id: document.id ? document.id : undefined,
  name: document.name,
  description: document.description,
  informationTypes: document.informationTypes.map(
    (it) =>
      ({
        informationTypeId: it.informationTypeId,
        subjectCategories: it.subjectCategories.map((sc) => sc.code),
      }) as DocumentInformationTypes,
  ),
  dataAccessClass: document.dataAccessClass,
})

export const useDocumentSearch = () => {
  const [documentSearch, setDocumentSearch] = useDebouncedState<string>('', 200)
  const [documentSearchResult, setDocumentSearchResult] = React.useState<Document[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      if (documentSearch && documentSearch.length > 2) {
        setLoading(true)
        setDocumentSearchResult((await searchDocuments(documentSearch)).content)
        setLoading(false)
      } else {
        setDocumentSearchResult([])
      }
    })()
  }, [documentSearch])

  return [documentSearchResult, setDocumentSearch, loading] as [Document[], Dispatch<SetStateAction<string>>, boolean]
}
