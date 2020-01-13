import axios from "axios"
import { Document, DocumentFormValues } from "../constants"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT


export const getDocument = async (documentId: string) => {
    return (await axios.get<Document>(`${server_polly}/document/${documentId}`)).data
}

export const createDocument = async (document: DocumentFormValues) => {
    const doc = {...document, informationTypeIds: document.informationTypes.map(it=>it.id) }
    return (await axios.post<Document>(`${server_polly}/document`, doc)).data
}

export const updateDocument = async (document: DocumentFormValues) => {
    const doc = {...document, informationTypeIds: document.informationTypes.map(it=>it.id) }
    return (await axios.put<Document>(`${server_polly}/document/${doc.id}`, doc)).data
}