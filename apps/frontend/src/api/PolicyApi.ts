import axios from "axios"
import { PageResponse, Policy } from "../constants"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

export const getPoliciesForInformationType = async (informationTypeId: string) => {
    return (await axios.get<PageResponse<Policy>>(`${server_polly}/policy/?informationTypeId=${informationTypeId}&pageSize=250`)).data
}