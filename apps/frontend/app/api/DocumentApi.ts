import axios from 'axios'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  IDocument,
  IDocumentFormValues,
  IDocumentInformationTypes,
  IPageResponse,
} from '../constants'
import { useDebouncedState } from '../util'
import { env } from '../util/env'
import { getSettings } from './SettingsApi'

export const getDocument = async (documentId: string) => {
  return (await axios.get<IDocument>(`${env.pollyBaseUrl}/document/${documentId}`)).data
}

export const getDocumentByPageAndPageSize = async (pageNumber: number, pageSize: number) => {
  return (
    await axios.get<IPageResponse<IDocument>>(
      `${env.pollyBaseUrl}/document?pageNumber=${pageNumber}&pageSize=${pageSize}`
    )
  ).data
}

export const getDefaultProcessDocument = async () => {
  const settings = await getSettings()
  return await getDocument(settings.defaultProcessDocument)
}

export const getDocumentsForInformationType = async (informationTypeId: string) => {
  return (
    await axios.get<IPageResponse<IDocument>>(
      `${env.pollyBaseUrl}/document?informationTypeId=${informationTypeId}`
    )
  ).data
}

export const searchDocuments = async (name: string) => {
  return (await axios.get<IPageResponse<IDocument>>(`${env.pollyBaseUrl}/document/search/${name}`))
    .data
}

export const updateInformationTypesDocument = async (document: IDocumentFormValues) => {
  const body = mapFormValuesToDocument(document)
  return (await axios.put<IDocument>(`${env.pollyBaseUrl}/document/${document.id}`, body)).data
}

export const createInformationTypesDocument = async (document: IDocumentFormValues) => {
  const body = mapFormValuesToDocument(document)
  return (await axios.post(`${env.pollyBaseUrl}/document`, body)).data
}

export const deleteDocument = async (id: string) => {
  return (await axios.delete<IDocument>(`${env.pollyBaseUrl}/document/${id}`)).data
}

const mapFormValuesToDocument = (document: IDocumentFormValues) => ({
  id: document.id ? document.id : undefined,
  name: document.name,
  description: document.description,
  informationTypes: document.informationTypes.map(
    (it) =>
      ({
        informationTypeId: it.informationTypeId,
        subjectCategories: it.subjectCategories.map((sc) => sc.code),
      }) as IDocumentInformationTypes
  ),
  dataAccessClass: document.dataAccessClass,
})

export const useDocumentSearch = () => {
  const [documentSearch, setDocumentSearch] = useDebouncedState<string>('', 200)
  const [documentSearchResult, setDocumentSearchResult] = useState<IDocument[]>([])
  const [loading, setLoading] = useState<boolean>(false)

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

  return [documentSearchResult, setDocumentSearch, loading] as [
    IDocument[],
    Dispatch<SetStateAction<string>>,
    boolean,
  ]
}
