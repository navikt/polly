import axios from "axios"
import { ListName } from "../service/Codelist"
import { CodeUsage, CategoryUsage } from "../constants"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

export const getCodelistUsageByListName = async (listname: string) => {
    return (await axios.get<CategoryUsage>(`${server_polly}/codelist/usage/find/${listname}`)).data
}

export const getCodelistUsage = async (listname: ListName, code: string) => {
    return (await axios.get<CodeUsage>(`${server_polly}/codelist/usage/find/${listname}/${code}`)).data
}

export const replaceCodelistUsage = async (listname: ListName, oldCode: string, newCode: string) => {
    return (await axios.post<CodeUsage>(`${server_polly}/codelist/usage/replace`, {list: listname, oldCode, newCode})).data
}