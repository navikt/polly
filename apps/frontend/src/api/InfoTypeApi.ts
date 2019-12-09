import axios from "axios"
import { InformationType, PageResponse } from "../constants"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

export const getInformationTypes = async (page: number, limit: number) => {
    return (await axios.get<PageResponse<InformationType>>(`${server_polly}/informationtype/?pageNumber=${page - 1}&pageSize=${limit}`)).data
}

export const searchInformationType = async (text: string) => {
    return (await axios.get<PageResponse<InformationType>>(`${server_polly}/informationtype/search/${text}`)).data
}

export const getInformationType = async (informationTypeId: string) => {
    return (await axios.get<InformationType>(`${server_polly}/informationtype/${informationTypeId}`)).data
}
