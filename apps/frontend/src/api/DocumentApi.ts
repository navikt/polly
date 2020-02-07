import {default as React, Dispatch, SetStateAction, useEffect} from "react"
import axios from "axios"
import {
  Document,
  DocumentFormValues,
  DocumentFormValues_Temp,
  DocumentInformationTypes,
  PageResponse
} from "../constants"
import {env} from "../util/env"
import {getSettings} from "./SettingsApi"
import {useDebouncedState} from "../util"

export const getDocument = async (documentId: string) => {
  return (await axios.get<Document>(`${env.pollyBaseUrl}/document/${documentId}`)).data as Document
}

export const getDefaultProcessDocument = async () => {
  const settings = await getSettings()
  return await getDocument(settings.defaultProcessDocument)
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

export const updateInformationTypesDocument = async (document: DocumentFormValues_Temp) => {
  const body = mapFormValuesToDocument(document)
  return (await axios.put<Document>(`${env.pollyBaseUrl}/document/${document.id}`, body)).data
}

export const createInformationTypesDocument = async (document: DocumentFormValues_Temp) => {
  const body = mapFormValuesToDocument(document)
  return (await axios.post(`${env.pollyBaseUrl}/document`, body)).data
}

const mapFormValuesToDocument = (document: DocumentFormValues_Temp) => ({
  id: document.id ? document.id : undefined,
  name: document.name,
  description: document.description,
  informationTypes: document.informationTypes.map(it => ({
    informationTypeId: it.informationTypeId,
    subjectCategories: it.subjectCategories.map(sc => sc.code)
  } as DocumentInformationTypes))
})

const mapToInfoTypes = (document: DocumentFormValues) => document.informationTypes.map(it => ({
  informationTypeId: it.id,
  subjectCategories: []
}))

export const useDocumentSearch = () => {
  const [documentSearch, setDocumentSearch] = useDebouncedState<string>('', 200);
  const [documentSearchResult, setDocumentSearchResult] = React.useState<Document[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    const search = async () => {
      if (documentSearch && documentSearch.length > 2) {
        setLoading(true)
        const res = await searchDocuments(documentSearch)
        setDocumentSearchResult(res.content)
        setLoading(false)
      }
    }
    search()
  }, [documentSearch])

  return [documentSearchResult, setDocumentSearch, loading] as [Document[], Dispatch<SetStateAction<string>>, boolean]
}


